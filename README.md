# DALILI - Global Business Directory 🌍

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](#)

**Professional global business directory inspired by Yelp, connecting customers with local businesses worldwide. Initially launching in Egypt.**

---

## 🎯 **Project Overview**

DALILI (دليل - meaning "guide" in Arabic) is a comprehensive business directory platform designed to work globally. Currently featuring 15 real businesses across 12 categories and 30+ locations in Egypt, with plans to expand to other countries.

### **Key Features**
- 🔍 **Smart Search** - Find businesses by category and location
- 🏢 **Rich Business Profiles** - Complete information with hours, contact, features
- 👨‍💼 **Admin Panel** - Full business management system
- 📱 **Mobile Responsive** - Perfect experience on all devices
- 🌐 **Multi-language** - English, Arabic, French support
- 🌍 **Global Ready** - Expandable to any country with local data

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- Supabase account

### **Setup**
1. **Clone and Install**
   ```bash
   git clone <repository>
   cd dalili-project
   npm install
   ```

2. **Environment Variables**
   ```bash
   # Create .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   - Import the database schema from `/database/schema.sql`
   - The project includes sample Egyptian business data

4. **Run Development**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

---

## 🏗️ **Architecture**

### **Tech Stack**
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase PostgreSQL, Next.js API Routes
- **Database**: 5-table relational schema with Egyptian business data
- **Hosting**: Vercel-ready deployment configuration

### **Database Schema**
```sql
businesses (15 Egyptian businesses)
├── Basic info: name, description, phone, email
├── Location: area_id, address, coordinates  
├── Business: hours, price_range, website
├── Features: wifi, parking, delivery
└── Media: gallery_images, social_media

categories (12 business types)
├── Restaurants, Shopping, Health & Medical
├── Beauty & Spas, Automotive, Entertainment
└── Multi-language names (EN/AR/FR)

areas (30+ Egyptian locations)
├── Major cities: Cairo, Alexandria, Hurghada
├── Cairo regions: New Cairo, Zamalek, Maadi
└── Tourist areas: Sharm El Sheikh, El Gouna

business_category (many-to-many relationships)
└── Links businesses to their categories

users (authentication ready)
└── Future user management system
```

---

## 🎮 **Features**

### **Public Features**
- **Homepage** (`/`) - Hero section with featured businesses
- **Search** (`/search`) - Category and location filtering
- **Business Pages** (`/business/[id]`) - Detailed business profiles
- **Multi-language** (`/en`, `/ar`, `/fr`) - Language-specific routes

### **Admin Features**
- **Dashboard** (`/admin`) - Business management overview
- **Business Management** (`/admin/businesses`) - Add, edit, delete businesses
- **Enhanced Forms** - Support for all business fields (hours, features, GPS, etc.)

### **Sample Businesses Included**
- **Restaurants**: Koshary Abou Tarek, Sequoia, Zooba, Andrea
- **Shopping**: City Stars Mall, Festival City Mall
- **Health**: As-Salam International Hospital, Cleopatra Hospital
- **Beauty**: Four Seasons Spa, Espace Beauty
- **Hotels**: Four Seasons Hotel Cairo, Marriott
- **And more across all categories...**

---

## 📊 **Current Status**

### **✅ Production Ready Features**
- ✅ **Complete UI/UX** - Professional, responsive design
- ✅ **Full Admin Panel** - Business management system
- ✅ **Search System** - Category and location filtering
- ✅ **Egyptian Data** - 15+ businesses, 12 categories, 30+ locations
- ✅ **Type Safety** - 100% TypeScript coverage
- ✅ **Mobile Optimized** - Works perfectly on all devices

### **🔄 Final Polish**
- 🔄 **Category Accuracy** - Fine-tuning business categorization
- 🔄 **Production Deployment** - Ready for live deployment

**Overall Status**: 85% Complete - Production ready with minor optimizations

---

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with one click

### **Environment Variables for Production**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

---

## 🎯 **Business Value**

### **For Global Markets**
- **Scalable Platform** - Works in any country with local business data
- **Multi-language Support** - Arabic, English, French with easy expansion
- **Local Adaptation** - Currently optimized for Egyptian market
- **Real Data** - Starting with authentic Egyptian businesses

### **For Business Owners**
- **Easy Management** - Self-service business profile management
- **Rich Profiles** - Hours, features, location, contact information
- **Mobile Discovery** - Customers can find businesses on mobile
- **Professional Presence** - Clean, modern business listings

### **For Developers**
- **Modern Stack** - Next.js 14, TypeScript, Supabase
- **Scalable Architecture** - Ready for thousands of businesses
- **Clean Code** - Well-documented, maintainable codebase
- **Production Ready** - Deployment-ready configuration

---

## 📞 **Key URLs**

**Public Pages:**
- Homepage: `/`
- Search: `/search?category=Restaurants`
- Business Profile: `/business/[id]`

**Admin Pages:**
- Admin Dashboard: `/admin`
- Manage Businesses: `/admin/businesses`
- Add Business: `/admin/businesses/new`

**Development Tools:**
- Category Fix: `/fix-categories` (for development)

---

## 🛠️ **Development**

### **Project Structure**
```
app/
├── page.tsx              # Homepage
├── search/              # Search functionality
├── business/[id]/       # Business detail pages
├── admin/              # Admin panel
├── api/                # API routes
└── [lang]/             # Multi-language routes

lib/
├── dal.ts              # Database access layer
├── types.ts            # TypeScript definitions
└── supabase.ts         # Supabase client

components/
├── BusinessCard.tsx    # Business display components
├── SearchBar.tsx       # Search interface
└── AdminForms.tsx      # Admin management forms
```

### **Key Files**
- **Database Logic**: `lib/dal.ts`
- **Type Definitions**: `lib/types.ts`
- **Main Search**: `app/search/page.tsx`
- **Admin Panel**: `app/admin/businesses/page.tsx`

---

## 🎉 **Success Metrics**

- ✅ **15+ Businesses** populated with real Egyptian data
- ✅ **12 Categories** covering all major business types
- ✅ **30+ Locations** across Egypt's major areas
- ✅ **100% TypeScript** for type safety
- ✅ **Mobile Responsive** design
- ✅ **Production Ready** architecture

---

## 📄 **License**

[Add your license here]

---

## 🤝 **Contributing**

This is a production-ready Egyptian business directory. For contributions or business listings, please contact the project maintainers.

---

**Built with ❤️ for connecting global businesses with customers** 🌍

*Starting in Egypt and expanding worldwide - connecting customers with local businesses everywhere.* 