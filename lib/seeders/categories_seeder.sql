-- DALILI Categories Seeder
-- Professional Business Directory Categories for Egypt & Middle East
-- Based on Yelp's proven structure with cultural adaptations

-- First, clear existing data
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- Insert Primary Categories (20 main categories)
INSERT INTO categories (name_en, name_ar, icon_svg, color, created_at, updated_at) VALUES

-- 1. Active Life & Sports
('Active Life & Sports', 'الحياة النشطة والرياضة', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>', '#FF6B6B', NOW(), NOW()),

-- 2. Arts & Entertainment  
('Arts & Entertainment', 'الفنون والترفيه', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>', '#4ECDC4', NOW(), NOW()),

-- 3. Automotive
('Automotive', 'السيارات', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>', '#45B7D1', NOW(), NOW()),

-- 4. Beauty & Spas
('Beauty & Spas', 'الجمال والسبا', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 18.5L8.5 16 12 13.5 15.5 16 12 18.5z"/></svg>', '#F39C12', NOW(), NOW()),

-- 5. Education
('Education', 'التعليم', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>', '#8E44AD', NOW(), NOW()),

-- 6. Event Planning & Services
('Event Planning & Services', 'تخطيط الفعاليات والخدمات', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>', '#E74C3C', NOW(), NOW()),

-- 7. Financial Services
('Financial Services', 'الخدمات المالية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>', '#27AE60', NOW(), NOW()),

-- 8. Food & Restaurants
('Food & Restaurants', 'الطعام والمطاعم', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>', '#E67E22', NOW(), NOW()),

-- 9. Health & Medical
('Health & Medical', 'الصحة والطب', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>', '#E74C3C', NOW(), NOW()),

-- 10. Home Services
('Home Services', 'خدمات المنزل', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>', '#3498DB', NOW(), NOW()),

-- 11. Hotels & Travel
('Hotels & Travel', 'الفنادق والسفر', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H9.5v-7h-8v7h8.5v7h1v-7H19V7z"/></svg>', '#9B59B6', NOW(), NOW()),

-- 12. Local Services
('Local Services', 'الخدمات المحلية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>', '#1ABC9C', NOW(), NOW()),

-- 13. Mass Media
('Mass Media', 'وسائل الإعلام', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>', '#34495E', NOW(), NOW()),

-- 14. Nightlife
('Nightlife', 'الحياة الليلية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3V1h6v2c3.31 0 6 2.69 6 6v4h-6v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4H5V9c0-3.31 2.69-6 6-6z"/></svg>', '#2C3E50', NOW(), NOW()),

-- 15. Pets
('Pets', 'الحيوانات الأليفة', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 9.5C3.12 9.5 2 8.38 2 7s1.12-2.5 2.5-2.5S7 5.62 7 7s-1.12 2.5-2.5 2.5zM9 5.5c-1.38 0-2.5-1.12-2.5-2.5S7.62.5 9 .5s2.5 1.12 2.5 2.5S10.38 5.5 9 5.5zm6 0C13.62 5.5 12.5 4.38 12.5 3S13.62.5 15 .5s2.5 1.12 2.5 2.5S16.38 5.5 15 5.5zm4.5 4c-1.38 0-2.5-1.12-2.5-2.5S18.12 4.5 19.5 4.5 22 5.62 22 7s-1.12 2.5-2.5 2.5zM17.34 14.07c-.39-.39-1.02-.39-1.41 0l-1.06 1.06-1.06-1.06c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l1.06 1.06-1.06 1.06c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l1.06-1.06 1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06 1.06-1.06c.39-.39.39-1.02 0-1.41z"/></svg>', '#F39C12', NOW(), NOW()),

-- 16. Professional Services
('Professional Services', 'الخدمات المهنية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/></svg>', '#16A085', NOW(), NOW()),

-- 17. Public Services & Government
('Public Services & Government', 'الخدمات العامة والحكومة', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>', '#7F8C8D', NOW(), NOW()),

-- 18. Real Estate
('Real Estate', 'العقارات', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 3 3-3v6l3-3v8h-6v-4h-4v4H5v-8l3 3V2l3 3z"/></svg>', '#2980B9', NOW(), NOW()),

-- 19. Religious Organizations
('Religious Organizations', 'المنظمات الدينية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 12.22V9l-5-2.5V5c0-.55-.45-1-1-1s-1 .45-1 1v1.5L6 9v3.22L2 14v8h20v-8l-4-1.78zM12 13L8 11.5 12 10l4 1.5L12 13z"/></svg>', '#8E44AD', NOW(), NOW()),

-- 20. Shopping
('Shopping', 'التسوق', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>', '#E67E22', NOW(), NOW());

-- Insert Subcategories for Food & Restaurants (most detailed for demonstration)
INSERT INTO categories (name_en, name_ar, parent_id, icon_svg, color, created_at, updated_at) VALUES

-- Egyptian Cuisine (parent_id will be 8 - Food & Restaurants)
('Egyptian Cuisine', 'المأكولات المصرية', 8, '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1z"/></svg>', '#C0392B', NOW(), NOW()),
('Traditional Egyptian Restaurants', 'المطاعم المصرية التقليدية', (SELECT id FROM categories WHERE name_en = 'Egyptian Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05z"/></svg>', '#C0392B', NOW(), NOW()),
('Koshari Shops', 'محلات الكشري', (SELECT id FROM categories WHERE name_en = 'Egyptian Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05z"/></svg>', '#C0392B', NOW(), NOW()),
('Ful & Ta''meya Vendors', 'بائعي الفول والطعمية', (SELECT id FROM categories WHERE name_en = 'Egyptian Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05z"/></svg>', '#C0392B', NOW(), NOW()),
('Mahshi Restaurants', 'مطاعم المحشي', (SELECT id FROM categories WHERE name_en = 'Egyptian Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05z"/></svg>', '#C0392B', NOW(), NOW()),

-- Middle Eastern Cuisine
('Middle Eastern Cuisine', 'المأكولات الشرق أوسطية', 8, '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18z"/></svg>', '#D35400', NOW(), NOW()),
('Lebanese Restaurants', 'المطاعم اللبنانية', (SELECT id FROM categories WHERE name_en = 'Middle Eastern Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18z"/></svg>', '#D35400', NOW(), NOW()),
('Syrian Restaurants', 'المطاعم السورية', (SELECT id FROM categories WHERE name_en = 'Middle Eastern Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18z"/></svg>', '#D35400', NOW(), NOW()),
('Jordanian Restaurants', 'المطاعم الأردنية', (SELECT id FROM categories WHERE name_en = 'Middle Eastern Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18z"/></svg>', '#D35400', NOW(), NOW()),
('Palestinian Restaurants', 'المطاعم الفلسطينية', (SELECT id FROM categories WHERE name_en = 'Middle Eastern Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18z"/></svg>', '#D35400', NOW(), NOW()),

-- International Cuisine
('International Cuisine', 'المأكولات العالمية', 8, '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/></svg>', '#27AE60', NOW(), NOW()),
('Italian Restaurants', 'المطاعم الإيطالية', (SELECT id FROM categories WHERE name_en = 'International Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/></svg>', '#27AE60', NOW(), NOW()),
('Chinese Restaurants', 'المطاعم الصينية', (SELECT id FROM categories WHERE name_en = 'International Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/></svg>', '#27AE60', NOW(), NOW()),
('Indian Restaurants', 'المطاعم الهندية', (SELECT id FROM categories WHERE name_en = 'International Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/></svg>', '#27AE60', NOW(), NOW()),
('American Fast Food', 'الوجبات السريعة الأمريكية', (SELECT id FROM categories WHERE name_en = 'International Cuisine'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/></svg>', '#27AE60', NOW(), NOW()),

-- Specialty Food
('Specialty Food', 'الأطعمة المتخصصة', 8, '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97z"/></svg>', '#F39C12', NOW(), NOW()),
('Seafood Restaurants', 'مطاعم المأكولات البحرية', (SELECT id FROM categories WHERE name_en = 'Specialty Food'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97z"/></svg>', '#F39C12', NOW(), NOW()),
('Grilled Meat (Mashawi)', 'المشاوي', (SELECT id FROM categories WHERE name_en = 'Specialty Food'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97z"/></svg>', '#F39C12', NOW(), NOW()),
('Dessert Shops', 'محلات الحلويات', (SELECT id FROM categories WHERE name_en = 'Specialty Food'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97z"/></svg>', '#F39C12', NOW(), NOW()),
('Juice Bars', 'بارات العصير', (SELECT id FROM categories WHERE name_en = 'Specialty Food'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97z"/></svg>', '#F39C12', NOW(), NOW()),

-- Coffee & Tea
('Coffee & Tea', 'القهوة والشاي', 8, '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z"/></svg>', '#8B4513', NOW(), NOW()),
('Traditional Ahwa (Coffee Houses)', 'الأهاوي التقليدية', (SELECT id FROM categories WHERE name_en = 'Coffee & Tea'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2z"/></svg>', '#8B4513', NOW(), NOW()),
('Modern Cafés', 'الكافيهات الحديثة', (SELECT id FROM categories WHERE name_en = 'Coffee & Tea'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2z"/></svg>', '#8B4513', NOW(), NOW()),
('Tea Houses', 'بيوت الشاي', (SELECT id FROM categories WHERE name_en = 'Coffee & Tea'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2z"/></svg>', '#8B4513', NOW(), NOW()),
('Shisha Cafés', 'كافيهات الشيشة', (SELECT id FROM categories WHERE name_en = 'Coffee & Tea'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2z"/></svg>', '#8B4513', NOW(), NOW()),

-- Add some Health & Medical subcategories
('Hospitals', 'المستشفيات', 9, '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/></svg>', '#E74C3C', NOW(), NOW()),
('Public Hospitals', 'المستشفيات العامة', (SELECT id FROM categories WHERE name_en = 'Hospitals'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/></svg>', '#E74C3C', NOW(), NOW()),
('Private Hospitals', 'المستشفيات الخاصة', (SELECT id FROM categories WHERE name_en = 'Hospitals'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/></svg>', '#E74C3C', NOW(), NOW()),
('Specialized Hospitals', 'المستشفيات المتخصصة', (SELECT id FROM categories WHERE name_en = 'Hospitals'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/></svg>', '#E74C3C', NOW(), NOW()),
('Emergency Services', 'خدمات الطوارئ', (SELECT id FROM categories WHERE name_en = 'Hospitals'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/></svg>', '#E74C3C', NOW(), NOW()),

-- Add some Shopping subcategories
('Shopping Centers', 'مراكز التسوق', 20, '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>', '#E67E22', NOW(), NOW()),
('Malls', 'المولات', (SELECT id FROM categories WHERE name_en = 'Shopping Centers'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>', '#E67E22', NOW(), NOW()),
('Bazaars', 'البازارات', (SELECT id FROM categories WHERE name_en = 'Shopping Centers'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>', '#E67E22', NOW(), NOW()),
('Traditional Markets (Souks)', 'الأسواق التقليدية', (SELECT id FROM categories WHERE name_en = 'Shopping Centers'), '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>', '#E67E22', NOW(), NOW());

-- Display success message
SELECT 'DALILI Categories Successfully Seeded! 🎉' AS message,
       COUNT(*) AS total_categories
FROM categories; 