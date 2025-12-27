# 🚀 RENDER ENVIRONMENT VARIABLES

## Required Environment Variables for Production

Set these in your Render dashboard (Settings > Environment):

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://shiva90154_db_user:zXAsEj3XApUCKiw3@cluster0.egk6uuf.mongodb.net/institute-website?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex_for_production_use_12345
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
CONTACT_EMAIL=support@careerpathway.com
DB_NAME=institute-website
```

## 🔐 MongoDB Atlas Setup Checklist

### 1. **Whitelist Render's IP Addresses**
In MongoDB Atlas:
- Go to Network Access
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (0.0.0.0/0)
- Or add Render's specific IP ranges

### 2. **Verify Database User Permissions**
In MongoDB Atlas:
- Go to Database Access
- Ensure user `shiva90154_db_user` has:
  - Password: `zXAsEj3XApUCKiw3`
  - Role: `readWrite` on `institute-website` database
  - Or `Atlas admin` for full access

### 3. **Check Connection String**
Your connection string should be:
```
mongodb+srv://shiva90154_db_user:zXAsEj3XApUCKiw3@cluster0.egk6uuf.mongodb.net/institute-website?retryWrites=true&w=majority&appName=Cluster0
```

## 🚨 Common Issues & Solutions

### Issue 1: IP Not Whitelisted
**Solution:** Add 0.0.0.0/0 to Network Access in MongoDB Atlas

### Issue 2: Wrong Password
**Solution:** Reset password for database user in MongoDB Atlas

### Issue 3: User Doesn't Exist
**Solution:** Create database user with proper permissions

### Issue 4: Database Name Mismatch
**Solution:** Ensure database name matches in connection string

## 🔧 How to Set Environment Variables on Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Settings" tab
4. Scroll to "Environment Variables"
5. Add each variable one by one
6. Click "Save Changes"
7. Your service will automatically redeploy

## 🧪 Test Your Connection

After setting environment variables, your logs should show:
```
✅ MongoDB Connected Successfully!
📍 Host: cluster0-shard-00-02.egk6uuf.mongodb.net
🗄️  Database: institute-website
🔗 Connection State: Connected
```

Instead of:
```
Error: bad auth : authentication failed
```