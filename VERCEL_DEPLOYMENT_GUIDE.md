# 🚀 VERCEL DEPLOYMENT GUIDE

## ✅ COMPLETED FIXES

### 1. **SPA Routing Configuration**
- ✅ Created `vercel.json` with proper rewrites for React Router
- ✅ All routes now properly redirect to `index.html`
- ✅ Fixed 404 errors for `/login` and other routes

### 2. **Environment Variables Setup**
Your frontend is configured to use:
```
VITE_API_URL=https://carrerpath-m48v.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

---

## 🔧 VERCEL ENVIRONMENT VARIABLES SETUP

### **CRITICAL: Set these in Vercel Dashboard**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```
VITE_API_URL=https://carrerpath-m48v.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_here
```

### **How to Add Environment Variables:**

1. **Login to Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your project: `carrer-path-8m3c`

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the sidebar

3. **Add Variables One by One:**
   
   **Variable 1:**
   - Name: `VITE_API_URL`
   - Value: `https://carrerpath-m48v.onrender.com`
   - Environment: Production, Preview, Development (select all)
   
   **Variable 2:**
   - Name: `VITE_RAZORPAY_KEY_ID`
   - Value: `rzp_test_your_actual_razorpay_key`
   - Environment: Production, Preview, Development (select all)

4. **Save and Redeploy**
   - Click "Save"
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment

---

## 🧪 TESTING AFTER DEPLOYMENT

### 1. **Test Basic Routing**
- ✅ https://carrer-path-8m3c.vercel.app/ (Home)
- ✅ https://carrer-path-8m3c.vercel.app/login (Login)
- ✅ https://carrer-path-8m3c.vercel.app/courses (Courses)
- ✅ https://carrer-path-8m3c.vercel.app/test-series (Test Series)

### 2. **Test API Connectivity**
Open browser console and check:
```javascript
// Should show your backend URL
console.log(import.meta.env.VITE_API_URL);
// Should show your Razorpay key
console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);
```

### 3. **Test Core Features**
- [ ] User registration/login
- [ ] Course listing loads
- [ ] Test series loads
- [ ] Payment modal opens
- [ ] Contact form works

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: Routes Still Show 404
**Solution:** 
- Ensure `vercel.json` is in the root of your frontend folder
- Redeploy after adding the file

### Issue 2: API Calls Fail
**Solution:**
- Check environment variables are set in Vercel dashboard
- Ensure backend (Render) is running: https://carrerpath-m48v.onrender.com
- Check browser console for CORS errors

### Issue 3: Payment System Not Working
**Solution:**
- Set correct `VITE_RAZORPAY_KEY_ID` in Vercel
- Use test key for testing: `rzp_test_...`
- Use live key for production: `rzp_live_...`

### Issue 4: Environment Variables Not Loading
**Solution:**
- Variables must start with `VITE_` prefix
- Redeploy after setting variables
- Check in browser console: `import.meta.env.VITE_API_URL`

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deployment:
- [x] `vercel.json` created for SPA routing
- [x] Environment variables configured in code
- [x] Backend deployed and working on Render
- [x] All routes properly configured in App.tsx

### After Setting Environment Variables:
- [ ] Set `VITE_API_URL` in Vercel dashboard
- [ ] Set `VITE_RAZORPAY_KEY_ID` in Vercel dashboard
- [ ] Redeploy the application
- [ ] Test all major routes
- [ ] Test API connectivity
- [ ] Test payment system

### Final Verification:
- [ ] Home page loads correctly
- [ ] Login/Register works
- [ ] Courses page shows data from backend
- [ ] Payment modal opens with Razorpay
- [ ] Contact form sends emails
- [ ] Admin dashboard accessible
- [ ] Student dashboard works

---

## 🔗 IMPORTANT URLS

### Frontend (Vercel):
- **Production:** https://carrer-path-8m3c.vercel.app
- **Dashboard:** https://vercel.com/dashboard

### Backend (Render):
- **Production:** https://carrerpath-m48v.onrender.com
- **Dashboard:** https://dashboard.render.com

### Testing Endpoints:
- **API Health:** https://carrerpath-m48v.onrender.com/api/health
- **Courses:** https://carrerpath-m48v.onrender.com/api/courses
- **Test Series:** https://carrerpath-m48v.onrender.com/api/test-series

---

## 🎯 NEXT STEPS

1. **Set Environment Variables in Vercel Dashboard**
2. **Redeploy the Application**
3. **Test All Core Features**
4. **Monitor for Any Issues**

Once environment variables are set, your application should work perfectly!

---

## 📞 SUPPORT

If you encounter any issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify backend is responding
4. Ensure environment variables are set correctly

**Your application is ready for production once environment variables are configured!** 🚀