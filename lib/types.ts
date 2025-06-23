// =================================================================
//  CENTRALIZED TYPE DEFINITIONS
// =================================================================
//  Description: This file contains the core TypeScript interfaces
//               used across the Dalili application, ensuring
//               consistency and type safety.
//  Author: Gemini AI
// =================================================================

/**
 * Represents the full structure of a main category, including the
 * tags that are associated with it (acting as subcategories).
 */
export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  icon_svg: string | null;
  color: string | null;
  created_at: string;
}

/**
 * Represents the nested category object returned by Supabase when
 * a business is fetched with its category information joined.
 */
export interface BusinessCategory {
  name: string;
  name_ar: string;
  icon: string | null;
  color: string | null;
}

/**
 * Business Hours structure for operating times
 */
export interface BusinessHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

/**
 * Social Media Links structure
 */
export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

/**
 * Business Features/Amenities
 */
export interface BusinessFeatures {
  wifi?: boolean;
  parking?: boolean;
  delivery?: boolean;
  takeout?: boolean;
  reservations?: boolean;
  wheelchair_accessible?: boolean;
  outdoor_seating?: boolean;
  accepts_cards?: boolean;
  cash_only?: boolean;
}

/**
 * Represents the full structure of a business listing, matching
 * the 'businesses' table and the data returned from `getBusinesses`.
 * Enhanced with Yelp-like features.
 */
export interface Business {
  id: string;
  name: string;
  description: string | null;
  
  // Contact Information
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website_url: string | null;
  
  // Location & Address
  address: string | null;
  area_id: string | null;
  latitude: number | null;
  longitude: number | null;
  
  // Visual Assets
  logo_url: string | null;
  cover_url: string | null;
  gallery_images: string[] | null; // JSON array of image URLs
  
  // Business Details
  price_range: number | null; // 1-4 scale ($ to $$$$)
  business_hours: BusinessHours | null; // JSON object
  social_media: SocialMedia | null; // JSON object
  features: BusinessFeatures | null; // JSON object
  timezone: string | null; // e.g., 'Africa/Cairo'
  
  // Ratings & Reviews
  average_rating: number | null;
  total_reviews: number | null;
  
  // Status & Timestamps
  status: string; // 'active', 'pending', 'suspended', 'closed'
  verified: boolean | null;
  created_at: string;
  updated_at: string;
  
  // Extended fields for display (computed)
  categories?: BusinessCategory | null;
  rating?: number; // For backward compatibility
  images?: string[]; // For backward compatibility
}

/**
 * Review system for businesses
 */
export interface Review {
  id: string;
  business_id: string;
  user_name: string;
  user_email?: string;
  rating: number; // 1-5 stars
  title: string | null;
  content: string;
  photos: string[] | null; // Renamed from images
  helpful_count: number | null;
  created_at: string;
  updated_at: string;
  users: {
    name: string;
    avatar_url?: string | null;
  } | null;
}

/**
 * Represents a successful database connection test result.
 */
export interface SuccessTestResult {
  status: 'ok';
  count: number | null;
}

/**
 * Represents a failed database connection test result.
 */
export interface ErrorTestResult {
  status: 'error';
  message: string;
}

/**
 * Area/Location information
 */
export interface Area {
  id: string;
  name_en: string;
  name_ar: string;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

/**
 * Business creation form data (subset of Business)
 */
export interface BusinessFormData {
  name: string;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  area_id: string | null;
  latitude: number | null;
  longitude: number | null;
  price_range: number | null;
  logo_url: string | null;
  cover_url: string | null;
  gallery_images: string[] | null;
  business_hours: BusinessHours | null;
  social_media: SocialMedia | null;
  features: BusinessFeatures | null;
  status: string;
}

/**
 * Categorization keywords for admin management
 */
export interface CategorizationKeyword {
  id: string;
  category_id: string;
  keyword: string;
  region: string; // 'global', 'egypt', 'usa', 'uk', etc.
  priority: number; // Higher = more important/specific
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  // Extended fields for display
  category?: Category;
}

/**
 * Admin settings for system configuration
 */
export interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: 'string' | 'boolean' | 'number' | 'json';
  description: string | null;
  is_public: boolean;
  updated_at: string;
  updated_by: string | null;
}

/**
 * Keyword form data for creating/editing
 */
export interface KeywordFormData {
  category_id: string;
  keyword: string;
  region: string;
  priority: number;
  is_active: boolean;
  created_by?: string;
}

/**
 * Regions supported by the system
 */
export interface SupportedRegion {
  code: string;
  name: string;
  flag: string;
  example_keywords: string[];
} 