# ⚡ Quick Netlify Deployment - 15 Minutes

## 🎯 Answer: YES, you can host on Netlify!

But you need **TWO** services:
- **Frontend** → Netlify (free) ✅
- **Backend** → Railway or Render (free tier) ✅

---

## 🚀 Step-by-Step (15 Minutes)

### Step 1: Deploy Backend (5 min)

**Option A: Railway (Recommended)**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-deploys!
6. Copy your URL: `https://your-app.railway.app`

**Option B: Render**
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect repository
5. Set start command: `node server.js`
6. Deploy and copy URL

### Step 2: Update Frontend (2 min)

Edit `client/.env.production`:
```env
REACT_APP_API_URL=https://your-app.railway.app
```

Replace `your-app.railway.app` with your actual backend URL.

### Step 3: Update Backend CORS (2 min)

Edit `server.js` - find the `allowedOrigins` array and add your Netlify URL:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-site.netlify.app', // Add this after deployment
  'https://wallpapercave.netlify.app',
  process.env.CLIENT_URL
].filter(Boolean);
```

### Step 4: Deploy to Netlify (5 min)

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
6. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-app.railway.app`
7. Click "Deploy site"

### Step 5: Update CORS (1 min)

After Netlify gives you a URL (e.g., `https://amazing-site-123.netlify.app`):
1. Go back to `server.js`
2. Add your Netlify URL to `allowedOrigins`
3. Push to GitHub
4. Railway/Render will auto-redeploy

---

## ✅ Files Already Created

✅ `netlify.toml` - Netlify configuration
✅ `client/.env.production` - Production API URL
✅ Updated `client/src/App.js` - Uses environment variables
✅ Updated `server.js` - CORS configured

---

## 🎉 That's It!

Your site will be live at:
- Frontend: `https://your-site.netlify.app`
- Backend: `https://your-app.railway.app`

---

## 💰 Cost

**FREE** to start!
- Netlify: Free forever (100GB bandwidth)
- Railway: Free tier (500 hours/month)
- Total: $0/month

---

## 🐛 Troubleshooting

**Problem**: CORS error in browser console
**Fix**: Add your Netlify URL to `allowedOrigins` in server.js

**Problem**: "No wallpapers found"
**Fix**: Check backend is running on Railway/Render

**Problem**: Build fails on Netlify
**Fix**: Make sure base directory is set to `client`

---

## 📞 Need Help?

See detailed guide: `NETLIFY_DEPLOYMENT.md`

---

**Ready to deploy? Let's go! 🚀**
