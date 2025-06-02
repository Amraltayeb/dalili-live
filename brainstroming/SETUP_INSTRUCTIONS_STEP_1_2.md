# 🚀 DATABASE SETUP - STEP 1 & 2 EXECUTION

## 📋 **WHAT YOU NEED TO DO:**

### **1. Go to Supabase Dashboard**
- Open [https://supabase.com](https://supabase.com)
- Go to your project
- Click **SQL Editor** in the left sidebar

---

### **2. RUN THESE SQL FILES IN ORDER:**

#### **🏗️ FILE 1: Enhanced User Schema**
**File:** `ENHANCED_USER_SCHEMA.sql`
**Purpose:** Creates comprehensive user management system

```sql
-- Copy and paste the ENTIRE content of ENHANCED_USER_SCHEMA.sql
-- This creates 8 user-related tables with sample data
```
**Click "RUN" after pasting**

---

#### **📊 FILE 2: Import Business Data**
**File:** `IMPORT_BUSINESS_DATA.sql` 
**Purpose:** Imports 125+ businesses with rich data

```sql
-- Copy and paste the ENTIRE content of IMPORT_BUSINESS_DATA.sql
-- This adds all your development business data
```
**Click "RUN" after pasting**

---

#### **🔗 FILE 3: Database Cleanup (Optional)**
**File:** `database-cleanup-and-setup.sql`
**Purpose:** Ensures proper schema if needed

```sql
-- Only run this if you have existing data conflicts
-- This cleans up and rebuilds the basic schema
```

---

## ✅ **VERIFICATION STEPS:**

### **1. Check Tables Created:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables:**
- ✅ `categories`
- ✅ `businesses` 
- ✅ `users`
- ✅ `user_profiles`
- ✅ `business_owners`
- ✅ `user_businesses`
- ✅ `user_sessions`
- ✅ `user_activities`
- ✅ `user_favorites`
- ✅ `user_notifications`
- ✅ `reviews`

### **2. Check Business Data:**
```sql
SELECT 
    COUNT(*) as total_businesses,
    COUNT(CASE WHEN custom_data IS NOT NULL THEN 1 END) as rich_data_businesses,
    COUNT(DISTINCT area) as areas_covered,
    COUNT(DISTINCT category) as categories_used
FROM businesses;
```

**Expected results:**
- ✅ **125+ total businesses**
- ✅ **15+ rich data businesses** (with JSON)
- ✅ **3+ areas** (New Cairo, El Shorouk, Madinaty)
- ✅ **8+ categories**

### **3. Check User System:**
```sql
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN user_type = 'business_owner' THEN 1 END) as business_owners,
    COUNT(CASE WHEN user_type = 'customer' THEN 1 END) as customers
FROM users;
```

**Expected results:**
- ✅ **3+ users created**
- ✅ **1 admin user**
- ✅ **1 business owner**
- ✅ **1 customer**

---

## 🎯 **NEXT STEPS AFTER COMPLETION:**

### **Test Database Connection:**
```bash
cd "D:\devlopment\DALILI PROJECT\dalili-live-app"
npm run dev
```

**Then visit:** http://localhost:3000/test-db

---

## 🚨 **TROUBLESHOOTING:**

### **Error: "relation already exists"**
**Solution:** Run `database-cleanup-and-setup.sql` first, then run the other files

### **Error: "function uuid_generate_v4() does not exist"**
**Solution:** Run this first:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### **Error: Foreign key constraint**
**Solution:** Make sure you run files in the exact order above

---

## 📞 **READY FOR NEXT STEPS:**

Once database setup is complete, you'll have:
- ✅ **125+ businesses** for testing search/pagination
- ✅ **15 rich businesses** for testing advanced features  
- ✅ **Complete user system** for admin panel
- ✅ **Sample users** (admin, business owner, customer)
- ✅ **Full JSON data** for testing mobile app features

**Then we can start building the front-end!** 🚀 