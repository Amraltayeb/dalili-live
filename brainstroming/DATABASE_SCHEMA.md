# 🗄️ DATABASE SCHEMA - COMPREHENSIVE BUSINESS DIRECTORY
*Complete database structure for Dalili Live - Flexible for ANY business type*

**Purpose:** Future-proof database that can handle restaurants, freelancers, shops, services, professional services - EVERYTHING!  
**Database:** Supabase (PostgreSQL)  
**Design:** Flexible schema with JSON fields for category-specific data

---

## 📋 **SUPABASE SETUP INSTRUCTIONS**

### **STEP 1: CREATE MAIN TABLES**

Copy and paste these SQL commands in **Supabase > SQL Editor**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ar TEXT,
    icon TEXT, -- Emoji or icon class
    color TEXT DEFAULT '#6B7280', -- Hex color for UI
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MAIN BUSINESSES TABLE
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ar TEXT, -- Arabic name
    category_id UUID REFERENCES categories(id),
    category TEXT NOT NULL, -- Also store as text for flexibility
    subcategory TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    area TEXT NOT NULL, -- New Cairo, Rehab, etc.
    address TEXT,
    description TEXT,
    description_ar TEXT,
    services_offered TEXT,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    working_hours JSONB, -- Flexible hours structure
    images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
    social_links JSONB DEFAULT '{}'::jsonb, -- Instagram, Facebook, etc.
    custom_data JSONB DEFAULT '{}'::jsonb, -- Category-specific fields
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    views_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS TABLE (for future)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    area TEXT,
    user_type TEXT DEFAULT 'customer' CHECK (user_type IN ('customer', 'business_owner', 'admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REVIEWS TABLE (for future)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_area ON businesses(area);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_featured ON businesses(featured);
CREATE INDEX idx_businesses_created_at ON businesses(created_at);
```

### **STEP 2: INSERT SAMPLE CATEGORIES**

```sql
INSERT INTO categories (name, name_ar, icon, color, sort_order) VALUES
('Digital Services', 'خدمات رقمية', '💻', '#3B82F6', 1),
('Restaurants & Food', 'مطاعم وطعام', '🍽️', '#EF4444', 2),
('Beauty & Personal Care', 'جمال ورعاية شخصية', '💈', '#8B5CF6', 3),
('Professional Services', 'خدمات مهنية', '⚖️', '#059669', 4),
('Home Services', 'خدمات منزلية', '🔧', '#DC2626', 5),
('Healthcare', 'رعاية صحية', '🏥', '#0EA5E9', 6),
('Shopping & Retail', 'تسوق ومتاجر', '🛒', '#F59E0B', 7),
('Automotive', 'خدمات سيارات', '🚗', '#6B7280', 8),
('Education & Training', 'تعليم وتدريب', '🏫', '#10B981', 9),
('Government & Public', 'حكومي وعام', '🏛️', '#6366F1', 10);
```

### **STEP 3: INSERT SAMPLE BUSINESSES**

```sql
-- Sample video editor
INSERT INTO businesses (
    name, category, subcategory, phone, area, description, 
    price_range, custom_data, status
) VALUES (
    'Ahmed Video Editor',
    'Digital Services',
    'Video Editing',
    '+20 1012345678',
    'New Cairo',
    'Professional video editing for weddings, events, and social media content',
    '$',
    '{
        "specialties": ["Wedding videos", "Social media content", "Event coverage"],
        "software": ["Final Cut Pro", "After Effects", "DaVinci Resolve"],
        "turnaround_time": "2-3 days",
        "languages": ["Arabic", "English"],
        "portfolio_samples": ["sample1.mp4", "sample2.mp4"]
    }'::jsonb,
    'active'
);

-- Sample restaurant
INSERT INTO businesses (
    name, name_ar, category, subcategory, phone, area, address, 
    description, price_range, custom_data, working_hours
) VALUES (
    'Mario''s Pizza',
    'بيتزا ماريو',
    'Restaurants & Food',
    'Italian Pizza',
    '+20 1087654321',
    'New Cairo',
    '90th Street, New Cairo, Cairo',
    'Authentic Italian pizza with fresh ingredients',
    '$$',
    '{
        "cuisine_type": "Italian",
        "delivery_available": true,
        "dine_in": true,
        "takeaway": true,
        "halal_certified": true,
        "parking_available": true,
        "accepts_reservations": false
    }'::jsonb,
    '{
        "monday": {"open": "12:00", "close": "23:00"},
        "tuesday": {"open": "12:00", "close": "23:00"},
        "wednesday": {"open": "12:00", "close": "23:00"},
        "thursday": {"open": "12:00", "close": "23:00"},
        "friday": {"open": "14:00", "close": "24:00"},
        "saturday": {"open": "12:00", "close": "24:00"},
        "sunday": {"open": "12:00", "close": "23:00"}
    }'::jsonb
);

-- Sample barber shop
INSERT INTO businesses (
    name, name_ar, category, subcategory, phone, area, address,
    description, price_range, custom_data
) VALUES (
    'Elite Barber Shop',
    'صالون إيليت للحلاقة',
    'Beauty & Personal Care',
    'Barber Shop',
    '+20 1123456789',
    'New Cairo',
    'First District, New Cairo',
    'Modern barber shop with experienced barbers',
    '$',
    '{
        "services": ["Haircut", "Beard trimming", "Hair styling", "Hair wash"],
        "gender_served": "men",
        "appointment_required": false,
        "payment_methods": ["cash", "card"],
        "amenities": ["AC", "WiFi", "Waiting area"]
    }'::jsonb
);
```

---

## 📊 **CUSTOM DATA EXAMPLES BY CATEGORY**

### **DIGITAL SERVICES:**
```json
{
    "specialties": ["Video editing", "Motion graphics"],
    "software": ["Final Cut Pro", "After Effects"],
    "turnaround_time": "2-3 days",
    "languages": ["Arabic", "English"],
    "portfolio_samples": ["url1", "url2"],
    "min_budget": "500 EGP",
    "experience_years": 5
}
```

### **RESTAURANTS:**
```json
{
    "cuisine_type": "Italian",
    "delivery_available": true,
    "dine_in": true,
    "halal_certified": true,
    "parking_available": true,
    "accepts_reservations": true,
    "payment_methods": ["cash", "card", "digital"],
    "average_meal_cost": "150 EGP"
}
```

### **PROFESSIONAL SERVICES (LAWYERS):**
```json
{
    "practice_areas": ["Family Law", "Business Law", "Real Estate"],
    "consultation_fee": "500 EGP",
    "languages": ["Arabic", "English"],
    "bar_association_number": "12345",
    "years_experience": 10,
    "court_appearances": true,
    "online_consultation": true
}
```

### **HEALTHCARE (DOCTORS):**
```json
{
    "specialties": ["General Medicine", "Family Medicine"],
    "consultation_fee": "300 EGP",
    "accepted_insurance": ["Allianz", "AXA"],
    "clinic_name": "New Cairo Medical Center",
    "appointment_required": true,
    "emergency_available": false,
    "languages": ["Arabic", "English"]
}
```

### **HOME SERVICES (PLUMBERS):**
```json
{
    "services": ["Pipe repair", "Bathroom installation", "Kitchen plumbing"],
    "emergency_available": true,
    "service_areas": ["New Cairo", "Rehab", "Madinaty"],
    "hourly_rate": "100 EGP",
    "minimum_charge": "200 EGP",
    "warranty_provided": "6 months"
}
```

---

## 🔧 **ENVIRONMENT VARIABLES**

Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🚀 **NEXT.JS CONNECTION CODE**

Create `lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions
export const getBusinesses = async () => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const addBusiness = async (businessData) => {
  const { data, error } = await supabase
    .from('businesses')
    .insert([businessData])
    .select()
  
  if (error) throw error
  return data[0]
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'active')
    .order('sort_order')
  
  if (error) throw error
  return data
}
```

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **DAY 1: DATABASE SETUP**
- [ ] Run the CREATE TABLE commands in Supabase SQL Editor
- [ ] Insert sample categories
- [ ] Insert 3 sample businesses
- [ ] Verify data appears in Supabase Table Editor

### **DAY 2: APP CONNECTION**
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Add environment variables
- [ ] Create lib/supabase.js file
- [ ] Test connection with simple query

### **READY FOR WEEK 1!**
This schema can handle ANY business type you want to add - just put category-specific info in the `custom_data` JSON field!

---

**REMEMBER:** This is designed to be flexible. You can add ANY business without changing the database structure! 🚀 