-- DALILI Categories Seeder
-- Professional Business Directory Categories for Egypt & Middle East

TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

INSERT INTO categories (name_en, name_ar, icon_svg, color, created_at, updated_at) VALUES

-- Primary Categories
('Active Life & Sports', 'الحياة النشطة والرياضة', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>', '#FF6B6B', NOW(), NOW()),
('Arts & Entertainment', 'الفنون والترفيه', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>', '#4ECDC4', NOW(), NOW()),
('Automotive', 'السيارات', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg>', '#45B7D1', NOW(), NOW()),
('Beauty & Spas', 'الجمال والسبا', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 18.5L8.5 16 12 13.5 15.5 16 12 18.5z"/></svg>', '#F39C12', NOW(), NOW()),
('Education', 'التعليم', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>', '#8E44AD', NOW(), NOW()),
('Event Planning & Services', 'تخطيط الفعاليات والخدمات', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>', '#E74C3C', NOW(), NOW()),
('Financial Services', 'الخدمات المالية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13z"/></svg>', '#27AE60', NOW(), NOW()),
('Food & Restaurants', 'الطعام والمطاعم', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12z"/></svg>', '#E67E22', NOW(), NOW()),
('Health & Medical', 'الصحة والطب', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/></svg>', '#E74C3C', NOW(), NOW()),
('Home Services', 'خدمات المنزل', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>', '#3498DB', NOW(), NOW()),
('Hotels & Travel', 'الفنادق والسفر', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H9.5v-7h-8v7h8.5v7h1v-7H19V7z"/></svg>', '#9B59B6', NOW(), NOW()),
('Local Services', 'الخدمات المحلية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5z"/></svg>', '#1ABC9C', NOW(), NOW()),
('Mass Media', 'وسائل الإعلام', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2z"/></svg>', '#34495E', NOW(), NOW()),
('Nightlife', 'الحياة الليلية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3V1h6v2c3.31 0 6 2.69 6 6v4h-6v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4H5V9c0-3.31 2.69-6 6-6z"/></svg>', '#2C3E50', NOW(), NOW()),
('Pets', 'الحيوانات الأليفة', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 9.5C3.12 9.5 2 8.38 2 7s1.12-2.5 2.5-2.5S7 5.62 7 7s-1.12 2.5-2.5 2.5z"/></svg>', '#F39C12', NOW(), NOW()),
('Professional Services', 'الخدمات المهنية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2z"/></svg>', '#16A085', NOW(), NOW()),
('Public Services & Government', 'الخدمات العامة والحكومة', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>', '#7F8C8D', NOW(), NOW()),
('Real Estate', 'العقارات', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 3 3-3v6l3-3v8h-6v-4h-4v4H5v-8l3 3V2l3 3z"/></svg>', '#2980B9', NOW(), NOW()),
('Religious Organizations', 'المنظمات الدينية', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 12.22V9l-5-2.5V5c0-.55-.45-1-1-1s-1 .45-1 1v1.5L6 9v3.22L2 14v8h20v-8z"/></svg>', '#8E44AD', NOW(), NOW()),
('Shopping', 'التسوق', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2z"/></svg>', '#E67E22', NOW(), NOW());

SELECT 'Categories seeded successfully!' as message; 