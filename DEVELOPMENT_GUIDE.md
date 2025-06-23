# DALILI DEVELOPMENT GUIDE
## Review-Powered Business Directory for Egypt

**Strategy:** Solo Developer MVP → Community-Driven Growth  
**Focus:** Egyptian Market with Cultural Intelligence  
**Core Value:** Authentic Reviews Drive Discovery

---

## 🎯 **DEVELOPMENT PHILOSOPHY**

### **MVP-First Approach**
**Build the minimum viable product that delivers maximum value**

**Core Principle:** Reviews + User Submissions = Competitive Advantage
- Without reviews: Just another directory (boring)
- With reviews: Community-powered discovery platform (valuable)

### **Cultural Intelligence First**
- Built FOR Egyptians BY someone who understands the market
- Arabic-first, not English-translated
- Neighborhood-based navigation (not GPS coordinates)
- Local business patterns and cultural context

---

## 🚀 **TECHNICAL ARCHITECTURE**

### **Stack Overview**
```
Frontend: Next.js 14 + TypeScript + Tailwind CSS
Backend: Supabase (PostgreSQL + Auth + Storage)
Deployment: Vercel
File Storage: Supabase Storage
```

### **Core Data Flow**
```
User Registration → Business Submission → Admin Approval → Reviews → Discovery
```

### **Database Schema (Updated)**
```sql
-- Core Tables for MVP
users (id, name, email, phone, review_count, created_at)
categories (id, name_en, name_ar, icon_svg, color, parent_id)
businesses (id, name_en, name_ar, category_id, area, phone, address, status, user_id, average_rating, review_count)
reviews (id, business_id, user_id, rating, title, content, photos, is_verified, helpful_count)
keywords (id, keyword_en, keyword_ar, category_id, confidence)
```

---

## 🛠️ **FEATURE IMPLEMENTATION GUIDE**

### **Phase 1: MVP Core Features**

#### **1. User Authentication & Profiles**
**Status:** ✅ Complete
```typescript
// User profile includes:
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  review_count: number;
  average_given_rating: number;
  is_verified: boolean;
  created_at: string;
}
```

#### **2. Business Submission System**
**Status:** 🔄 In Development
```typescript
// Business submission flow:
interface BusinessSubmission {
  name_en: string;
  name_ar: string;
  category_id: number;
  area: string;
  phone: string;
  address_en: string;
  address_ar: string;
  description_en?: string;
  description_ar?: string;
  price_range: 1 | 2 | 3; // $, $$, $$$
  user_id: string; // Who submitted it
  status: 'pending' | 'approved' | 'rejected';
}
```

**Implementation Steps:**
1. Create submission form with validation
2. Admin approval workflow
3. Business owner notification system
4. Duplicate detection

#### **3. Review System with Photos**
**Status:** 🔄 In Development
```typescript
// Review system includes:
interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  content: string;
  photos: string[]; // URLs to uploaded images
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
}
```

**Implementation Steps:**
1. Star rating component
2. Text review with rich editor
3. Photo upload with compression
4. Review moderation system
5. Helpful/unhelpful voting

#### **4. Enhanced Search & Discovery**
**Status:** 🔄 In Development
```typescript
// Search functionality:
interface SearchOptions {
  query?: string;
  category_id?: number;
  area?: string;
  price_range?: number[];
  rating_min?: number;
  sort_by: 'relevance' | 'rating' | 'review_count' | 'newest';
}
```

**Search Algorithm:**
1. Text matching (business name, category)
2. Area filtering (neighborhood-based)
3. Rating sorting (highest rated first)
4. Review count weighting
5. Relevance scoring

---

## 🇪🇬 **EGYPTIAN MARKET LOCALIZATION**

### **Area-Based Navigation**
```typescript
// Egyptian cities and areas
const egyptianAreas = {
  cairo: {
    name_ar: 'القاهرة',
    districts: ['Zamalek', 'Maadi', 'Heliopolis', 'Downtown', 'New Cairo', 'Nasr City']
  },
  giza: {
    name_ar: 'الجيزة', 
    districts: ['Dokki', 'Mohandessin', '6th October', 'Sheikh Zayed', 'Haram']
  },
  alexandria: {
    name_ar: 'الإسكندرية',
    districts: ['Stanley', 'Sidi Gaber', 'Smouha', 'Gleem', 'Miami']
  }
};
```

### **Cultural Business Categories**
```typescript
// Egyptian-specific categories
const egyptianCategories = {
  food: {
    traditional: ['Koshari', 'Ful & Ta\'meya', 'Mahshi', 'Traditional Egyptian'],
    beverages: ['Ahwa (Coffee Houses)', 'Juice Bars', 'Tea Houses', 'Shisha Cafés'],
    meat: ['Grilled Meat (Mashawi)', 'Kebab & Kofta', 'Chicken Restaurants']
  },
  services: {
    beauty: ['Men\'s Barber Shops', 'Women\'s Salons', 'Hammam', 'Henna Artists'],
    repair: ['Mobile Repair', 'Appliance Repair', 'Car Services', 'Home Repairs']
  }
};
```

### **Language Support Implementation**
```typescript
// Bilingual search terms
const searchTermMapping = {
  'restaurant': ['مطعم', 'restaurant', 'مطاعم'],
  'hospital': ['مستشفى', 'hospital', 'مستشفيات'],
  'pharmacy': ['صيدلية', 'pharmacy', 'صيدليات'],
  'bank': ['بنك', 'bank', 'بنوك'],
  'school': ['مدرسة', 'school', 'مدارس'],
  'mosque': ['مسجد', 'mosque', 'مساجد']
};
```

---

## 📱 **USER EXPERIENCE DESIGN**

### **Mobile-First Design**
```css
/* Responsive design approach */
.container {
  @apply px-4 md:px-6 lg:px-8;
  @apply max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl;
  @apply mx-auto;
}

/* Arabic text support */
.arabic-text {
  @apply font-arabic text-right;
  font-family: 'Noto Sans Arabic', sans-serif;
}
```

### **Search Interface**
```typescript
// Search component with Egyptian UX
const SearchInterface = {
  placeholder_en: "Search businesses...",
  placeholder_ar: "ابحث عن الأعمال...",
  filters: {
    area: "المنطقة",
    category: "الفئة", 
    rating: "التقييم",
    price: "السعر"
  },
  sorting: {
    relevance: "الأكثر صلة",
    rating: "الأعلى تقييماً",
    newest: "الأحدث"
  }
};
```

---

## 🔄 **DEVELOPMENT WORKFLOW**

### **Daily Development Process**
1. **Morning Planning** (30 mins)
   - Review GitHub issues
   - Prioritize features based on MVP goals
   - Set daily objectives

2. **Development Blocks** (4-6 hours)
   - Focus on one feature at a time
   - Write tests for critical functionality
   - Document API changes

3. **Testing & Review** (1 hour)
   - Manual testing on mobile and desktop
   - Check Arabic text rendering
   - Verify Supabase queries

### **Quality Assurance**
```bash
# Development commands
npm run dev          # Local development
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Code linting
npm run type-check   # TypeScript checking
```

### **Database Management**
```sql
-- Reset and seed for testing
npm run db:reset
psql -h localhost -U postgres -d dalili -f lib/seed_categories.sql
```

---

## 📊 **PERFORMANCE OPTIMIZATION**

### **Image Handling**
```typescript
// Photo upload optimization
const photoUpload = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  compression: 0.8,
  maxDimensions: { width: 1920, height: 1080 }
};
```

### **Database Optimization**
```sql
-- Essential indexes for performance
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_area ON businesses(area);
CREATE INDEX idx_businesses_rating ON businesses(average_rating DESC);
CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
```

### **Caching Strategy**
```typescript
// Supabase query optimization
const getBusinesses = async (options: SearchOptions) => {
  return supabase
    .from('businesses')
    .select(`
      *,
      categories(name_en, name_ar, icon_svg, color),
      reviews(rating, content, created_at)
    `)
    .eq('status', 'approved')
    .order('average_rating', { ascending: false })
    .limit(20);
};
```

---

## 🚀 **DEPLOYMENT & MONITORING**

### **Environment Setup**
```bash
# Environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=your_domain
```

### **Deployment Pipeline**
1. **Development**: Local testing with hot reload
2. **Staging**: Preview deployments on Vercel
3. **Production**: Automated deployment from main branch

### **Monitoring Tools**
- **Analytics**: Basic usage tracking
- **Error Monitoring**: Console errors and crashes
- **Performance**: Page load times and Core Web Vitals
- **User Feedback**: In-app feedback system

---

## 🎯 **SUCCESS METRICS**

### **Technical KPIs**
- Page load time: < 2 seconds
- Mobile performance score: > 90
- Uptime: > 99.5%
- Database query time: < 100ms

### **User Experience KPIs**
- User registration completion: > 80%
- Business submission success: > 95%
- Review submission rate: > 15% of users
- Search result relevance: > 85% user satisfaction

### **Business KPIs**
- Monthly active users growth: 20%
- Business listings growth: 50 new/month
- Review growth: 100 new/month
- User retention: > 60% after 30 days

---

## 📝 **CODING STANDARDS**

### **TypeScript Guidelines**
```typescript
// Strict typing for all interfaces
interface Business {
  id: string;
  name_en: string;
  name_ar: string;
  category: Category;
  reviews: Review[];
  average_rating: number;
  created_at: string;
}

// Use enums for constants
enum BusinessStatus {
  PENDING = 'pending',
  APPROVED = 'approved', 
  REJECTED = 'rejected'
}
```

### **Component Structure**
```typescript
// Component naming and organization
components/
  ui/            # Reusable UI components
  business/      # Business-related components
  reviews/       # Review system components
  search/        # Search and filtering
  admin/         # Admin dashboard components
```

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues**
1. **Arabic Text Display**: Ensure proper font loading and RTL support
2. **Supabase Timeout**: Optimize queries and add proper indexing
3. **Image Upload**: Check file size limits and compression settings
4. **Mobile Performance**: Lazy load images and components

### **Debug Commands**
```bash
# Check database connection
npm run db:check

# Verify environment variables
npm run env:check

# Test API endpoints
npm run test:api
```

---

**Development Principle: Every feature should serve the core mission of helping Egyptians discover the best local businesses through authentic community reviews.** 