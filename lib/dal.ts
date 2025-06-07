// =================================================================
//  DATA ACCESS LAYER (DAL)
// =================================================================
//  Description: This file centralizes all database access logic for
//               the Dalili application. It uses the Supabase client
//               to query the database and abstracts the data-fetching
//               details from the UI components.
//  Author: Gemini AI
// =================================================================

import { createClient } from '@supabase/supabase-js';
import { Business, Category } from './types'; // Import centralized types
import { unstable_noStore as noStore } from 'next/cache';

// Initialize the Supabase client
// Ensure these environment variables are set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches all active categories along with their associated tags (subcategories).
 * This query now joins through `category_tags` to get all tags for each category.
 * @returns {Promise<Category[]>} A promise that resolves to an array of categories.
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      name_ar,
      icon,
      color,
      status,
      sort_order,
      created_at,
      tags:category_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq('status', 'active')
    .order('sort_order');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Could not fetch categories.');
  }

  // The data needs to be reshaped to match the Category type
  const reshapedData = data?.map(category => ({
    ...category,
    tags: category.tags.map((tagObj: any) => tagObj.tags).filter(Boolean) // Extract the nested tag object
  })) || [];

  return reshapedData;
}

/**
 * Interface for the getBusinesses function options.
 */
interface GetBusinessesOptions {
  featured?: boolean;
  categoryName?: string;
  searchQuery?: string;
  location?: string;
}

/**
 * Fetches businesses from the database with flexible filtering.
 * It can filter by featured status, category, search query, and location.
 * The query joins categories and tags to provide full details for each business.
 * @param {GetBusinessesOptions} options - The filtering options.
 * @returns {Promise<Business[]>} A promise that resolves to an array of businesses.
 */
export async function getBusinesses(options: GetBusinessesOptions = {}): Promise<Business[]> {
  let query = supabase
    .from('businesses')
    .select(`
      *,
      categories (
        name,
        name_ar,
        icon,
        color
      ),
      tags (
        id,
        name
      )
    `)
    .eq('status', 'active');

  if (options.featured) {
    query = query.eq('featured', true);
  }

  if (options.categoryName) {
    // We filter based on the name of the joined category
    query = query.eq('categories.name', options.categoryName);
  }
  
  if (options.searchQuery && options.searchQuery.trim() !== '') {
    // Use our 'search_businesses' RPC function for complex searches
    // This is more efficient than client-side filtering
    return searchBusinesses(options.searchQuery, options.location || '');
  }

  if (options.location) {
    query = query.ilike('area', `%${options.location}%`);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching businesses:', error);
    throw new Error('Could not fetch businesses.');
  }

  return data as Business[];
}

/**
 * Fetches a single category by its name, including its associated tags.
 * @param {string} name - The name of the category to fetch.
 * @returns {Promise<Category | null>} A promise that resolves to the category or null if not found.
 */
export async function getCategoryByName(name: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .select(`
            id,
            name,
            name_ar,
            icon,
            color,
            status,
            sort_order,
            created_at,
            tags:category_tags (
                tags (
                    id,
                    name
                )
            )
        `)
        .eq('name', name)
        .single();

    if (error) {
        console.error(`Error fetching category ${name}:`, error);
        return null;
    }
    
    if (!data) {
      return null;
    }

    // Reshape the data to match the Category type, similar to getCategories
    const reshapedData = {
      ...data,
      tags: data.tags.map((tagObj: any) => tagObj.tags).filter(Boolean)
    };

    return reshapedData;
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
  noStore();
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq('featured', true)
      .limit(6);

    if (error) {
      console.error('Error fetching featured businesses:', error);
      throw new Error('Could not fetch featured businesses.');
    }

    return data as Business[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch featured businesses.');
  }
}

export async function searchBusinesses(query: string, location: string): Promise<Business[]> {
  noStore();
  try {
    let businessQuery = supabase
      .from('businesses')
      .select(
        `
        *,
        categories (
          name
        )
      `
      );

    if (query) {
      // Using 'or' to search in name, description, and tags.
      // Note: This is a simplified search. For full-text search, a dedicated Postgres function (RPC) would be better.
      businessQuery = businessQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (location) {
      businessQuery = businessQuery.ilike('area', `%${location}%`);
    }

    const { data, error } = await businessQuery.limit(20);

    if (error) {
      console.error('Error searching businesses:', error);
      throw new Error('Could not search for businesses.');
    }

    return data as Business[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to search for businesses.');
  }
} 