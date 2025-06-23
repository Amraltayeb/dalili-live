-- =================================================================
-- DALILI DATABASE ENHANCEMENT MIGRATIONS (Yelp-Inspired)
-- =================================================================
-- Description: Enhance existing tables with modern business directory features
-- Author: AI Assistant
-- Date: 2024
-- =================================================================

-- ============== BUSINESSES TABLE ENHANCEMENTS ==============

-- Add new columns to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS price_range INTEGER CHECK (price_range >= 1 AND price_range <= 4),
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST (
  POINT(longitude, latitude)
);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses (average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_price_range ON businesses (price_range);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses (verified);

-- ============== AREAS TABLE ENHANCEMENTS ==============

-- Add location coordinates to areas
ALTER TABLE areas 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- ============== REVIEWS TABLE (NEW) ==============

-- Create reviews table for business ratings and reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  images JSONB DEFAULT '[]',
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews (business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

-- ============== BUSINESS CATEGORIES ENHANCEMENT ==============

-- Ensure business_category table exists with proper constraints
CREATE TABLE IF NOT EXISTS business_category (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(business_id, category_id)
);

-- ============== FUNCTIONS FOR RATING CALCULATIONS ==============

-- Function to update business average rating when reviews change
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses 
  SET 
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2) 
      FROM reviews 
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    )
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic rating updates
DROP TRIGGER IF EXISTS trigger_update_business_rating_insert ON reviews;
DROP TRIGGER IF EXISTS trigger_update_business_rating_update ON reviews;
DROP TRIGGER IF EXISTS trigger_update_business_rating_delete ON reviews;

CREATE TRIGGER trigger_update_business_rating_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_business_rating();

CREATE TRIGGER trigger_update_business_rating_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_business_rating();

CREATE TRIGGER trigger_update_business_rating_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_business_rating();

-- ============== SAMPLE ENHANCED DATA ==============

-- Update existing businesses with enhanced data
UPDATE businesses SET 
  latitude = 30.0444, 
  longitude = 31.2357,
  email = 'info@' || LOWER(REPLACE(name, ' ', '')) || '.com',
  price_range = 2,
  verified = TRUE,
  business_hours = '{
    "monday": {"open": "09:00", "close": "18:00"},
    "tuesday": {"open": "09:00", "close": "18:00"},
    "wednesday": {"open": "09:00", "close": "18:00"},
    "thursday": {"open": "09:00", "close": "18:00"},
    "friday": {"open": "09:00", "close": "18:00"},
    "saturday": {"open": "10:00", "close": "16:00"},
    "sunday": {"closed": true}
  }'::jsonb,
  social_media = '{
    "facebook": "https://facebook.com/' || LOWER(REPLACE(name, ' ', '')),
    "instagram": "https://instagram.com/' || LOWER(REPLACE(name, ' ', ''))
  }'::jsonb,
  features = '{
    "wifi": true,
    "parking": true,
    "accepts_cards": true
  }'::jsonb
WHERE latitude IS NULL;

-- Update areas with sample coordinates (Egypt locations)
UPDATE areas SET 
  latitude = CASE 
    WHEN name_en = 'New Cairo' THEN 30.0131
    WHEN name_en = 'El Shorouk' THEN 30.1218
    WHEN name_en = 'Madinaty' THEN 30.1070
    WHEN name_en = 'Sheikh Zayed' THEN 30.0798
    WHEN name_en = 'October City' THEN 29.9602
    ELSE 30.0444
  END,
  longitude = CASE 
    WHEN name_en = 'New Cairo' THEN 31.4586
    WHEN name_en = 'El Shorouk' THEN 31.6092
    WHEN name_en = 'Madinaty' THEN 31.6393
    WHEN name_en = 'Sheikh Zayed' THEN 30.9716
    WHEN name_en = 'October City' THEN 30.9373
    ELSE 31.2357
  END
WHERE latitude IS NULL;

-- Insert sample reviews for businesses
INSERT INTO reviews (business_id, user_name, rating, title, comment)
SELECT 
  id,
  'Ahmed Hassan',
  4 + (RANDOM() * 1)::INTEGER, -- Random rating 4-5
  'Great service!',
  'Had a wonderful experience here. Highly recommended!'
FROM businesses 
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE business_id = businesses.id)
LIMIT 10;

INSERT INTO reviews (business_id, user_name, rating, title, comment)
SELECT 
  id,
  'Sara Mohamed',
  3 + (RANDOM() * 2)::INTEGER, -- Random rating 3-5
  'Good quality',
  'Professional service and fair prices. Will come back again.'
FROM businesses 
WHERE id IN (SELECT id FROM businesses ORDER BY RANDOM() LIMIT 8);

-- ============== PERFORMANCE OPTIMIZATIONS ==============

-- Additional useful indexes
CREATE INDEX IF NOT EXISTS idx_businesses_status_verified ON businesses (status, verified);
CREATE INDEX IF NOT EXISTS idx_businesses_area_rating ON businesses (area_id, average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_categories_name_en ON categories (name_en);

-- Full-text search index for business names and descriptions
CREATE INDEX IF NOT EXISTS idx_businesses_search 
ON businesses 
USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============== USEFUL VIEWS ==============

-- View for businesses with their categories and ratings
CREATE OR REPLACE VIEW business_details_view AS
SELECT 
  b.*,
  c.name_en as category_name,
  c.icon_svg as category_icon,
  a.name_en as area_name,
  ROUND(b.average_rating, 1) as display_rating
FROM businesses b
LEFT JOIN business_category bc ON b.id = bc.business_id
LEFT JOIN categories c ON bc.category_id = c.id
LEFT JOIN areas a ON b.area_id = a.id
WHERE b.status = 'active';

-- View for business statistics
CREATE OR REPLACE VIEW business_stats_view AS
SELECT 
  COUNT(*) as total_businesses,
  COUNT(*) FILTER (WHERE verified = true) as verified_businesses,
  ROUND(AVG(average_rating), 2) as overall_avg_rating,
  COUNT(*) FILTER (WHERE average_rating >= 4.0) as high_rated_businesses
FROM businesses 
WHERE status = 'active';

-- ============== CATEGORIZATION KEYWORDS TABLE (NEW) ==============

-- Create keywords table for admin-manageable categorization
CREATE TABLE IF NOT EXISTS categorization_keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  keyword VARCHAR(100) NOT NULL,
  region VARCHAR(50) DEFAULT 'global' NOT NULL, -- 'global', 'egypt', 'usa', 'uk', etc.
  priority INTEGER DEFAULT 1, -- Higher priority = more specific/important
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100), -- Admin user who added this
  UNIQUE(category_id, keyword, region)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_keywords_category_region ON categorization_keywords (category_id, region);
CREATE INDEX IF NOT EXISTS idx_keywords_active ON categorization_keywords (is_active);
CREATE INDEX IF NOT EXISTS idx_keywords_priority ON categorization_keywords (priority DESC);

-- ============== ADMIN SETTINGS TABLE (NEW) ==============

-- Create admin settings table for system configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'string', -- 'string', 'boolean', 'number', 'json'
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE, -- Whether frontend can access this setting
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100)
);

-- ============== SEED INITIAL KEYWORDS ==============

-- Insert global restaurant keywords
INSERT INTO categorization_keywords (category_id, keyword, region, priority) 
SELECT c.id, keyword, 'global', priority
FROM categories c,
  (VALUES 
    ('restaurant', 5), ('food', 3), ('cafe', 4), ('bistro', 4), ('dining', 3),
    ('burger', 4), ('pizza', 4), ('grill', 3), ('kitchen', 2), ('eatery', 3),
    ('sandwich', 3), ('fast food', 4), ('diner', 3), ('bakery', 3), ('coffee', 3)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Restaurants';

-- Insert global health keywords  
INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'global', priority
FROM categories c,
  (VALUES
    ('hospital', 5), ('medical', 4), ('clinic', 5), ('pharmacy', 5), ('doctor', 4),
    ('health', 3), ('dental', 4), ('dentist', 4), ('physician', 4), ('medicine', 3)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Health & Medical';

-- Insert global automotive keywords
INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'global', priority  
FROM categories c,
  (VALUES
    ('auto', 4), ('car wash', 5), ('garage', 4), ('mechanic', 5), ('automotive', 4),
    ('car repair', 5), ('oil change', 4), ('tire', 3), ('service center', 4)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Automotive';

-- Insert global beauty keywords
INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'global', priority
FROM categories c,
  (VALUES
    ('spa', 5), ('salon', 5), ('beauty', 4), ('hair salon', 5), ('barber', 4),
    ('nails', 4), ('massage', 4), ('facial', 3), ('manicure', 3)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Beauty & Spas';

-- Insert global shopping keywords
INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'global', priority
FROM categories c,
  (VALUES
    ('mall', 5), ('shop', 3), ('store', 3), ('market', 4), ('shopping center', 5),
    ('retail', 3), ('supermarket', 4), ('grocery', 4)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Shopping';

-- Insert Egyptian-specific keywords
INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'egypt', priority
FROM categories c,
  (VALUES
    ('koshary', 5), ('sequoia', 5), ('abou tarek', 5), ('ful', 4), ('tamiya', 4)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Restaurants';

INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'egypt', priority
FROM categories c,
  (VALUES
    ('city stars', 5), ('festival city', 5), ('carrefour', 4), ('spinneys', 4)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Shopping';

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, setting_type, description, is_public)
VALUES 
  ('auto_detect_region', 'true', 'boolean', 'Automatically detect business region for keyword matching', FALSE),
  ('default_region', 'global', 'string', 'Default region to use when region cannot be detected', FALSE),
  ('keyword_matching_enabled', 'true', 'boolean', 'Enable automatic keyword-based categorization', FALSE),
  ('min_keyword_length', '2', 'number', 'Minimum length for keyword matching', FALSE);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for keywords table
DROP TRIGGER IF EXISTS update_keywords_updated_at ON categorization_keywords;
CREATE TRIGGER update_keywords_updated_at 
    BEFORE UPDATE ON categorization_keywords 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for admin settings table  
DROP TRIGGER IF EXISTS update_settings_updated_at ON admin_settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 