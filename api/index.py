import os
import sqlite3
import requests
import bcrypt
import uuid
from datetime import datetime, timedelta
from fastapi import FastAPI, Request, Header
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sys

# ========== CONFIG ==========
FLW_SECRET_KEY = os.environ.get("FLW_SECRET_KEY")
FLW_ENCRYPTION_KEY = os.environ.get("FLW_ENCRYPTION_KEY")
APP_URL = os.environ.get("APP_URL", "https://your-app.vercel.app")

DB_NAME = "/tmp/database.db"  # Use /tmp for serverless environment

# PRICES IN NAIRA
PLANS = {
    "Starter": 2500,
    "Pro": 6000,
    "Lifetime": 30000
}

# ========== DATABASE ==========
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (email TEXT PRIMARY KEY, username TEXT, password_hash TEXT,
                 is_paid INTEGER, plan TEXT, expires_at TEXT,
                 referred_by TEXT, referral_code TEXT, created_at TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS transactions
                 (tx_ref TEXT PRIMARY KEY, email TEXT, amount REAL,
                 plan TEXT, status TEXT, created_at TEXT)''')
    conn.commit()
    conn.close()

def get_user(email):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=?", (email,))
    user = c.fetchone()
    conn.close()
    return user

def create_user(email, username, password, referred_by=None):
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    ref_code = str(uuid.uuid4())[:8]
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)",
              (email, username, hashed, 0, None, None, referred_by, ref_code, str(datetime.now())))
    conn.commit()
    conn.close()

def update_user_paid(email, plan):
    expires = "2099-01-01" if plan == "Lifetime" else str((datetime.now() + timedelta(days=30)).date())
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("UPDATE users SET is_paid=1, plan=?, expires_at=? WHERE email=?", (plan, expires, email))
    conn.commit()
    conn.close()

# ========== FLUTTERWAVE ==========
def create_flutterwave_payment(email, username, amount, plan):
    tx_ref = f"NRH-{uuid.uuid4()}"
    url = "https://api.flutterwave.com/v3/payments"
    headers = {
        "Authorization": f"Bearer {FLW_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "tx_ref": tx_ref,
        "amount": amount,
        "currency": "NGN",
        "payment_options": "banktransfer",
        "customer": {
            "email": email,
            "name": username
        },
        "customizations": {
            "title": "NaijaRemoteHub Membership",
            "description": f"{plan} Plan"
        },
        "redirect_url": f"{APP_URL}/dashboard"
    }
    res = requests.post(url, json=payload, headers=headers)
    data = res.json()

    # Save pending transaction
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO transactions VALUES (?,?,?,?,?,?)",
              (tx_ref, email, amount, plan, "pending", str(datetime.now())))
    conn.commit()
    conn.close()

    return data.get("data")

# ========== FASTAPI APP ==========
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {
        "status": "online",
        "app": "NaijaRemoteHub API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "webhook": "/webhook",
            "api_docs": "/docs"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "NaijaRemoteHub"}

@app.post("/webhook")
async def flutterwave_webhook(request: Request, verif_hash: str = Header(None)):
    """Flutterwave webhook for payment confirmation"""
    if verif_hash != FLW_SECRET_KEY:
        return JSONResponse({"status": "invalid"}, status_code=401)

    try:
        data = await request.json()
        if data.get("event") == "bank_transfer.completed" and data["data"]["status"] == "successful":
            customer_email = data["data"]["customer"]["email"]
            tx_ref = data["data"]["tx_ref"]

            # Find plan from our DB
            conn = sqlite3.connect(DB_NAME)
            c = conn.cursor()
            c.execute("SELECT plan FROM transactions WHERE tx_ref=?", (tx_ref,))
            result = c.fetchone()
            if result:
                plan = result[0]
                update_user_paid(customer_email, plan)
                c.execute("UPDATE transactions SET status='success' WHERE tx_ref=?", (tx_ref,))
            conn.commit()
            conn.close()

        return {"status": "success"}
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)

@app.post("/api/signup")
async def signup(data: dict):
    """Create new user"""
    try:
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")
        ref = data.get("referred_by")

        if get_user(email):
            return JSONResponse({"error": "Email already exists"}, status_code=400)

        create_user(email, username, password, ref)
        return {"status": "success", "message": "Account created"}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/login")
async def login(data: dict):
    """User login"""
    try:
        email = data.get("email")
        password = data.get("password")

        user = get_user(email)
        if user and bcrypt.checkpw(password.encode(), user[2].encode()):
            return {
                "status": "success",
                "user": {
                    "email": user[0],
                    "username": user[1],
                    "is_paid": bool(user[3]),
                    "plan": user[4],
                    "referral_code": user[7]
                }
            }
        return JSONResponse({"error": "Invalid credentials"}, status_code=401)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/payment/create")
async def create_payment(data: dict):
    """Create Flutterwave payment"""
    try:
        email = data.get("email")
        username = data.get("username")
        plan = data.get("plan")

        if plan not in PLANS:
            return JSONResponse({"error": "Invalid plan"}, status_code=400)

        amount = PLANS[plan]
        payment_data = create_flutterwave_payment(email, username, amount, plan)

        if payment_data:
            return {
                "status": "success",
                "payment": payment_data
            }
        return JSONResponse({"error": "Payment creation failed"}, status_code=500)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/api/user/{email}")
async def get_user_data(email: str):
    """Get user data"""
    try:
        user = get_user(email)
        if user:
            return {
                "email": user[0],
                "username": user[1],
                "is_paid": bool(user[3]),
                "plan": user[4],
                "expires_at": user[5],
                "referral_code": user[7]
            }
        return JSONResponse({"error": "User not found"}, status_code=404)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
