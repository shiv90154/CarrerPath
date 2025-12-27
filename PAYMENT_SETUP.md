# Razorpay Payment Setup Guide

## 🚀 Quick Setup for Testing

### 1. Get Razorpay Test Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or login (it's free for testing)
3. Go to **Settings → API Keys**
4. Generate **Test API Keys** (not live keys)
5. Copy the **Key ID** and **Key Secret**

### 2. Configure Environment Variables

#### Backend Configuration (`backend/.env`)
Replace the placeholder values in your `backend/.env` file:

```env
# Replace these with your actual Razorpay test credentials
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_key_secret_here
```

#### Frontend Configuration (`frontend/.env`)
Replace the placeholder in your `frontend/.env` file:

```env
# Use the same Key ID as backend (this is safe to expose)
VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
```

### 3. Email Configuration (Optional but Recommended)

For OTP verification to work, configure email in `backend/.env`:

```env
# For Gmail users:
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password_here  # NOT your regular Gmail password!
```

**Gmail App Password Setup:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to Google Account Settings → Security → App Passwords
3. Generate an App Password for "Mail"
4. Use this 16-character password in EMAIL_PASS

### 4. Restart Servers

After updating environment variables:

```bash
# Stop both servers (Ctrl+C)
# Then restart:

# Backend
cd backend
npm run server

# Frontend (in new terminal)
cd frontend
npm run dev
```

### 5. Test the Payment System

1. **Login to your application**
2. **Visit the test page**: http://localhost:5173/payment-test
3. **Click "Run System Tests"** - should show all green checkmarks
4. **Click "Test Payment Creation"** - should create a test order
5. **Try buying a course/test/ebook** - Razorpay modal should open

### 6. Test Payment Details

Use these test credentials in Razorpay modal:

**Test Card Numbers:**
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`

**Other Details:**
- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **Name**: Any name

**Test UPI IDs:**
- `success@razorpay` (for successful payments)
- `failure@razorpay` (for failed payments)

### 7. Troubleshooting

#### ❌ "Razorpay SDK not loaded"
- Check if internet connection is working
- Refresh the page
- Check browser console for errors

#### ❌ "Razorpay key not configured"
- Verify `VITE_RAZORPAY_KEY_ID` is set in `frontend/.env`
- Restart frontend server after adding env variables
- Key should start with `rzp_test_`

#### ❌ "Payment system not configured"
- Verify both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `backend/.env`
- Restart backend server after adding env variables
- Check backend console for error messages

#### ❌ "Error creating Razorpay order"
- Check backend terminal for detailed error messages
- Verify Razorpay credentials are correct (copy-paste carefully)
- Ensure MongoDB is running
- Check if user is logged in

#### ❌ "nodemailer.createTransporter is not a function"
- This is already fixed in the code
- Restart the backend server
- If error persists, check if nodemailer is installed: `npm install nodemailer`

### 8. Debug Steps

1. **Check Environment Variables:**
   ```bash
   # In backend terminal
   node -e "console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID)"
   
   # In frontend browser console
   console.log('VITE_RAZORPAY_KEY_ID:', import.meta.env.VITE_RAZORPAY_KEY_ID)
   ```

2. **Check API Connectivity:**
   - Visit: https://carrerpath-m48v.onrender.com/api/payments/test
   - Should return JSON with system status

3. **Check Browser Console:**
   - Open DevTools → Console tab
   - Look for any JavaScript errors
   - Check Network tab for failed requests

### 9. Production Setup (Later)

For production deployment:

1. **Get Live Credentials:**
   - Complete KYC verification on Razorpay
   - Get live API keys from dashboard

2. **Update Environment Variables:**
   ```env
   # Backend
   RAZORPAY_KEY_ID=rzp_live_your_live_key_id
   RAZORPAY_KEY_SECRET=your_live_key_secret
   
   # Frontend
   VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_id
   ```

### 10. Current Status

✅ **Fixed Issues:**
- Fixed nodemailer.createTransporter → createTransport
- Created frontend/.env file
- Updated backend/.env with proper structure
- Payment system code is ready

⚠️ **Action Required:**
- Get Razorpay test credentials from dashboard
- Update environment variables with real credentials
- Restart both servers
- Test payment flow

### 11. Quick Test Checklist

- [ ] Razorpay account created
- [ ] Test API keys copied to .env files
- [ ] Both servers restarted
- [ ] User logged in
- [ ] Visit /payment-test page
- [ ] All system tests pass (green checkmarks)
- [ ] Test payment creation works
- [ ] Razorpay modal opens when buying content
- [ ] Test payment completes successfully

**Need Help?** Check the browser console and backend terminal for specific error messages.