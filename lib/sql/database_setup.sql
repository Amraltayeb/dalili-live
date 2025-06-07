-- =================================================================
--  DALILI DATABASE SETUP SCRIPT (V5.2 - YELP-STYLE TAG-BASED CATEGORIES)
--  Description: This script creates the full V5 schema and ensures a
--               completely clean slate by removing ALL old tables,
--               including obsolete user and review tables.
--  Author: Gemini AI
--  Version: 5.2
-- =================================================================

-- Step 0: Drop ALL old tables to ensure a clean slate
-- This is necessary to resolve data type conflicts and remove obsolete tables.
-- The order is important to respect dependencies before CASCADE.
DROP TABLE IF EXISTS business_owners CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS user_businesses CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS user_notifications CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS business_tags CASCADE;
DROP TABLE IF EXISTS category_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;


-- Step 1: Create the 'categories' table
-- This table stores the 22 main Yelp categories.
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    name_ar TEXT,
    icon TEXT, -- Re-added for UI presentation of main categories
    color TEXT, -- Re-added for UI presentation
    status TEXT DEFAULT 'active' NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE categories IS 'Stores the 22 main Yelp-style business categories.';

-- Step 2: Create the 'businesses' table (Reverted)
-- Schema reverted to a simpler form. Subcategories are handled by tags.
CREATE TABLE IF NOT EXISTS businesses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Core Info
    name TEXT NOT NULL,
    name_ar TEXT,
    description TEXT,
    description_ar TEXT,
    
    -- Contact Info
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    
    -- Location
    area TEXT,
    address TEXT,
    
    -- Categorization (Simplified)
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    -- The subcategory_id has been removed in favor of a more flexible tag-based system.
    -- A business's "subcategories" are determined by the tags it is associated with.
    
    -- Business Details
    services_offered JSONB,
    price_range TEXT DEFAULT '$',
    working_hours JSONB,
    images JSONB,
    social_links JSONB,
    custom_data JSONB,
    
    -- Status & Flags
    status TEXT DEFAULT 'pending' NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    rating REAL DEFAULT 0.0
);

COMMENT ON TABLE businesses IS 'Stores all business listings. Subcategories are managed via the business_tags table.';

-- Step 3: Create the 'tags' table for semantic search AND subcategories
-- This table will store all searchable keywords, phrases, and subcategory names.
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE tags IS 'Stores all searchable tags, which also function as subcategories.';

-- Step 4: Create the 'category_tags' join table (NEW)
-- This is the key table for the new structure. It links a main category to its "subcategories" (tags).
CREATE TABLE IF NOT EXISTS category_tags (
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, tag_id)
);
COMMENT ON TABLE category_tags IS 'Links main categories to their associated search tags (subcategories).';

-- Step 5: Create the 'business_tags' join table
-- This table links businesses to their associated tags (many-to-many relationship).
CREATE TABLE IF NOT EXISTS business_tags (
    business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (business_id, tag_id)
);
COMMENT ON TABLE business_tags IS 'Links businesses to their relevant search tags.';


-- Step 6: Enable Row Level Security (RLS)
-- Good practice for Supabase to secure your data.
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_tags ENABLE ROW LEVEL SECURITY; -- Add RLS for new table
ALTER TABLE business_tags ENABLE ROW LEVEL SECURITY;

-- Step 7: Create Policies for Public Access
-- Allows read-only access to 'active' data for all users.
CREATE POLICY "Public can read active categories" ON categories FOR SELECT USING (status = 'active');
CREATE POLICY "Public can read active businesses" ON businesses FOR SELECT USING (status = 'active');
CREATE POLICY "Public can read all tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public can read all category_tags" ON category_tags FOR SELECT USING (true); -- Add policy for new table
CREATE POLICY "Public can read all business_tags" ON business_tags FOR SELECT USING (true);


-- Step 8: Pre-populate with Yelp-style main categories
-- This provides a solid, scalable foundation based on the 22 main Yelp categories.
-- Note: The old categories are removed to avoid conflicts.
DELETE FROM categories; -- Clear out old data before inserting new
INSERT INTO categories (name, icon, sort_order) VALUES
('Active Life', '🤸', 1),
('Arts & Entertainment', '🎭', 2),
('Automotive', '🚗', 3),
('Beauty & Spas', '💅', 4),
('Education', '🎓', 5),
('Event Planning & Services', '🎉', 6),
('Financial Services', '💰', 7),
('Food', '🍔', 8),
('Health & Medical', '⚕️', 9),
('Home Services', '🛠️', 10),
('Hotels & Travel', '✈️', 11),
('Local Flavor', '⭐', 12),
('Local Services', '⚙️', 13),
('Mass Media', '📰', 14),
('Nightlife', '🌙', 15),
('Pets', '🐾', 16),
('Professional Services', '💼', 17),
('Public Services & Government', '🏛️', 18),
('Real Estate', '🏠', 19),
('Religious Organizations', '⛪', 20),
('Restaurants', '🍽️', 21),
('Shopping', '🛍️', 22)
ON CONFLICT (name) DO NOTHING;


-- Step 9: Populate Tags and link them to Categories
-- This step inserts all the "subcategories" as tags and then creates the
-- relationship between the main categories and these tags.
-- This is the core of the flexible, Yelp-style system.
DO $$
DECLARE
    -- Category IDs
    active_life_id BIGINT;
    arts_id BIGINT;
    automotive_id BIGINT;
    beauty_id BIGINT;
    education_id BIGINT;
    events_id BIGINT;
    financial_id BIGINT;
    food_id BIGINT;
    health_id BIGINT;
    home_services_id BIGINT;
    hotels_id BIGINT;
    local_flavor_id BIGINT;
    local_services_id BIGINT;
    media_id BIGINT;
    nightlife_id BIGINT;
    pets_id BIGINT;
    professional_id BIGINT;
    public_services_id BIGINT;
    real_estate_id BIGINT;
    religious_id BIGINT;
    restaurants_id BIGINT;
    shopping_id BIGINT;
    
    -- Tag IDs
    tag_id_holder BIGINT;

BEGIN
    -- Get category IDs
    SELECT id INTO active_life_id FROM categories WHERE name = 'Active Life';
    SELECT id INTO arts_id FROM categories WHERE name = 'Arts & Entertainment';
    SELECT id INTO automotive_id FROM categories WHERE name = 'Automotive';
    SELECT id INTO beauty_id FROM categories WHERE name = 'Beauty & Spas';
    SELECT id INTO education_id FROM categories WHERE name = 'Education';
    SELECT id INTO events_id FROM categories WHERE name = 'Event Planning & Services';
    SELECT id INTO financial_id FROM categories WHERE name = 'Financial Services';
    SELECT id INTO food_id FROM categories WHERE name = 'Food';
    SELECT id INTO health_id FROM categories WHERE name = 'Health & Medical';
    SELECT id INTO home_services_id FROM categories WHERE name = 'Home Services';
    SELECT id INTO hotels_id FROM categories WHERE name = 'Hotels & Travel';
    SELECT id INTO local_flavor_id FROM categories WHERE name = 'Local Flavor';
    SELECT id INTO local_services_id FROM categories WHERE name = 'Local Services';
    SELECT id INTO media_id FROM categories WHERE name = 'Mass Media';
    SELECT id INTO nightlife_id FROM categories WHERE name = 'Nightlife';
    SELECT id INTO pets_id FROM categories WHERE name = 'Pets';
    SELECT id INTO professional_id FROM categories WHERE name = 'Professional Services';
    SELECT id INTO public_services_id FROM categories WHERE name = 'Public Services & Government';
    SELECT id INTO real_estate_id FROM categories WHERE name = 'Real Estate';
    SELECT id INTO religious_id FROM categories WHERE name = 'Religious Organizations';
    SELECT id INTO restaurants_id FROM categories WHERE name = 'Restaurants';
    SELECT id INTO shopping_id FROM categories WHERE name = 'Shopping';

    -- Function to insert a tag and link it to a category
    CREATE OR REPLACE FUNCTION link_tag(cat_id BIGINT, tag_name TEXT)
    RETURNS void AS $inner$
    DECLARE
      tag_id_h BIGINT;
    BEGIN
        INSERT INTO tags (name) VALUES (tag_name) ON CONFLICT (name) DO UPDATE SET name = tag_name RETURNING id INTO tag_id_h;
        INSERT INTO category_tags (category_id, tag_id) VALUES (cat_id, tag_id_h) ON CONFLICT (category_id, tag_id) DO NOTHING;
    END;
    $inner$ LANGUAGE plpgsql;

    -- Automotive Tags
    PERFORM link_tag(automotive_id, 'Auto Detailing');
    PERFORM link_tag(automotive_id, 'Auto Glass Services');
    PERFORM link_tag(automotive_id, 'Auto Parts & Supplies');
    PERFORM link_tag(automotive_id, 'Auto Repair');
    PERFORM link_tag(automotive_id, 'Body Shops');
    PERFORM link_tag(automotive_id, 'Car Dealers');
    PERFORM link_tag(automotive_id, 'Car Wash');
    PERFORM link_tag(automotive_id, 'Gas & Service Stations');
    PERFORM link_tag(automotive_id, 'Motorcycle Dealers');
    PERFORM link_tag(automotive_id, 'Motorcycle Repair');
    PERFORM link_tag(automotive_id, 'Oil Change Stations');
    PERFORM link_tag(automotive_id, 'Parking');
    PERFORM link_tag(automotive_id, 'Smog Check Stations');
    PERFORM link_tag(automotive_id, 'Tires');
    PERFORM link_tag(automotive_id, 'Towing');
    PERFORM link_tag(automotive_id, 'Truck Rental');

    -- Beauty & Spas Tags
    PERFORM link_tag(beauty_id, 'Barbers');
    PERFORM link_tag(beauty_id, 'Cosmetics & Beauty Supply');
    PERFORM link_tag(beauty_id, 'Day Spas');
    PERFORM link_tag(beauty_id, 'Eyelash Service');
    PERFORM link_tag(beauty_id, 'Hair Extensions');
    PERFORM link_tag(beauty_id, 'Hair Removal');
    PERFORM link_tag(beauty_id, 'Hair Salons');
    PERFORM link_tag(beauty_id, 'Makeup Artists');
    PERFORM link_tag(beauty_id, 'Massage');
    PERFORM link_tag(beauty_id, 'Medical Spas');
    PERFORM link_tag(beauty_id, 'Nail Salons');
    PERFORM link_tag(beauty_id, 'Permanent Makeup');
    PERFORM link_tag(beauty_id, 'Piercing');
    PERFORM link_tag(beauty_id, 'Skin Care');
    PERFORM link_tag(beauty_id, 'Tanning');
    PERFORM link_tag(beauty_id, 'Tattoo');

    -- Home Services Tags
    PERFORM link_tag(home_services_id, 'Building Supplies');
    PERFORM link_tag(home_services_id, 'Carpet Installation');
    PERFORM link_tag(home_services_id, 'Carpeting');
    PERFORM link_tag(home_services_id, 'Contractors');
    PERFORM link_tag(home_services_id, 'Damage Restoration');
    PERFORM link_tag(home_services_id, 'Electricians');
    PERFORM link_tag(home_services_id, 'Flooring');
    PERFORM link_tag(home_services_id, 'Gardeners');
    PERFORM link_tag(home_services_id, 'Handyman');
    PERFORM link_tag(home_services_id, 'Heating & Air Conditioning/HVAC');
    PERFORM link_tag(home_services_id, 'Home Cleaning');
    PERFORM link_tag(home_services_id, 'Home Inspectors');
    PERFORM link_tag(home_services_id, 'Interior Design');
    PERFORM link_tag(home_services_id, 'Internet Service Providers');
    PERFORM link_tag(home_services_id, 'Keys & Locksmiths');
    PERFORM link_tag(home_services_id, 'Landscaping');
    PERFORM link_tag(home_services_id, 'Movers');
    PERFORM link_tag(home_services_id, 'Painters');
    PERFORM link_tag(home_services_id, 'Plumbing');
    PERFORM link_tag(home_services_id, 'Pool Cleaners');
    PERFORM link_tag(home_services_id, 'Roofing');
    PERFORM link_tag(home_services_id, 'Security Systems');
    PERFORM link_tag(home_services_id, 'Television Service Providers');
    PERFORM link_tag(home_services_id, 'Tree Services');
    PERFORM link_tag(home_services_id, 'Window Washing');

    -- Restaurants Tags
    PERFORM link_tag(restaurants_id, 'American (New)');
    PERFORM link_tag(restaurants_id, 'American (Traditional)');
    PERFORM link_tag(restaurants_id, 'Bakeries');
    PERFORM link_tag(restaurants_id, 'Barbeque');
    PERFORM link_tag(restaurants_id, 'Breakfast & Brunch');
    PERFORM link_tag(restaurants_id, 'Burgers');
    PERFORM link_tag(restaurants_id, 'Cafes');
    PERFORM link_tag(restaurants_id, 'Chinese');
    PERFORM link_tag(restaurants_id, 'Coffee & Tea');
    PERFORM link_tag(restaurants_id, 'Delis');
    PERFORM link_tag(restaurants_id, 'Desserts');
    PERFORM link_tag(restaurants_id, 'Fast Food');
    PERFORM link_tag(restaurants_id, 'Indian');
    PERFORM link_tag(restaurants_id, 'Italian');
    PERFORM link_tag(restaurants_id, 'Japanese');
    PERFORM link_tag(restaurants_id, 'Juice Bars & Smoothies');
    PERFORM link_tag(restaurants_id, 'Mexican');
    PERFORM link_tag(restaurants_id, 'Pizza');
    PERFORM link_tag(restaurants_id, 'Salad');
    PERFORM link_tag(restaurants_id, 'Sandwiches');
    PERFORM link_tag(restaurants_id, 'Seafood');
    PERFORM link_tag(restaurants_id, 'Steakhouses');
    PERFORM link_tag(restaurants_id, 'Sushi Bars');
    PERFORM link_tag(restaurants_id, 'Thai');
    PERFORM link_tag(restaurants_id, 'Vegetarian');

    -- Health & Medical Tags
    PERFORM link_tag(health_id, 'Acupuncture');
    PERFORM link_tag(health_id, 'Cannabis Clinics');
    PERFORM link_tag(health_id, 'Chiropractors');
    PERFORM link_tag(health_id, 'Counseling & Mental Health');
    PERFORM link_tag(health_id, 'Dentists');
    PERFORM link_tag(health_id, 'Diagnostic Services');
    PERFORM link_tag(health_id, 'Doctors');
    PERFORM link_tag(health_id, 'Drugstores');
    PERFORM link_tag(health_id, 'Hearing Aid Providers');
    PERFORM link_tag(health_id, 'Hospitals');
    PERFORM link_tag(health_id, 'Medical Centers');
    PERFORM link_tag(health_id, 'Nutritionists');
    PERFORM link_tag(health_id, 'Optometrists');
    PERFORM link_tag(health_id, 'Physical Therapy');
    PERFORM link_tag(health_id, 'Urgent Care');
    PERFORM link_tag(health_id, 'Weight Loss Centers');

    -- Add more links for other categories here...
    -- Example for Shopping
    PERFORM link_tag(shopping_id, 'Antiques');
    PERFORM link_tag(shopping_id, 'Arts & Crafts');
    PERFORM link_tag(shopping_id, 'Books, Mags, Music & Video');
    PERFORM link_tag(shopping_id, 'Bridal');
    PERFORM link_tag(shopping_id, 'Computers');
    PERFORM link_tag(shopping_id, 'Cosmetics & Beauty Supply');
    PERFORM link_tag(shopping_id, 'Department Stores');
    PERFORM link_tag(shopping_id, 'Electronics');
    PERFORM link_tag(shopping_id, 'Eyewear & Opticians');
    PERFORM link_tag(shopping_id, 'Fashion');
    PERFORM link_tag(shopping_id, 'Flowers & Gifts');
    PERFORM link_tag(shopping_id, 'Home & Garden');
    PERFORM link_tag(shopping_id, 'Jewelry');
    PERFORM link_tag(shopping_id, 'Mobile Phones');
    PERFORM link_tag(shopping_id, 'Shopping Centers');
    PERFORM link_tag(shopping_id, 'Sporting Goods');
    PERFORM link_tag(shopping_id, 'Toy Stores');

    -- Dropping the helper function after use
    DROP FUNCTION link_tag(BIGINT, TEXT);

END $$;


-- Step 10: Semantic Search Database Function (Unchanged)
-- This function allows us to search across business names, descriptions, and tags.
-- It already supports our new tag-based subcategory model perfectly.
CREATE OR REPLACE FUNCTION search_businesses(search_term TEXT)
RETURNS SETOF businesses AS $$
BEGIN
  RETURN QUERY
  SELECT b.*
  FROM businesses b
  LEFT JOIN business_tags bt ON b.id = bt.business_id
  LEFT JOIN tags t ON bt.tag_id = t.id
  WHERE
    -- Match against business name or description
    (b.name ILIKE ('%' || search_term || '%') OR b.description ILIKE ('%' || search_term || '%'))
    OR
    -- Match against associated tags
    (t.name ILIKE ('%' || search_term || '%'))
  GROUP BY b.id; -- Use GROUP BY to avoid duplicate businesses in results
END;
$$ LANGUAGE plpgsql;

-- =================================================================
--  SETUP COMPLETE
-- =================================================================
--  Next Steps:
--  1. Populate the 'tags' table with subcategory names.
--  2. Populate the 'category_tags' table to link tags to categories.
-- ================================================================= 