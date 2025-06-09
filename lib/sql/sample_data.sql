-- =================================================================


--  DALILI MVP SAMPLE DATA SCRIPT (2024-06)
--  Description: This script populates the MVP schema with realistic
--               sample businesses to test the application.
--  Author: Gemini AI
--  Version: 1.0
-- =================================================================

-- NOTE: This script assumes you have already run `database_setup.sql` (V5.2)
-- It uses the categories and tags created in that script.

-- DALILI MVP SAMPLE DATA SCRIPT (2024-06)
-- This script populates the MVP schema with realistic sample data for development and testing.
-- Assumes you have run database_setup.sql

-- Step 1: Insert Areas
INSERT INTO areas (id, name_en, name_ar, city) VALUES
  (gen_random_uuid(), 'New Cairo', 'القاهرة الجديدة', 'Cairo'),
  (gen_random_uuid(), 'El Shorouk', 'الشروق', 'Cairo'),
  (gen_random_uuid(), 'Madinaty', 'مدينتي', 'Cairo'),
  (gen_random_uuid(), 'New Administrative Capital', 'العاصمة الإدارية الجديدة', 'Cairo'),
  (gen_random_uuid(), 'Sheikh Zayed', 'الشيخ زايد', 'Giza');

-- Step 2: Insert Categories
INSERT INTO categories (id, name_en, name_ar, icon_svg, color) VALUES
  (gen_random_uuid(), 'Automotive', 'سيارات', NULL, '#4B5563'),
  (gen_random_uuid(), 'Restaurants', 'مطاعم', NULL, '#EF4444'),
  (gen_random_uuid(), 'Shopping', 'تسوق', NULL, '#F59E42'),
  (gen_random_uuid(), 'Home Services', 'خدمات منزلية', NULL, '#10B981'),
  (gen_random_uuid(), 'Beauty & Spas', 'تجميل وسبا', NULL, '#A21CAF'),
  (gen_random_uuid(), 'Health & Medical', 'صحة وطب', NULL, '#2563EB');

-- Step 3: Insert Businesses (with area_id and no category_id)
-- We'll fetch area/category IDs for the join table next
INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'Modern Auto Care', 'Your one-stop shop for all car needs. We provide top-quality service.', NULL, NULL, '01234567890', NULL, NULL, 'Street 90, New Cairo', a.id, 'active'
FROM areas a WHERE a.name_en = 'New Cairo';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'Pizza Palace', 'Authentic Italian pizza made with fresh ingredients.', NULL, NULL, '01122334455', NULL, NULL, 'Mall Avenue, El Shorouk', a.id, 'active'
FROM areas a WHERE a.name_en = 'El Shorouk';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'Cairo Plumbers', 'Fast and reliable plumbing services, 24/7.', NULL, NULL, '01098765432', NULL, NULL, 'Zone 3, Madinaty', a.id, 'active'
FROM areas a WHERE a.name_en = 'Madinaty';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'Glamour Hair Studio', 'Chic and modern hair salon for men and women.', NULL, NULL, '01212121212', NULL, NULL, 'Street 90, New Cairo', a.id, 'active'
FROM areas a WHERE a.name_en = 'New Cairo';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'Burger Hub', 'The juiciest burgers in town. A must-try!', NULL, NULL, '01555667788', NULL, NULL, 'Downtown, New Cairo', a.id, 'active'
FROM areas a WHERE a.name_en = 'New Cairo';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'Tech World', 'Latest electronics and gadgets at the best prices.', NULL, NULL, '01110002223', NULL, NULL, 'Mall Avenue, Madinaty', a.id, 'active'
FROM areas a WHERE a.name_en = 'Madinaty';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'Speedy Car Wash', 'Get your car sparkling clean in minutes.', NULL, NULL, '01001001001', NULL, NULL, 'Zone 5, El Shorouk', a.id, 'active'
FROM areas a WHERE a.name_en = 'El Shorouk';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'Bright Smile Dental', 'Comprehensive dental care with a gentle touch.', NULL, NULL, '01011223344', NULL, NULL, 'Zone 2, Madinaty', a.id, 'active'
FROM areas a WHERE a.name_en = 'Madinaty';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'City Pharmacy', 'Your friendly neighborhood pharmacy, open 24/7.', NULL, NULL, '01288776655', NULL, NULL, 'Street 90, New Cairo', a.id, 'active'
FROM areas a WHERE a.name_en = 'New Cairo';

INSERT INTO businesses (id, name, description, logo_url, cover_url, phone, whatsapp, website, address, area_id, status)
SELECT gen_random_uuid(), 'The Sandwich Shop', 'Gourmet sandwiches and fresh salads.', NULL, NULL, '01155443322', NULL, NULL, 'Zone 1, El Shorouk', a.id, 'active'
FROM areas a WHERE a.name_en = 'El Shorouk';

-- Step 4: Link Businesses to Categories (business_category join table)
-- Example: Assign categories to businesses by matching names
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'Modern Auto Care' AND c.name_en = 'Automotive';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'Pizza Palace' AND c.name_en = 'Restaurants';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'Cairo Plumbers' AND c.name_en = 'Home Services';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'Glamour Hair Studio' AND c.name_en = 'Beauty & Spas';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'Burger Hub' AND c.name_en = 'Restaurants';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'Tech World' AND c.name_en = 'Shopping';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'Speedy Car Wash' AND c.name_en = 'Automotive';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'Bright Smile Dental' AND c.name_en = 'Health & Medical';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'City Pharmacy' AND c.name_en = 'Health & Medical';
INSERT INTO business_category (business_id, category_id)
SELECT b.id, c.id FROM businesses b, categories c WHERE b.name = 'The Sandwich Shop' AND c.name_en = 'Restaurants';
-- Add more as needed

-- SAMPLE DATA COMPLETE 