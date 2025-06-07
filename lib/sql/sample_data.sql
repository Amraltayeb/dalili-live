-- =================================================================


--  DALILI SAMPLE DATA SCRIPT (V1.0)
--  Description: This script populates the database with realistic
--               sample businesses to test the application.
--  Author: Gemini AI
--  Version: 1.0
-- =================================================================

-- NOTE: This script assumes you have already run `database_setup.sql` (V5.2)
-- It uses the categories and tags created in that script.

DO $$
DECLARE
    -- Category IDs
    automotive_cat_id BIGINT;
    restaurants_cat_id BIGINT;
    shopping_cat_id BIGINT;
    home_services_cat_id BIGINT;
    beauty_cat_id BIGINT;
    health_cat_id BIGINT;

    -- Business IDs
    business_1_id BIGINT;
    business_2_id BIGINT;
    business_3_id BIGINT;
    business_4_id BIGINT;
    business_5_id BIGINT;
    business_6_id BIGINT;
    business_7_id BIGINT;
    business_8_id BIGINT;
    business_9_id BIGINT;
    business_10_id BIGINT;
    business_11_id BIGINT;
    business_12_id BIGINT;
    business_13_id BIGINT;
    business_14_id BIGINT;
    business_15_id BIGINT;

    -- Tag IDs
    tag_auto_repair_id BIGINT;
    tag_tires_id BIGINT;
    tag_oil_change_id BIGINT;
    tag_car_wash_id BIGINT;
    tag_pizza_id BIGINT;
    tag_italian_id BIGINT;
    tag_fast_food_id BIGINT;
    tag_burgers_id BIGINT;
    tag_sandwiches_id BIGINT;
    tag_plumbing_id BIGINT;
    tag_electrician_id BIGINT;
    tag_handyman_id BIGINT;
    tag_hvac_id BIGINT;
    tag_hair_salon_id BIGINT;
    tag_nail_salon_id BIGINT;
    tag_barber_id BIGINT;
    tag_dentist_id BIGINT;
    tag_pharmacy_id BIGINT;
    tag_electronics_id BIGINT;
    tag_fashion_id BIGINT;
    tag_doctors_id BIGINT;
    tag_medical_center_id BIGINT;

BEGIN
    -- Step 1: Get Category IDs
    SELECT id INTO automotive_cat_id FROM categories WHERE name = 'Automotive';
    SELECT id INTO restaurants_cat_id FROM categories WHERE name = 'Restaurants';
    SELECT id INTO shopping_cat_id FROM categories WHERE name = 'Shopping';
    SELECT id INTO home_services_cat_id FROM categories WHERE name = 'Home Services';
    SELECT id INTO beauty_cat_id FROM categories WHERE name = 'Beauty & Spas';
    SELECT id INTO health_cat_id FROM categories WHERE name = 'Health & Medical';

    -- Step 2: Get Tag IDs
    SELECT id INTO tag_auto_repair_id FROM tags WHERE name = 'Auto Repair';
    SELECT id INTO tag_tires_id FROM tags WHERE name = 'Tires';
    SELECT id INTO tag_oil_change_id FROM tags WHERE name = 'Oil Change Stations';
    SELECT id INTO tag_car_wash_id FROM tags WHERE name = 'Car Wash';
    SELECT id INTO tag_pizza_id FROM tags WHERE name = 'Pizza';
    SELECT id INTO tag_italian_id FROM tags WHERE name = 'Italian';
    SELECT id INTO tag_fast_food_id FROM tags WHERE name = 'Fast Food';
    SELECT id INTO tag_burgers_id FROM tags WHERE name = 'Burgers';
    SELECT id INTO tag_sandwiches_id FROM tags WHERE name = 'Sandwiches';
    SELECT id INTO tag_plumbing_id FROM tags WHERE name = 'Plumbing';
    SELECT id INTO tag_electrician_id FROM tags WHERE name = 'Electricians';
    SELECT id INTO tag_handyman_id FROM tags WHERE name = 'Handyman';
    SELECT id INTO tag_hvac_id FROM tags WHERE name = 'Heating & Air Conditioning/HVAC';
    SELECT id INTO tag_hair_salon_id FROM tags WHERE name = 'Hair Salons';
    SELECT id INTO tag_nail_salon_id FROM tags WHERE name = 'Nail Salons';
    SELECT id INTO tag_barber_id FROM tags WHERE name = 'Barbers';
    SELECT id INTO tag_dentist_id FROM tags WHERE name = 'Dentists';
    SELECT id INTO tag_pharmacy_id FROM tags WHERE name = 'Drugstores'; -- Note: Yelp uses 'Drugstores' for Pharmacies
    SELECT id INTO tag_electronics_id FROM tags WHERE name = 'Electronics';
    SELECT id INTO tag_fashion_id FROM tags WHERE name = 'Fashion';
    SELECT id INTO tag_doctors_id FROM tags WHERE name = 'Doctors';
    SELECT id INTO tag_medical_center_id FROM tags WHERE name = 'Medical Centers';

    -- Step 3: Insert Sample Businesses
    
    -- Business 1 (Automotive)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, featured, images)
    VALUES ('Modern Auto Care', 'مودرن أوتو كير', 'Your one-stop shop for all car needs. We provide top-quality service.', 'New Cairo', automotive_cat_id, '01234567890', 4.5, true, '["/sample-images/auto1.jpg"]')
    RETURNING id INTO business_1_id;

    -- Business 2 (Restaurant)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, images)
    VALUES ('Pizza Palace', 'قصر البيتزا', 'Authentic Italian pizza made with fresh ingredients.', 'El Shorouk', restaurants_cat_id, '01122334455', 4.8, '["/sample-images/pizza1.jpg"]')
    RETURNING id INTO business_2_id;

    -- Business 3 (Home Services)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, featured, images)
    VALUES ('Cairo Plumbers', 'سباكين القاهرة', 'Fast and reliable plumbing services, 24/7.', 'Madinaty', home_services_cat_id, '01098765432', 4.2, true, '["/sample-images/plumber1.jpg"]')
    RETURNING id INTO business_3_id;
    
    -- Business 4 (Beauty)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, images)
    VALUES ('Glamour Hair Studio', 'ستوديو جلامور للشعر', 'Chic and modern hair salon for men and women.', 'New Cairo', beauty_cat_id, '01212121212', 4.9, '["/sample-images/hair1.jpg"]')
    RETURNING id INTO business_4_id;
    
    -- Business 5 (Restaurant)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, images)
    VALUES ('Burger Hub', 'برجر هاب', 'The juiciest burgers in town. A must-try!', 'New Cairo', restaurants_cat_id, '01555667788', 4.6, '["/sample-images/burger1.jpg"]')
    RETURNING id INTO business_5_id;

    -- Business 6 (Shopping)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, images)
    VALUES ('Tech World', 'عالم التكنولوجيا', 'Latest electronics and gadgets at the best prices.', 'Madinaty', shopping_cat_id, '01110002223', 4.4, '["/sample-images/tech1.jpg"]')
    RETURNING id INTO business_6_id;

    -- Business 7 (Automotive)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, images)
    VALUES ('Speedy Car Wash', 'غسيل سيارات سبيدي', 'Get your car sparkling clean in minutes.', 'El Shorouk', automotive_cat_id, '01001001001', 4.7, '["/sample-images/carwash1.jpg"]')
    RETURNING id INTO business_7_id;

    -- Business 8 (Health)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, featured, images)
    VALUES ('Bright Smile Dental', 'برايت سمايل للأسنان', 'Comprehensive dental care with a gentle touch.', 'Madinaty', health_cat_id, '01011223344', 4.9, true, '["/sample-images/dental1.jpg"]')
    RETURNING id INTO business_8_id;

    -- Business 9 (Health)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, images)
    VALUES ('City Pharmacy', 'صيدلية المدينة', 'Your friendly neighborhood pharmacy, open 24/7.', 'New Cairo', health_cat_id, '01288776655', 4.6, '["/sample-images/pharmacy1.jpg"]')
    RETURNING id INTO business_9_id;

    -- Business 10 (Restaurant)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, images)
    VALUES ('The Sandwich Shop', 'ذا ساندويتش شوب', 'Gourmet sandwiches and fresh salads.', 'El Shorouk', restaurants_cat_id, '01155443322', 4.5, '["/sample-images/sandwich1.jpg"]')
    RETURNING id INTO business_10_id;

    -- Business 11 (Home Services)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, featured, images)
    VALUES ('Pro-Elec Electrical Services', 'برو-إليك للخدمات الكهربائية', 'Certified electricians for residential and commercial needs.', 'New Cairo', home_services_cat_id, '01066554433', 4.8, true, '["/sample-images/electrician1.jpg"]')
    RETURNING id INTO business_11_id;

    -- Business 12 (Health)
    INSERT INTO businesses(name, name_ar, description, area, category_id, phone, rating, images)
    VALUES ('New Cairo Medical Center', 'مركز القاهرة الجديدة الطبي', 'General practice doctors and specialists available.', 'New Cairo', health_cat_id, '01231231231', 4.7, '["/sample-images/medicalcenter1.jpg"]')
    RETURNING id INTO business_12_id;

    -- ... Add more businesses as needed

    -- Step 4: Link Businesses to Tags
    
    -- Modern Auto Care Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_1_id, tag_auto_repair_id),
    (business_1_id, tag_tires_id),
    (business_1_id, tag_oil_change_id);

    -- Pizza Palace Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_2_id, tag_pizza_id),
    (business_2_id, tag_italian_id),
    (business_2_id, tag_fast_food_id);

    -- Cairo Plumbers Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_3_id, tag_plumbing_id),
    (business_3_id, tag_handyman_id);
    
    -- Glamour Hair Studio Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_4_id, tag_hair_salon_id),
    (business_4_id, tag_barber_id);
    
    -- Burger Hub Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_5_id, tag_burgers_id),
    (business_5_id, tag_sandwiches_id),
    (business_5_id, tag_fast_food_id);

    -- Tech World Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_6_id, tag_electronics_id);

    -- Speedy Car Wash Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_7_id, tag_car_wash_id);

    -- Bright Smile Dental Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_8_id, tag_dentist_id);

    -- City Pharmacy Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_9_id, tag_pharmacy_id);

    -- The Sandwich Shop Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_10_id, tag_sandwiches_id),
    (business_10_id, tag_fast_food_id);

    -- Pro-Elec Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_11_id, tag_electrician_id),
    (business_11_id, tag_handyman_id);

    -- New Cairo Medical Center Tags
    INSERT INTO business_tags (business_id, tag_id) VALUES
    (business_12_id, tag_doctors_id),
    (business_12_id, tag_medical_center_id);

END $$; 