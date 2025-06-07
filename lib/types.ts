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
  id: number;
  name: string;
  name_ar: string | null;
  icon: string | null;
  color: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  tags: { id: number; name: string }[] | null; // Tags acting as subcategories
}

/**
 * Represents the nested category object returned by Supabase when
 * a business is fetched with its category information joined.
 */
export interface BusinessCategory {
  name: string;
  name_ar: string | null;
  icon: string | null;
  color: string | null;
}

/**
 * Represents the full structure of a business listing, matching
 * the 'businesses' table and the data returned from `getBusinesses`.
 */
export interface Business {
  id: number;
  created_at: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  area: string | null;
  address: string | null;
  category_id: number | null;
  // Note: subcategory field is obsolete and replaced by tags
  services_offered: any | null; // Using 'any' for now, can be a specific type
  price_range: string | null;
  working_hours: { day: string; hours: string }[] | null;
  images: string[] | null;
  social_links: any | null; // Using 'any' for now, can be a specific type
  custom_data: any | null; // Flexible field for other data
  status: string;
  featured: boolean;
  verified: boolean;
  rating: number | null;
  categories: BusinessCategory; // Joined category data
  tags: { id: number; name: string }[] | null; // NEW: To hold business-specific tags
} 