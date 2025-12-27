# 🗑️ DATABASE CLEANUP QUERIES

## **IMPORTANT WARNING** ⚠️
**These queries will permanently delete data from your database. Use with extreme caution!**

---

## 🧑‍💼 **1. DELETE ALL USERS EXCEPT ADMIN**

```javascript
// Connect to MongoDB (use MongoDB Compass, Studio 3T, or mongo shell)

// Delete all users except admin role
db.users.deleteMany({ role: { $ne: "admin" } })

// Result: Deletes all students, teachers, etc. but keeps admin users
```

---

## 🧑‍🎓 **2. DELETE ALL USERS EXCEPT SPECIFIC EMAIL**

```javascript
// Keep only specific admin email
db.users.deleteMany({ email: { $ne: "admin@careerpathway.com" } })

// Keep multiple specific emails
db.users.deleteMany({ 
  email: { 
    $nin: ["admin@careerpathway.com", "superadmin@careerpathway.com"] 
  } 
})
```

---

## 🗑️ **3. DELETE ALL USERS (COMPLETE CLEANUP)**

```javascript
// ⚠️ DANGER: This deletes ALL users including admins
db.users.deleteMany({})

// Alternative: Drop the entire users collection
db.users.drop()
```

---

## 🧑‍🎓 **4. DELETE ONLY STUDENT USERS**

```javascript
// Delete only users with role 'student'
db.users.deleteMany({ role: "student" })
```

---

## 📊 **5. CHECK USER COUNT BEFORE/AFTER**

```javascript
// Check total users before cleanup
db.users.countDocuments()

// Check users by role
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

// List all admin users (to verify they won't be deleted)
db.users.find({ role: "admin" }, { name: 1, email: 1, role: 1 })
```

---

## 🔄 **6. SAFE CLEANUP WITH BACKUP**

```javascript
// 1. First, create a backup collection
db.users.aggregate([{ $out: "users_backup" }])

// 2. Verify backup was created
db.users_backup.countDocuments()

// 3. Now safely delete users
db.users.deleteMany({ role: { $ne: "admin" } })

// 4. If something goes wrong, restore from backup
// db.users_backup.aggregate([{ $out: "users" }])
```

---

## 🎯 **RECOMMENDED CLEANUP SEQUENCE**

### **Step 1: Create Student User**
```bash
# Run the student creation script
cd backend
node scripts/createStudent.js
```

### **Step 2: Backup Current Users**
```javascript
// In MongoDB
db.users.aggregate([{ $out: "users_backup_" + new Date().toISOString().split('T')[0] }])
```

### **Step 3: Clean Non-Admin Users**
```javascript
// Delete all users except admins
db.users.deleteMany({ role: { $ne: "admin" } })
```

### **Step 4: Verify Results**
```javascript
// Check remaining users
db.users.find({}, { name: 1, email: 1, role: 1 })

// Should show only admin users
```

### **Step 5: Re-run Student Creation**
```bash
# Create fresh student user
node scripts/createStudent.js
```

---

## 📋 **FINAL VERIFICATION QUERIES**

```javascript
// 1. Count users by role
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

// 2. List all users (should be minimal)
db.users.find({}, { name: 1, email: 1, role: 1, isActive: 1 })

// 3. Verify student user exists
db.users.findOne({ email: "student@test.com" })

// 4. Check if admin users are intact
db.users.find({ role: "admin" }, { name: 1, email: 1 })
```

---

## 🚨 **EMERGENCY RESTORE**

If you accidentally delete important data:

```javascript
// List all backup collections
db.runCommand("listCollections").cursor.firstBatch.filter(c => c.name.includes("backup"))

// Restore from most recent backup
db.users_backup_2024_12_27.aggregate([{ $out: "users" }])
```

---

## 📞 **USAGE INSTRUCTIONS**

### **For MongoDB Compass:**
1. Connect to your database
2. Select your database (usually `institute-website`)
3. Open the `users` collection
4. Click on "Aggregations" or use the query bar
5. Paste the queries above

### **For MongoDB Shell:**
1. Connect: `mongosh "your_connection_string"`
2. Use database: `use institute-website`
3. Run queries directly

### **For Studio 3T or Similar:**
1. Connect to your database
2. Open query window
3. Select your database
4. Run the JavaScript queries

---

## ✅ **AFTER CLEANUP**

Your database should have:
- ✅ Admin users (preserved)
- ✅ One test student: `student@test.com` / `student123`
- ✅ Clean slate for new user registrations
- ✅ All other collections intact (courses, test series, etc.)

**Test the student login immediately after cleanup to ensure everything works!**