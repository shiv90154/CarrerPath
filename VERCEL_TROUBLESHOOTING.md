# 🚨 VERCEL DEPLOYMENT TROUBLESHOOTING

## Current Issues Identified:

### 1. **Environment Variables Not Loading**
- Error: `POST https://carrerpath-m48v.onrender.com/api/users/login` (should be production URL)
- Cause: Vercel environment variables not properly configured or not being loaded

### 2. **Razorpay Checkout Error**
- Error: `Unrecognized feature: 'otp-credentials'`
- Cause: Invalid or missing Razorpay key

## 🔧 **IMMEDIATE FIXES APPLIED:**

### 1. **Smart Environment Detection**
- ✅ Added fallback logic in `api.ts`
- ✅ Added debug logging to console
- ✅ Created `.env.production` file
- ✅ Added `EnvDebug` component to show current values

### 2. **Centralized Configuration**
- ✅ All API calls now use centralized config
- ✅ Automatic production URL detection
- ✅ Razorpay key fallback system

## 🧪 **DEBUGGING STEPS:**

### Step 1: Check Environment Variables
After deployment, open browser console and look for:
```
Environment Debug: {
  MODE: "production",
  VITE_API_URL: "https://carrerpath-m48v.onrender.com",
  VITE_RAZORPAY_KEY_ID: "rzp_test_..."
}
```

### Step 2: Check API Calls
Network tab should show:
- ✅ `https://carrerpath-m48v.onrender.com/api/users/login`
- ❌ `https://carrerpath-m48v.onrender.com/api/users/login`

### Step 3: Visual Debug Component
Look for black debug box in top-right corner showing:
- VITE_API_URL: Should show production URL
- VITE_RAZORPAY_KEY_ID: Should show your key

## 🚀 **VERCEL ENVIRONMENT VARIABLE SETUP (RETRY):**

### Method 1: Via Dashboard
1. Go to https://vercel.com/dashboard
2. Select project: `carrer-path-8m3c`
3. Settings → Environment Variables
4. Add:
   ```
   VITE_API_URL=https://carrerpath-m48v.onrender.com
   VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key
   ```
5. **IMPORTANT:** Select all environments (Production, Preview, Development)
6. Save and redeploy

### Method 2: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env add VITE_API_URL
# Enter: https://carrerpath-m48v.onrender.com

vercel env add VITE_RAZORPAY_KEY_ID  
# Enter: rzp_test_your_actual_key

# Redeploy
vercel --prod
```

### Method 3: Via Project Settings File
Create `vercel.json` with env vars:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://carrerpath-m48v.onrender.com",
    "VITE_RAZORPAY_KEY_ID": "rzp_test_your_actual_key"
  }
}
```

## 🔍 **VERIFICATION CHECKLIST:**

After each deployment attempt:

- [ ] Check browser console for environment debug logs
- [ ] Verify API calls go to production backend
- [ ] Test login functionality
- [ ] Check EnvDebug component shows correct values
- [ ] Verify no localhost URLs in network tab
- [ ] Test Razorpay payment modal opens

## 🚨 **FALLBACK SOLUTION:**

If environment variables still don't work, the code now has smart fallbacks:

1. **API URL Detection:**
   - If on Vercel domain → Use production API
   - If on localhost → Use local API
   - Environment variable overrides both

2. **Razorpay Key:**
   - Uses environment variable if available
   - Falls back to test key for development
   - Shows warning if not configured

## 📞 **NEXT STEPS:**

1. **Deploy with current fixes**
2. **Check browser console for debug info**
3. **If still issues, try Vercel CLI method**
4. **Verify backend is responding at https://carrerpath-m48v.onrender.com**

The application should now work even if environment variables aren't properly loaded by Vercel! 🚀