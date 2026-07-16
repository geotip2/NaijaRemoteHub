# Deployment Guide - Vercel

## Overview
NaijaRemoteHub is now configured for deployment on Vercel. The app uses FastAPI for the backend API and serverless functions.

## Key Changes Made
- ✅ Created `vercel.json` for Vercel configuration
- ✅ Created `api/index.py` with FastAPI app for serverless deployment
- ✅ Added `.env.example` for environment variables
- ✅ Optimized database to use `/tmp` directory (serverless compatible)
- ✅ Converted Streamlit UI to REST API endpoints

## Environment Variables Required
Add these to your Vercel project settings:

```
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_ENCRYPTION_KEY=your_flutterwave_encryption_key
APP_URL=https://your-project.vercel.app
```

## How to Deploy

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository: `geotip2/naijaremotehub`

### Step 2: Add Environment Variables
1. In Vercel dashboard, go to Settings → Environment Variables
2. Add the required variables (see above)

### Step 3: Deploy
1. Click "Deploy"
2. Vercel will automatically detect `vercel.json` configuration
3. Your app will be live at `https://your-project.vercel.app`

## API Endpoints

### Health Check
```
GET /health
```
Response: `{"status": "healthy"}`

### Webhook
```
POST /webhook
Headers: verif_hash = FLW_SECRET_KEY
```
Receives payment confirmations from Flutterwave

### User Management
```
POST /api/signup
POST /api/login
GET /api/user/{email}
```

### Payments
```
POST /api/payment/create
```

## Notes
- Database uses `/tmp` (temporary storage - consider using a persistent database service)
- For production, consider:
  - **Database**: PostgreSQL, MongoDB, or Firebase
  - **Frontend**: React, Vue, or Next.js (replaces Streamlit)
  - **Payments**: Implement full Flutterwave integration
  
## Next Steps
1. Deploy to Vercel
2. Test webhook with Flutterwave
3. Build a frontend (React/Next.js) to consume these APIs
4. Setup persistent database
