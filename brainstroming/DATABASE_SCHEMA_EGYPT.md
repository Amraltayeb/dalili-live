# 🗃️ DALILI DATABASE SCHEMA - EGYPT SERVICE PROVIDER PLATFORM
*Complete Database Design for Service Provider Management*

---

## 📊 DATABASE OVERVIEW

**Database Type:** PostgreSQL (via Supabase)
**Geographic Focus:** Egypt (New Cairo, New Administrative Capital, El Shorouk, Badr, New Heliopolis)
**Primary Use Case:** Service provider matching and job management
**Languages:** Arabic and English bilingual support

---

## 🏗️ CORE DATABASE TABLES

### 1. **USERS TABLE**
*Primary table for all platform users (customers)*

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name_arabic VARCHAR(255) NOT NULL,
    full_name_english VARCHAR(255),
    profile_photo_url TEXT,
    user_type VARCHAR(20) DEFAULT 'customer' CHECK (user_type IN ('customer', 'admin')),
    language_preference VARCHAR(5) DEFAULT 'ar' CHECK (language_preference IN ('ar', 'en')),
    address_area VARCHAR(100), -- New Cairo, New Administrative, etc.
    registration_date TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **SERVICE_PROVIDERS TABLE**
*Core table for all service providers*

```sql
CREATE TABLE service_providers (
    provider_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name_arabic VARCHAR(255) NOT NULL,
    full_name_english VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    whatsapp_number VARCHAR(20),
    profile_photo_url TEXT,
    national_id VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE,
    address_full TEXT NOT NULL,
    years_experience INTEGER DEFAULT 0,
    hourly_rate_min INTEGER, -- in EGP
    hourly_rate_max INTEGER, -- in EGP
    bio_arabic TEXT,
    bio_english TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
    verification_level INTEGER DEFAULT 1 CHECK (verification_level IN (1, 2, 3)),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_jobs_completed INTEGER DEFAULT 0,
    total_revenue_generated INTEGER DEFAULT 0, -- in EGP
    response_time_hours INTEGER DEFAULT 24,
    emergency_available BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_active TIMESTAMP DEFAULT NOW(),
    registration_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. **SERVICE_CATEGORIES TABLE**
*Master list of service categories*

```sql
CREATE TABLE service_categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name_arabic VARCHAR(100) NOT NULL,
    category_name_english VARCHAR(100) NOT NULL,
    category_slug VARCHAR(50) UNIQUE NOT NULL, -- plumbing, electrical, etc.
    description_arabic TEXT,
    description_english TEXT,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. **SERVICE_SUBCATEGORIES TABLE**
*Detailed service subcategories*

```sql
CREATE TABLE service_subcategories (
    subcategory_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(category_id) ON DELETE CASCADE,
    subcategory_name_arabic VARCHAR(150) NOT NULL,
    subcategory_name_english VARCHAR(150) NOT NULL,
    subcategory_slug VARCHAR(75) UNIQUE NOT NULL,
    description_arabic TEXT,
    description_english TEXT,
    estimated_duration_hours INTEGER, -- typical job duration
    typical_price_min INTEGER, -- typical price range in EGP
    typical_price_max INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. **PROVIDER_SERVICES TABLE**
*Services offered by each provider*

```sql
CREATE TABLE provider_services (
    service_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES service_subcategories(subcategory_id) ON DELETE CASCADE,
    skill_level VARCHAR(20) DEFAULT 'intermediate' 
        CHECK (skill_level IN ('beginner', 'intermediate', 'expert')),
    price_per_hour INTEGER, -- in EGP
    fixed_price INTEGER, -- for fixed-price services
    pricing_type VARCHAR(20) DEFAULT 'hourly' 
        CHECK (pricing_type IN ('hourly', 'fixed', 'quote')),
    service_description_arabic TEXT,
    service_description_english TEXT,
    minimum_job_hours INTEGER DEFAULT 1,
    travel_fee INTEGER DEFAULT 0, -- in EGP
    materials_included BOOLEAN DEFAULT FALSE,
    warranty_months INTEGER DEFAULT 0,
    is_emergency_service BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. **PROVIDER_COVERAGE_AREAS TABLE**
*Geographic areas each provider serves*

```sql
CREATE TABLE provider_coverage_areas (
    coverage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    area_name VARCHAR(100) NOT NULL, -- New Cairo, New Administrative, etc.
    sub_area VARCHAR(100), -- Compound or district name
    travel_fee INTEGER DEFAULT 0, -- additional fee for this area
    max_distance_km INTEGER DEFAULT 30,
    service_priority INTEGER DEFAULT 1, -- 1=primary area, 2=secondary
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 7. **PROVIDER_AVAILABILITY TABLE**
*Weekly schedule and availability*

```sql
CREATE TABLE provider_availability (
    availability_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    break_start_time TIME, -- for lunch breaks
    break_end_time TIME,
    advance_booking_hours INTEGER DEFAULT 24, -- minimum notice required
    is_emergency_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8. **PROVIDER_DOCUMENTS TABLE**
*Document verification system*

```sql
CREATE TABLE provider_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL 
        CHECK (document_type IN ('national_id', 'trade_license', 'insurance', 
                                 'certification', 'portfolio', 'reference', 'criminal_check')),
    document_url TEXT NOT NULL,
    document_name VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_notes TEXT,
    verified_by UUID, -- admin user who verified
    expiry_date DATE, -- for licenses and certifications
    upload_date TIMESTAMP DEFAULT NOW(),
    verification_date TIMESTAMP
);
```

### 9. **SERVICE_REQUESTS TABLE**
*Customer requests for services*

```sql
CREATE TABLE service_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES service_subcategories(subcategory_id),
    request_title VARCHAR(255) NOT NULL,
    request_description TEXT NOT NULL,
    preferred_date DATE,
    preferred_time_start TIME,
    preferred_time_end TIME,
    address_full TEXT NOT NULL,
    area_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    budget_min INTEGER, -- customer's budget in EGP
    budget_max INTEGER,
    urgency_level VARCHAR(20) DEFAULT 'normal' 
        CHECK (urgency_level IN ('normal', 'urgent', 'emergency')),
    additional_requirements TEXT,
    photos TEXT[], -- array of photo URLs
    request_status VARCHAR(20) DEFAULT 'open' 
        CHECK (request_status IN ('open', 'quoted', 'assigned', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 10. **SERVICE_QUOTES TABLE**
*Provider quotes for service requests*

```sql
CREATE TABLE service_quotes (
    quote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES service_requests(request_id) ON DELETE CASCADE,
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    quoted_price INTEGER NOT NULL, -- total price in EGP
    price_breakdown TEXT, -- detailed breakdown
    estimated_duration_hours INTEGER,
    materials_cost INTEGER DEFAULT 0,
    labor_cost INTEGER NOT NULL,
    travel_cost INTEGER DEFAULT 0,
    availability_date DATE,
    availability_time TIME,
    quote_description TEXT,
    quote_valid_until DATE,
    quote_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (quote_status IN ('pending', 'accepted', 'rejected', 'expired')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 11. **JOBS TABLE**
*Confirmed and ongoing jobs*

```sql
CREATE TABLE jobs (
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES service_requests(request_id),
    quote_id UUID REFERENCES service_quotes(quote_id),
    customer_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time_start TIME NOT NULL,
    scheduled_time_end TIME,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    total_amount INTEGER NOT NULL, -- in EGP
    platform_commission INTEGER, -- 15% commission
    provider_earnings INTEGER,
    payment_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'disputed', 'refunded')),
    job_status VARCHAR(20) DEFAULT 'confirmed' 
        CHECK (job_status IN ('confirmed', 'in_progress', 'completed', 'cancelled', 'disputed')),
    completion_notes TEXT,
    before_photos TEXT[], -- photos before work
    after_photos TEXT[], -- photos after completion
    materials_used TEXT,
    additional_charges INTEGER DEFAULT 0,
    additional_charges_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 12. **REVIEWS TABLE**
*Customer reviews for completed jobs*

```sql
CREATE TABLE reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(job_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
    timeliness_rating INTEGER CHECK (timeliness_rating BETWEEN 1 AND 5),
    pricing_rating INTEGER CHECK (pricing_rating BETWEEN 1 AND 5),
    professionalism_rating INTEGER CHECK (professionalism_rating BETWEEN 1 AND 5),
    review_text_arabic TEXT,
    review_text_english TEXT,
    review_photos TEXT[], -- photos of completed work
    would_recommend BOOLEAN DEFAULT TRUE,
    review_status VARCHAR(20) DEFAULT 'published' 
        CHECK (review_status IN ('pending', 'published', 'hidden', 'flagged')),
    provider_response TEXT,
    response_date TIMESTAMP,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 13. **PAYMENTS TABLE**
*Payment tracking and commission management*

```sql
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(job_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(user_id),
    provider_id UUID REFERENCES service_providers(provider_id),
    payment_method VARCHAR(50) NOT NULL, -- fawry, bank_transfer, cash, etc.
    payment_gateway VARCHAR(50), -- fawry, paymob, etc.
    gateway_transaction_id VARCHAR(255),
    total_amount INTEGER NOT NULL, -- in EGP
    platform_commission INTEGER NOT NULL,
    provider_amount INTEGER NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP,
    refund_amount INTEGER DEFAULT 0,
    refund_reason TEXT,
    commission_paid_to_provider BOOLEAN DEFAULT FALSE,
    commission_payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 14. **PROVIDER_SUBSCRIPTIONS TABLE**
*Premium subscription management*

```sql
CREATE TABLE provider_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    subscription_type VARCHAR(50) NOT NULL 
        CHECK (subscription_type IN ('premium_listing', 'verification_badge', 'emergency_services')),
    plan_price INTEGER NOT NULL, -- monthly price in EGP
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    subscription_status VARCHAR(20) DEFAULT 'active' 
        CHECK (subscription_status IN ('active', 'expired', 'cancelled', 'suspended')),
    payment_method VARCHAR(50),
    last_payment_date DATE,
    next_payment_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 15. **SEARCH_TAGS TABLE**
*SEO and search optimization*

```sql
CREATE TABLE search_tags (
    tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_name_arabic VARCHAR(100) NOT NULL,
    tag_name_english VARCHAR(100) NOT NULL,
    tag_slug VARCHAR(50) UNIQUE NOT NULL,
    tag_category VARCHAR(50), -- service type, location, skill
    search_volume INTEGER DEFAULT 0, -- estimated monthly searches
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 16. **PROVIDER_TAGS TABLE**
*Many-to-many relationship for provider search tags*

```sql
CREATE TABLE provider_tags (
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    tag_id UUID REFERENCES search_tags(tag_id) ON DELETE CASCADE,
    relevance_score INTEGER DEFAULT 1, -- how relevant this tag is (1-10)
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (provider_id, tag_id)
);
```

---

## 🔍 SEARCH AND INDEXING STRATEGY

### Primary Search Indexes
```sql
-- Geographic search optimization
CREATE INDEX idx_provider_coverage_area ON provider_coverage_areas(area_name, sub_area);
CREATE INDEX idx_service_requests_location ON service_requests(area_name, latitude, longitude);

-- Service category search
CREATE INDEX idx_provider_services_category ON provider_services(subcategory_id, skill_level);
CREATE INDEX idx_subcategories_category ON service_subcategories(category_id, is_active);

-- Rating and performance search
CREATE INDEX idx_providers_rating ON service_providers(average_rating DESC, total_jobs_completed DESC);
CREATE INDEX idx_providers_availability ON service_providers(is_active, verification_status);

-- Full-text search for Arabic and English
CREATE INDEX idx_providers_search ON service_providers 
    USING gin(to_tsvector('arabic', full_name_arabic || ' ' || bio_arabic));
CREATE INDEX idx_providers_search_en ON service_providers 
    USING gin(to_tsvector('english', full_name_english || ' ' || bio_english));
```

### Search Optimization Views
```sql
-- Provider search view with all relevant data
CREATE VIEW provider_search_view AS
SELECT 
    sp.provider_id,
    sp.full_name_arabic,
    sp.full_name_english,
    sp.average_rating,
    sp.total_jobs_completed,
    sp.verification_status,
    sp.emergency_available,
    array_agg(DISTINCT pca.area_name) as coverage_areas,
    array_agg(DISTINCT sc.category_slug) as service_categories,
    array_agg(DISTINCT ssc.subcategory_slug) as service_subcategories,
    min(ps.price_per_hour) as min_hourly_rate,
    max(ps.price_per_hour) as max_hourly_rate
FROM service_providers sp
LEFT JOIN provider_coverage_areas pca ON sp.provider_id = pca.provider_id
LEFT JOIN provider_services ps ON sp.provider_id = ps.provider_id
LEFT JOIN service_subcategories ssc ON ps.subcategory_id = ssc.subcategory_id
LEFT JOIN service_categories sc ON ssc.category_id = sc.category_id
WHERE sp.is_active = true AND sp.verification_status = 'verified'
GROUP BY sp.provider_id;
```

---

## 📱 REAL-TIME FEATURES

### Real-time Availability Updates
```sql
-- Provider availability status
CREATE TABLE provider_realtime_status (
    provider_id UUID PRIMARY KEY REFERENCES service_providers(provider_id),
    is_online BOOLEAN DEFAULT FALSE,
    current_status VARCHAR(50) DEFAULT 'available', -- available, busy, offline
    status_message VARCHAR(255),
    last_seen TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Notification System
```sql
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    provider_id UUID REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- new_quote, job_confirmed, payment_received, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50), -- job, quote, review, etc.
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    is_push_sent BOOLEAN DEFAULT FALSE,
    is_email_sent BOOLEAN DEFAULT FALSE,
    is_sms_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 ADMINISTRATIVE FUNCTIONS

### Database Maintenance Functions
```sql
-- Function to update provider ratings after new review
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE service_providers 
    SET average_rating = (
        SELECT AVG(overall_rating) 
        FROM reviews 
        WHERE provider_id = NEW.provider_id 
        AND review_status = 'published'
    )
    WHERE provider_id = NEW.provider_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_provider_rating
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_provider_rating();
```

### Analytics and Reporting Views
```sql
-- Monthly revenue analytics
CREATE VIEW monthly_revenue_analytics AS
SELECT 
    DATE_TRUNC('month', payment_date) as month,
    COUNT(*) as total_jobs,
    SUM(total_amount) as total_revenue,
    SUM(platform_commission) as platform_commission,
    SUM(provider_amount) as provider_payouts,
    AVG(total_amount) as average_job_value
FROM payments 
WHERE payment_status = 'completed'
GROUP BY DATE_TRUNC('month', payment_date)
ORDER BY month DESC;

-- Provider performance analytics
CREATE VIEW provider_performance_view AS
SELECT 
    sp.provider_id,
    sp.full_name_arabic,
    COUNT(j.job_id) as total_jobs,
    AVG(r.overall_rating) as average_rating,
    SUM(p.provider_amount) as total_earnings,
    AVG(EXTRACT(EPOCH FROM (j.actual_end_time - j.actual_start_time))/3600) as avg_job_duration_hours
FROM service_providers sp
LEFT JOIN jobs j ON sp.provider_id = j.provider_id
LEFT JOIN reviews r ON j.job_id = r.job_id
LEFT JOIN payments p ON j.job_id = p.job_id
GROUP BY sp.provider_id, sp.full_name_arabic;
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### Database Partitioning Strategy
```sql
-- Partition large tables by month for better performance
CREATE TABLE jobs_partitioned (
    LIKE jobs INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE jobs_2024_01 PARTITION OF jobs_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Caching Strategy
- **Redis Cache**: Provider search results, popular service categories
- **Application Cache**: Static data like service categories, areas
- **CDN Cache**: Profile photos, portfolio images, static assets

---

## 📊 DATA SEEDING STRATEGY

### Initial Data Requirements
1. **Service Categories**: 5 main categories (Plumbing, Electrical, Handyman, Gardening, Appliance Repair)
2. **Service Subcategories**: 50+ specific services across all categories
3. **Coverage Areas**: New Cairo, New Administrative Capital, El Shorouk, Badr, New Heliopolis
4. **Search Tags**: 200+ relevant Arabic and English search terms

### Sample Data Population
```sql
-- Insert main service categories
INSERT INTO service_categories (category_name_arabic, category_name_english, category_slug) VALUES
('السباكة', 'Plumbing', 'plumbing'),
('الكهرباء', 'Electrical', 'electrical'),
('أعمال الصيانة', 'Handyman', 'handyman'),
('البستنة', 'Gardening', 'gardening'),
('إصلاح الأجهزة', 'Appliance Repair', 'appliance-repair');
```

This database schema provides a comprehensive foundation for the DALILI service provider platform, optimized for the Egyptian market with bilingual support and all necessary features for service provider verification, job management, and payment processing. 