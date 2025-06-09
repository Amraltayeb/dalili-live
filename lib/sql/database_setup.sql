-- DALILI MVP DATABASE SETUP SCRIPT (2024-06)
-- This script creates a clean MVP schema for Dalili, removing all previous tables and features not in scope.

-- Step 0: Drop ALL old tables to ensure a clean slate
DROP TABLE IF EXISTS business_tags CASCADE;
DROP TABLE IF EXISTS category_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS user_businesses CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS user_notifications CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS areas CASCADE;
DROP TABLE IF EXISTS business_category CASCADE;

-- Step 1: Create the 'areas' table
CREATE TABLE areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create the 'categories' table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    icon_svg TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create the 'businesses' table
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    website TEXT,
    address TEXT,
    area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create the 'business_category' join table
CREATE TABLE business_category (
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (business_id, category_id)
);

-- Step 5: Create the 'users' table (admin only for MVP)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Indexes for search performance
CREATE INDEX idx_business_name ON businesses USING gin (to_tsvector('english', name));
CREATE INDEX idx_business_desc ON businesses USING gin (to_tsvector('english', description));
CREATE INDEX idx_category_name_en ON categories USING gin (to_tsvector('english', name_en));
CREATE INDEX idx_category_name_ar ON categories USING gin (to_tsvector('simple', name_ar));
CREATE INDEX idx_area_name_en ON areas USING gin (to_tsvector('english', name_en));
CREATE INDEX idx_area_name_ar ON areas USING gin (to_tsvector('simple', name_ar));

-- Step 7: Enable Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 8: Policies (example: public can read active businesses)
CREATE POLICY "Public can read active businesses" ON businesses FOR SELECT USING (status = 'active');
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read areas" ON areas FOR SELECT USING (true);

-- SETUP COMPLETE 