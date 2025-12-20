# Backend Deployment Guide

## Deploy to Vercel (Recommended)

### 1. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 2. Navigate to backend directory

```bash
cd backend
```

### 3. Deploy

```bash
vercel --prod
```

### 4. Set Environment Variables

After first deployment, add these secrets:

```bash
vercel env add MONGODB_URI production
# Paste: mongodb+srv://idivyanshv_db_user:QyH0zOj1FvMomvzg@cluster0.wsnxusy.mongodb.net/?appName=Cluster0

vercel env add JWT_SECRET production
# Paste: donttodome
```

### 5. Redeploy

```bash
vercel --prod
```

Your backend will be available at: `https://your-backend.vercel.app`

---

## Deploy to Render (Alternative)

### 1. Create a new Web Service on Render

- Go to https://render.com
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the `backend` directory

### 2. Configure Build Settings

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGODB_URI`: mongodb+srv://idivyanshv_db_user:QyH0zOj1FvMomvzg@cluster0.wsnxusy.mongodb.net/?appName=Cluster0
  - `JWT_SECRET`: donttodome
  - `PORT`: 5000

### 3. Deploy

Click "Create Web Service" and wait for deployment.

Your backend will be available at: `https://your-app.onrender.com`

---

## Deploy to Railway (Alternative)

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login and Deploy

```bash
cd backend
railway login
railway init
railway up
```

### 3. Set Environment Variables

```bash
railway variables set MONGODB_URI="mongodb+srv://idivyanshv_db_user:QyH0zOj1FvMomvzg@cluster0.wsnxusy.mongodb.net/?appName=Cluster0"
railway variables set JWT_SECRET="donttodome"
```

---

## After Backend Deployment

### Update Frontend Configuration

Once your backend is deployed, update the frontend API URL:

1. Edit `frontend/src/config/api.ts`
2. Replace the production API URL with your deployed backend URL:

```typescript
export const API_BASE_URL = isDevelopment
  ? "http://localhost:5000/api"
  : "https://your-backend-url.vercel.app/api"; // Your deployed backend URL
```

3. Redeploy your frontend on Vercel

---

## Health Check

Test your deployed backend:

```bash
curl https://your-backend-url.vercel.app/
curl https://your-backend-url.vercel.app/api/health
```

Expected responses:

- `/` → `{"message": "Todo API Server is running"}`
- `/api/health` → `{"success": true, "status": "API is running", "mongodb": "connected"}`
