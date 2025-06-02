-- 🧑‍💼 COMPREHENSIVE USER MANAGEMENT SCHEMA
-- Supports: Customers, Business Owners, Admins, Staff, Moderators

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MAIN USERS TABLE - Core user data
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    name TEXT NOT NULL,
    name_ar TEXT, -- Arabic name
    profile_image TEXT, -- Profile picture URL
    
    -- Location
    area TEXT, -- Primary area (New Cairo, El Shorouk, etc.)
    address TEXT, -- Full address
    coordinates JSONB, -- {lat, lng} for location services
    
    -- User Type & Status
    user_type TEXT DEFAULT 'customer' CHECK (user_type IN (
        'customer',           -- Regular users browsing/searching
        'business_owner',     -- Owns/manages business listings
        'admin',             -- Platform administrators
        'staff',             -- Platform staff members
        'moderator',         -- Content moderators
        'support',           -- Customer support
        'super_admin'        -- Super administrators
    )),
    status TEXT DEFAULT 'active' CHECK (status IN (
        'active',            -- Normal active user
        'inactive',          -- Temporarily inactive
        'suspended',         -- Suspended by admin
        'banned',           -- Permanently banned
        'pending_verification', -- Awaiting email/phone verification
        'deleted'           -- Soft deleted account
    )),
    
    -- Authentication & Security
    password_hash TEXT, -- For local authentication
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    phone_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMPTZ,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret TEXT,
    
    -- User Preferences
    language TEXT DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
    timezone TEXT DEFAULT 'Africa/Cairo',
    notification_preferences JSONB DEFAULT '{
        "email_notifications": true,
        "sms_notifications": false,
        "push_notifications": true,
        "marketing_emails": false
    }'::jsonb,
    
    -- Business Owner Specific (null for non-business users)
    business_verification_status TEXT CHECK (business_verification_status IN (
        'pending', 'verified', 'rejected', null
    )),
    business_verification_documents JSONB, -- Array of document URLs
    business_category TEXT, -- Main business category they operate in
    
    -- Admin/Staff Specific (null for regular users)
    admin_permissions JSONB, -- Array of permissions for admin users
    department TEXT, -- For staff organization
    
    -- Activity & Analytics
    last_login TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    profile_completion_percentage INTEGER DEFAULT 0,
    
    -- Metadata
    signup_source TEXT, -- 'website', 'mobile_app', 'referral', etc.
    referral_code TEXT UNIQUE, -- User's personal referral code
    referred_by_user_id UUID REFERENCES users(id),
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMPTZ,
    privacy_policy_accepted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- For soft deletes
);

-- 2. USER PROFILES TABLE - Extended profile information
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal Details
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    
    -- Professional Information
    occupation TEXT,
    company TEXT,
    job_title TEXT,
    industry TEXT,
    
    -- Contact & Social
    website TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}'::jsonb, -- {instagram, facebook, linkedin, etc.}
    
    -- Interests & Preferences
    interests JSONB DEFAULT '[]'::jsonb, -- Array of interest categories
    favorite_areas JSONB DEFAULT '[]'::jsonb, -- Preferred areas for services
    budget_preferences JSONB DEFAULT '{}'::jsonb, -- Preferred price ranges per category
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BUSINESS OWNERS TABLE - Additional data for business owners
CREATE TABLE business_owners (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Business Owner Details
    national_id TEXT, -- For verification purposes
    commercial_register TEXT, -- Business registration number
    tax_id TEXT, -- Tax identification number
    
    -- Verification Documents
    id_document_url TEXT,
    business_license_url TEXT,
    tax_certificate_url TEXT,
    verification_notes TEXT, -- Admin notes about verification
    verified_by_admin_id UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    
    -- Business Preferences
    max_businesses_allowed INTEGER DEFAULT 3,
    subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN (
        'free', 'basic', 'premium', 'enterprise'
    )),
    subscription_expires TIMESTAMPTZ,
    
    -- Performance Metrics
    total_businesses INTEGER DEFAULT 0,
    total_reviews_received INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER BUSINESS RELATIONSHIPS - Links users to businesses they own/manage
CREATE TABLE user_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    
    role TEXT DEFAULT 'owner' CHECK (role IN (
        'owner',        -- Business owner
        'manager',      -- Business manager
        'employee',     -- Business employee
        'editor'        -- Can edit business info only
    )),
    
    permissions JSONB DEFAULT '[
        "view_business",
        "edit_business",
        "manage_reviews",
        "view_analytics"
    ]'::jsonb,
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, business_id) -- Prevent duplicate relationships
);

-- 5. USER SESSIONS TABLE - Track user sessions for security
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    session_token TEXT UNIQUE NOT NULL,
    device_info JSONB, -- {device_type, browser, os, etc.}
    ip_address INET,
    location_info JSONB, -- {country, city, etc.}
    
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER ACTIVITIES TABLE - Track user actions for analytics
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    activity_type TEXT NOT NULL, -- 'login', 'search', 'view_business', 'contact_business', etc.
    activity_data JSONB, -- Additional data about the activity
    
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL, -- If related to a business
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER FAVORITES TABLE - User's favorite businesses
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    
    notes TEXT, -- Personal notes about why they favorited
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, business_id) -- Prevent duplicate favorites
);

-- 8. USER NOTIFICATIONS TABLE - System notifications
CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL, -- 'review_received', 'business_approved', 'system_message', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional notification data
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    action_url TEXT, -- URL to navigate when notification is clicked
    
    expires_at TIMESTAMPTZ, -- Auto-delete old notifications
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_area ON users(area);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_business_category ON users(business_category);

CREATE INDEX idx_user_businesses_user_id ON user_businesses(user_id);
CREATE INDEX idx_user_businesses_business_id ON user_businesses(business_id);
CREATE INDEX idx_user_businesses_role ON user_businesses(role);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_business_id ON user_favorites(business_id);

CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at);

-- CREATE TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_owners_updated_at BEFORE UPDATE ON business_owners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_businesses_updated_at BEFORE UPDATE ON user_businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- SAMPLE DATA INSERTS

-- Insert sample admin user
INSERT INTO users (
    email, name, user_type, status, email_verified, admin_permissions
) VALUES (
    'admin@dalili.live',
    'System Administrator',
    'admin',
    'active',
    true,
    '["manage_users", "manage_businesses", "manage_categories", "view_analytics", "system_settings"]'::jsonb
);

-- Insert sample business owner
INSERT INTO users (
    email, phone, name, user_type, area, status, email_verified, business_category
) VALUES (
    'owner@example.com',
    '+20 1012345678',
    'Ahmed Mohamed',
    'business_owner',
    'New Cairo',
    'active',
    true,
    'Restaurants & Food'
);

-- Insert sample customer
INSERT INTO users (
    email, phone, name, user_type, area, status, email_verified
) VALUES (
    'customer@example.com',
    '+20 1098765432',
    'Sara Ahmed',
    'customer',
    'New Cairo',
    'active',
    true
);

-- Create user profile for business owner
INSERT INTO user_profiles (
    user_id, first_name, last_name, occupation, interests
) VALUES (
    (SELECT id FROM users WHERE email = 'owner@example.com'),
    'Ahmed',
    'Mohamed',
    'Restaurant Owner',
    '["food", "business", "hospitality"]'::jsonb
);

-- Create business owner record
INSERT INTO business_owners (
    user_id, subscription_type, max_businesses_allowed
) VALUES (
    (SELECT id FROM users WHERE email = 'owner@example.com'),
    'basic',
    5
); 