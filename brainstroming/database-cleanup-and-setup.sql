-- DALILI DATABASE CLEANUP & FUTURE-PROOF SETUP
-- Run this in Supabase SQL Editor to replace your existing sample data with the comprehensive schema

-- Step 1: Clean up existing tables (if they exist)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Step 2: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 3: Create the future-proof schema
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

-- Step 4: Create indexes for better performance
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_area ON businesses(area);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_featured ON businesses(featured);
CREATE INDEX idx_businesses_created_at ON businesses(created_at);

-- Step 5: Insert comprehensive categories
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

-- Step 6: Insert comprehensive sample businesses
-- Sample video editor with custom data
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
        "portfolio_samples": ["sample1.mp4", "sample2.mp4"],
        "min_budget": "500 EGP",
        "experience_years": 5
    }'::jsonb,
    'active'
);

-- Sample restaurant with comprehensive data
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
        "accepts_reservations": false,
        "average_meal_cost": "150 EGP"
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

-- Sample lawyer (professional service)
INSERT INTO businesses (
    name, category, subcategory, phone, area, description,
    price_range, custom_data
) VALUES (
    'Dr. Ahmed Hassan Law Firm',
    'Professional Services',
    'Legal Services',
    '+20 1055667788',
    'New Cairo',
    'Experienced law firm specializing in business and family law',
    '$$$',
    '{
        "practice_areas": ["Family Law", "Business Law", "Real Estate"],
        "consultation_fee": "500 EGP",
        "languages": ["Arabic", "English"],
        "years_experience": 15,
        "online_consultation": true
    }'::jsonb
);

-- Sample doctor (healthcare)
INSERT INTO businesses (
    name, name_ar, category, subcategory, phone, area, description,
    price_range, custom_data
) VALUES (
    'Dr. Sarah Medical Clinic',
    'عيادة دكتورة سارة',
    'Healthcare',
    'General Medicine',
    '+20 1099887766',
    'New Cairo',
    'General medicine and family healthcare',
    '$$',
    '{
        "specialties": ["General Medicine", "Family Medicine"],
        "consultation_fee": "300 EGP",
        "accepted_insurance": ["Allianz", "AXA"],
        "clinic_name": "New Cairo Medical Center",
        "appointment_required": true,
        "emergency_available": false
    }'::jsonb
);

-- Sample plumber (home services)
INSERT INTO businesses (
    name, category, subcategory, phone, area, description,
    price_range, custom_data
) VALUES (
    'Ahmed Plumbing Services',
    'Home Services',
    'Plumbing',
    '+20 1077889900',
    'New Cairo',
    '24/7 plumbing services for residential and commercial properties',
    '$',
    '{
        "services": ["Pipe repair", "Bathroom installation", "Kitchen plumbing"],
        "emergency_available": true,
        "service_areas": ["New Cairo", "Rehab", "Madinaty"],
        "hourly_rate": "100 EGP",
        "minimum_charge": "200 EGP",
        "warranty_provided": "6 months"
    }'::jsonb
);

-- Step 7: Update category_id for all businesses
UPDATE businesses 
SET category_id = categories.id 
FROM categories 
WHERE businesses.category = categories.name;

-- SUCCESS MESSAGE
SELECT '🎉 DATABASE CLEANUP & SETUP COMPLETE!' as message
UNION ALL
SELECT '✨ Old sample data removed' 
UNION ALL
SELECT '🚀 Future-proof schema installed'
UNION ALL
SELECT '📊 6 diverse sample businesses added'
UNION ALL
SELECT '🏢 10 comprehensive categories ready'
UNION ALL
SELECT '💪 Your admin panel is now ready to handle ANY business type!'
UNION ALL
SELECT '🎯 Next: Test your admin panel at /admin with password: dalili2024'; 