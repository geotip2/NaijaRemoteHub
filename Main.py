import streamlit as st
import sqlite3
import os
import requests
import bcrypt
import uuid
from datetime import datetime, timedelta
from fastapi import FastAPI, Request, Header
import uvicorn
import threading

# ========== CONFIG ==========
FLW_SECRET_KEY = os.environ.get("FLW_SECRET_KEY")
FLW_ENCRYPTION_KEY = os.environ.get("FLW_ENCRYPTION_KEY")
APP_URL = os.environ.get("APP_URL", "https://yourapp.onrender.com") # Change after deploy

DB_NAME = "database.db"

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
    c.execute("INSERT INTO users VALUES (?,?,?,?,?)",
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
        "currency": "NGN", # NAIRA
        "payment_options": "banktransfer",
        "customer": {
            "email": email,
            "name": username
        },
        "customizations": {
            "title": "NaijaRemoteHub Membership",
            "description": f"{plan} Plan"
        },
        "redirect_url": f"{APP_URL}"
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

    return data.get("data") # contains bank account details

# ========== FASTAPI WEBHOOK ==========
app = FastAPI()

@app.post("/webhook")
async def flutterwave_webhook(request: Request, verif_hash: str = Header(None)):
    if verif_hash!= FLW_SECRET_KEY:
        return {"status": "invalid"}

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

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000)

# ========== STREAMLIT APP ==========
def main():
    st.set_page_config(page_title="NaijaRemoteHub", layout="wide", initial_sidebar_state="collapsed")
    init_db()

    if 'user' not in st.session_state:
        st.session_state.user = None

    # AUTH
    if st.session_state.user is None:
        tab1, tab2 = st.tabs(["Login", "Signup"])
        with tab1:
            login()
        with tab2:
            signup()
    else:
        user = get_user(st.session_state.user)
        if user[3] == 1: # is_paid
            dashboard(user)
        else:
            pricing_page(user)

def login():
    st.title("Welcome to NaijaRemoteHub 🇳🇬")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        user = get_user(email)
        if user and bcrypt.checkpw(password.encode(), user[2].encode()):
            st.session_state.user = email
            st.rerun()
        else:
            st.error("Invalid credentials")

def signup():
    st.title("Join NaijaRemoteHub 🇳🇬")
    email = st.text_input("Email")
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")
    ref = st.query_params.get("ref", None)
    if st.button("Create Account"):
        if get_user(email):
            st.error("Email already exists")
        else:
            create_user(email, username, password, ref)
            st.success("Account created! Please login")

def pricing_page(user):
    st.title("Choose Your Plan")
    st.warning("You need an active plan to access the dashboard")

    cols = st.columns(3)
    for i, (plan, price) in enumerate(PLANS.items()):
        with cols[i]:
            st.subheader(plan)
            st.markdown(f"### ₦{price:,}")
            if st.button(f"Pay ₦{price:,} with Bank Transfer", key=plan):
                payment_data = create_flutterwave_payment(user[0], user[1], price, plan)
                if payment_data:
                    st.success("Transfer to the account below:")
                    st.code(f"Account Name: {payment_data['account_name']}\nAccount Number: {payment_data['account_number']}\nBank: {payment_data['bank_name']}\nAmount: ₦{price:,}")
                    st.info("After payment, you will be upgraded automatically in 2 minutes")
                else:
                    st.error("Payment failed. Try again")

def dashboard(user):
    st.sidebar.title(f"Hi, {user[1]}")
    if st.sidebar.button("Logout"):
        st.session_state.user = None
        st.rerun()

    tabs = st.tabs(["Job Leads", "Templates", "Community", "Refer & Earn"])

    with tabs[0]:
        st.header("Remote Job Leads")
        st.dataframe({"Job": ["Virtual Assistant", "Content Writer"], "Company": ["Remote.co", "WeWorkRemotely"], "Link": ["#", "#"]})

    with tabs[1]:
        st.header("Download Templates")
        st.download_button("Download CV Template", "CV Template Content", "cv.docx")

    with tabs[2]:
        st.header("Community")
        st.link_button("Join WhatsApp Group", "https://chat.whatsapp.com/")

    with tabs[3]:
        st.header("Refer & Earn 15%")
        ref_link = f"{APP_URL}?ref={user[7]}"
        st.code(ref_link)
        st.info("Earn 15% on every referral. Payout on request.")

# Run FastAPI in background for webhook
threading.Thread(target=run_fastapi, daemon=True).start()

if __name__ == "__main__":
    main()
