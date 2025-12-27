# 🚀 VERCEL DEPLOYMENT GUIDE

## ✅ Current Status
- ✅ Backend deployed on Render: https://carrerpath-m48v.onrender.com
- 🔄 Frontend deploying on Vercel (in progress)

## 🔧 **CRITICAL: Set Environment Variables on Vercel**

After your Vercel deployment completes:

### 1. Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project (CarrerPath)
3. Go to **Settings** tab
4. Click **Environment Variables** in the sidebar

### 2. Add These Environment Variables

```
VITE_API_URL = https://carrerpath-m48v.onrender.com
VITE_RAZORPAY_KEY_ID = your_razorpay_key_id_here
```

### 3. Redeploy
After adding environment variables:
- Go to **Deployments** tab
- Click the **⋯** menu on the latest deployment
- Click **Redeploy**

## 🔍 **Test Your Deployment**

Once both deployments are complete:

### Backend Test
```bash
curl https://carrerpath-m48v.onrender.com/api/courses
```

### Frontend Test
- Visit your Vercel URL (will be provided after deployment)
- Check browser console for any API connection errors
- Test login/registration functionality

## 🛠️ **Common Issues & Solutions**

### Issue 1: CORS Errors
If you see CORS errors in browser console:

**Solution:** Add your Vercel domain to backend CORS configuration in `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app' // Add your Vercel URL here
  ],
  credentials: true
};
```

### Issue 2: API Calls Failing
If API calls return 404 or connection errors:

**Check:**
1. Environment variables are set correctly on Vercel
2. Backend is running on Render (check Render logs)
3. API URLs in frontend are correct

### Issue 3: Payment System Not Working
If Razorpay doesn't load:

**Check:**
1. `VITE_RAZORPAY_KEY_ID` is set on Vercel
2. Razorpay script is loaded in `index.html`
3. Browser console for JavaScript errors

## 📋 **Deployment Checklist**

### Backend (Render) ✅
- [x] Code deployed successfully
- [x] Environment variables set
- [ ] MongoDB connection working (fix authentication)
- [ ] API endpoints responding

### Frontend (Vercel) 🔄
- [x] Code building successfully
- [ ] Environment variables set
- [ ] API connection working
- [ ] Payment system functional

## 🎯 **Next Steps**

1. **Wait for Vercel deployment to complete**
2. **Set environment variables on Vercel**
3. **Fix MongoDB authentication on Render** (still pending)
4. **Test full application functionality**
5. **Set up custom domain** (optional)

## 🔗 **Useful Links**

- **Backend (Render):** https://carrerpath-m48v.onrender.com
- **Frontend (Vercel):** [Will be provided after deployment]
- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard

## 🚨 **IMPORTANT: MongoDB Still Needs Fixing**

Your backend is deployed but MongoDB authentication is still failing. Make sure to:

1. Set `MONGO_URI` environment variable on Render
2. Whitelist all IPs (0.0.0.0/0) on MongoDB Atlas
3. Verify database user credentials

Once MongoDB is connected, your full-stack application will be live! 🎉