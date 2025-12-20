# Vercel Deployment Guide

## 🚀 Deploy Your Todo App to Vercel

This guide will help you deploy both frontend and backend in a single Vercel deployment.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account (for cloud database)

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):

   ```bash
   git init
   git add .
   git commit -m "Initial commit with auth system"
   ```

2. **Create a GitHub repository** and push your code:
   ```bash
   git remote add origin https://github.com/yourusername/todo-app.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Replace `<password>` with your actual password

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure your project:

   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   MONGODB_URI = your_mongodb_atlas_connection_string
   JWT_SECRET = your_super_secret_random_string
   ```

6. Click "Deploy"

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Add Environment Variables**:

   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB URI when prompted

   vercel env add JWT_SECRET
   # Enter a secure random string
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Step 4: Verify Deployment

After deployment, Vercel will give you a URL like: `https://your-app.vercel.app`

Test your deployment:

1. Visit the URL
2. Try signing up with a new account
3. Test login functionality
4. Create some todos
5. Refresh the page to ensure data persists

## Project Structure

```
ToDo/
├── api/                    # Vercel serverless functions
│   └── index.js           # API handler
├── backend/               # Backend code
│   ├── controllers/
│   ├── models/
│   └── routes/
├── src/                   # Frontend code
├── vercel.json           # Vercel configuration
└── package.json          # Frontend dependencies
```

## How It Works

- **Frontend**: Built with Vite and deployed as static files
- **Backend**: Runs as Vercel serverless functions in the `/api` directory
- **Database**: MongoDB Atlas (cloud)
- **API Calls**: Frontend calls `/api/misc/*` which routes to serverless functions

## Environment Variables

Make sure these are set in Vercel:

| Variable      | Description               | Example                    |
| ------------- | ------------------------- | -------------------------- |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...`        |
| `JWT_SECRET`  | Secret key for JWT tokens | `random_secure_string_123` |

## Troubleshooting

### API Not Working

- Check Vercel Function Logs in the dashboard
- Verify environment variables are set correctly
- Ensure MongoDB IP whitelist includes `0.0.0.0/0` (allow all)

### Build Failing

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Try building locally: `npm run build`

### Database Connection Issues

- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (allow all IPs)
- Ensure database user has correct permissions

## Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Updating Your App

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically rebuild and redeploy!

## Important Notes

- ⚠️ **MongoDB Atlas**: Make sure to whitelist all IPs (`0.0.0.0/0`) in Network Access
- 🔒 **Environment Variables**: Never commit `.env` files to Git
- 🚀 **Automatic Deployments**: Every push to main branch triggers a new deployment
- 📊 **Function Limits**: Vercel free tier has 100GB-Hrs of serverless function execution per month

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- Check Vercel Function Logs for errors
