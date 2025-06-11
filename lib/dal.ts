// =================================================================
//  DATA ACCESS LAYER (DAL) - MVP VERSION
// =================================================================
//  Description: Centralized database access logic for Dalili MVP.
//  Only supports the new schema: areas, categories, businesses,
//  business_category, users. No tags, ratings, or extra fields.
// =================================================================

import { createClient } from '@supabase/supabase-js';
import { Business, Category, Area } from './types';

// Check environment variables and provide detailed logging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables missing:', {
    NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseKey,
    NODE_ENV: process.env.NODE_ENV,
    environment: typeof window === 'undefined' ? 'server' : 'client'
  });
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

// ===================== AREAS =====================

export async function getAreas(): Promise<Area[]> {
  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .order('name_en');
    
    if (error) {
      console.error('getAreas error:', error);
      throw new Error(`Could not fetch areas: ${error.message}`);
    }
    
    return data as Area[];
  } catch (error) {
    console.error('getAreas caught error:', error);
    throw error;
  }
}

export async function createArea(area: Omit<Area, 'id' | 'created_at'>): Promise<Area> {
  const { data, error } = await supabase
    .from('areas')
    .insert([area])
    .select()
    .single();
  if (error) throw new Error('Could not create area.');
  return data as Area;
}

export async function updateArea(id: string, updates: Partial<Area>): Promise<Area> {
  const { data, error } = await supabase
    .from('areas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error('Could not update area.');
  return data as Area;
}

export async function deleteArea(id: string): Promise<void> {
  const { error } = await supabase
    .from('areas')
    .delete()
    .eq('id', id);
  if (error) throw new Error('Could not delete area.');
}

// ===================== CATEGORIES =====================

export async function getCategories(): Promise<Category[]> {
  try {
    console.log('getCategories: Starting fetch from Supabase...');
    console.log('getCategories: Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      isServer: typeof window === 'undefined'
    });
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_en');
    
    if (error) {
      console.error('getCategories: Supabase error:', error);
      throw new Error(`Could not fetch categories: ${error.message}`);
    }
    
    console.log(`getCategories: Successfully fetched ${data?.length || 0} categories`);
    return data as Category[];
  } catch (error) {
    console.error('getCategories: Caught error:', error);
    // Instead of throwing, return empty array to prevent page crash
    return [];
  }
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();
  if (error) throw new Error('Could not create category.');
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error('Could not update category.');
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw new Error('Could not delete category.');
}

// ===================== BUSINESSES =====================

export async function getBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('name');
  if (error) throw new Error('Could not fetch businesses.');
  return data as Business[];
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Business;
}

export async function createBusiness(business: Omit<Business, 'id' | 'created_at' | 'updated_at'>): Promise<Business> {
  const { data, error } = await supabase
    .from('businesses')
    .insert([business])
    .select()
    .single();
  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error('Could not create business.');
  }
  return data as Business;
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error('Could not update business.');
  return data as Business;
}

export async function deleteBusiness(id: string): Promise<void> {
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);
  if (error) throw new Error('Could not delete business.');
}

// ===================== BUSINESS-CATEGORY RELATIONSHIP =====================

export async function addBusinessCategory(business_id: string, category_id: string): Promise<void> {
  const { error } = await supabase
    .from('business_category')
    .insert([{ business_id, category_id }]);
  if (error) throw new Error('Could not link business to category.');
}

export async function removeBusinessCategory(business_id: string, category_id: string): Promise<void> {
  const { error } = await supabase
    .from('business_category')
    .delete()
    .eq('business_id', business_id)
    .eq('category_id', category_id);
  if (error) throw new Error('Could not unlink business from category.');
}

// ===================== SEARCH =====================

export async function searchBusinesses(query: string): Promise<Business[]> {
  // Simple full-text search on name and description
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('status', 'active');
  if (error) throw new Error('Could not search businesses.');
  return data as Business[];
}

// ===================== FEATURED BUSINESSES =====================

export async function getFeaturedBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      business_category!inner(
        categories!inner(
          name_en,
          name_ar,
          icon_svg,
          color
        )
      )
    `)
    .eq('status', 'active')
    .limit(6);
  
  if (error) {
    console.error('Error fetching featured businesses:', error);
    return [];
  }
  
  // Transform the data to match our Business interface
  return data.map(business => ({
    ...business,
    categories: business.business_category[0]?.categories || null,
    rating: 4.2 + Math.random() * 0.8, // Mock rating for now
    images: business.cover_url ? [business.cover_url] : []
  })) as Business[];
}

// ===================== ENHANCED SEARCH (YELP-STYLE) =====================

export async function searchBusinessesByCategory(categoryName: string, locationFilter?: string): Promise<Business[]> {
  let query = supabase
    .from('businesses')
    .select(`
      *,
      business_category!inner(
        categories!inner(
          name_en,
          name_ar,
          icon_svg,
          color
        )
      )
    `)
    .eq('status', 'active')
    .eq('business_category.categories.name_en', categoryName);
  
  if (locationFilter) {
    query = query.ilike('address', `%${locationFilter}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error searching by category:', error);
    return [];
  }
  
  return data.map(business => ({
    ...business,
    categories: business.business_category[0]?.categories || null,
    rating: business.average_rating || 4.2 + Math.random() * 0.8,
    images: business.cover_url ? [business.cover_url] : []
  })) as Business[];
}

export async function searchBusinessesAdvanced(
  query?: string, 
  categoryName?: string, 
  locationFilter?: string
): Promise<Business[]> {
  // If we have a category filter, use inner join, otherwise use left join
  const businessCategoryJoin = categoryName ? 'business_category!inner' : 'business_category';
  const categoriesJoin = categoryName ? 'categories!inner' : 'categories';

  let dbQuery = supabase
    .from('businesses')
    .select(`
      *,
      ${businessCategoryJoin}(
        ${categoriesJoin}(
          name_en,
          name_ar,
          icon_svg,
          color
        )
      )
    `)
    .eq('status', 'active');
  
  // Category filter - use database-level filtering when possible
  if (categoryName) {
    dbQuery = dbQuery.eq('business_category.categories.name_en', categoryName);
  }
  
  // Text search in business name and description
  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }
  
  // Location filter
  if (locationFilter) {
    dbQuery = dbQuery.ilike('address', `%${locationFilter}%`);
  }

  const { data: allBusinesses, error } = await dbQuery;
  
  if (error) {
    console.error('Error in advanced search:', error);
    return [];
  }

  let businesses = allBusinesses || [];

  return businesses.map(business => ({
    ...business,
    categories: business.business_category?.[0]?.categories || null,
    rating: business.average_rating || 4.2 + Math.random() * 0.8,
    images: business.cover_url ? [business.cover_url] : []
  })) as Business[];
}

// Function to assign businesses to categories (essential!)
export async function assignBusinessToCategory(businessId: string, categoryId: string): Promise<void> {
  const { error } = await supabase
    .from('business_category')
    .insert([{ business_id: businessId, category_id: categoryId }])
    .select();
  
  if (error && !error.message.includes('duplicate key')) {
    throw new Error(`Could not assign business to category: ${error.message}`);
  }
}

// ===================== ENHANCED SEARCH FUNCTIONS =====================

export async function searchBusinessesByCategoryEnhanced(categoryName: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      areas (
        id,
        name_en,
        name_ar,
        city,
        latitude,
        longitude
      ),
      business_category!inner (
        categories!inner (
          id,
          name_en,
          name_ar,
          icon_svg,
          color
        )
      )
    `)
    .eq('status', 'active')
    .eq('business_category.categories.name_en', categoryName)
    .order('average_rating', { ascending: false });

  if (error) {
    console.error('Error searching businesses by category:', error);
    throw error;
  }

  return data?.map(business => ({
    ...business,
    area: business.areas,
    categories: business.business_category?.[0]?.categories || null,
    rating: business.average_rating || 4.2 + Math.random() * 0.8,
    images: business.cover_url ? [business.cover_url] : []
  })) || [];
}

export async function searchBusinessesByLocation(locationName: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      areas (
        id,
        name_en,
        name_ar,
        city,
        latitude,
        longitude
      ),
      business_category (
        categories (
          id,
          name_en,
          name_ar,
          icon_svg,
          color
        )
      )
    `)
    .eq('status', 'active')
    .or(`areas.name_en.ilike.%${locationName}%,areas.name_ar.ilike.%${locationName}%,areas.city.ilike.%${locationName}%`)
    .order('average_rating', { ascending: false });

  if (error) {
    console.error('Error searching businesses by location:', error);
    throw error;
  }

  return data?.map(business => ({
    ...business,
    area: business.areas,
    categories: business.business_category?.[0]?.categories || null,
    rating: business.average_rating || 4.2 + Math.random() * 0.8,
    images: business.cover_url ? [business.cover_url] : []
  })) || [];
}

export async function getBusinessesByArea(areaId: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      areas (
        id,
        name_en,
        name_ar,
        city,
        latitude,
        longitude
      ),
      business_category (
        categories (
          id,
          name_en,
          name_ar,
          icon_svg,
          color
        )
      )
    `)
    .eq('area_id', areaId)
    .eq('status', 'active')
    .order('average_rating', { ascending: false });

  if (error) {
    console.error('Error getting businesses by area:', error);
    throw error;
  }

  return data?.map(business => ({
    ...business,
    area: business.areas,
    categories: business.business_category?.[0]?.categories || null,
    rating: business.average_rating || 4.2 + Math.random() * 0.8,
    images: business.cover_url ? [business.cover_url] : []
  })) || [];
}

export async function getBusinessesByCity(cityName: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      areas!inner (
        id,
        name_en,
        name_ar,
        city,
        latitude,
        longitude
      ),
      business_category (
        categories (
          id,
          name_en,
          name_ar,
          icon_svg,
          color
        )
      )
    `)
    .eq('areas.city', cityName)
    .eq('status', 'active')
    .order('average_rating', { ascending: false });

  if (error) {
    console.error('Error getting businesses by city:', error);
    throw error;
  }

  return data?.map(business => ({
    ...business,
    area: business.areas,
    categories: business.business_category?.[0]?.categories || null,
    rating: business.average_rating || 4.2 + Math.random() * 0.8,
    images: business.cover_url ? [business.cover_url] : []
  })) || [];
}

// ===================== CATEGORY MANAGEMENT =====================

export async function assignBusinessToCategories(businessId: string, categoryIds: string[]): Promise<void> {
  // First, remove existing category assignments
  const { error: deleteError } = await supabase
    .from('business_category')
    .delete()
    .eq('business_id', businessId);

  if (deleteError) {
    console.error('Error removing existing category assignments:', deleteError);
    throw deleteError;
  }

  // Then, add new category assignments
  if (categoryIds.length > 0) {
    const assignments = categoryIds.map(categoryId => ({
      business_id: businessId,
      category_id: categoryId
    }));

    const { error: insertError } = await supabase
      .from('business_category')
      .insert(assignments);

    if (insertError) {
      console.error('Error assigning business to categories:', insertError);
      throw insertError;
    }
  }
}

export async function autoAssignBusinessToCategory(businessId: string): Promise<void> {
  // Get business details
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('name, description')
    .eq('id', businessId)
    .single();

  if (businessError || !business) {
    console.error('Error getting business for auto-assignment:', businessError);
    return;
  }

  // Get all categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*');

  if (categoriesError || !categories) {
    console.error('Error getting categories for auto-assignment:', categoriesError);
    return;
  }

  const businessText = `${business.name} ${business.description}`.toLowerCase();
  
  // Import Egyptian categories for keyword matching
  const { BUSINESS_CATEGORIES } = await import('./egyptian-data');
  
  // Find matching categories based on keywords
  const matchingCategories: string[] = [];
  
  for (const category of categories) {
    const egyptianCategory = BUSINESS_CATEGORIES.find(ec => ec.name_en === category.name_en);
    if (egyptianCategory) {
      const hasKeywordMatch = egyptianCategory.keywords.some(keyword => 
        businessText.includes(keyword.toLowerCase())
      );
      
      if (hasKeywordMatch) {
        matchingCategories.push(category.id);
      }
    }
  }

  // If no keyword matches found, try name-based matching
  if (matchingCategories.length === 0) {
    for (const category of categories) {
      if (businessText.includes(category.name_en.toLowerCase())) {
        matchingCategories.push(category.id);
        break; // Only assign to one category if no keyword matches
      }
    }
  }

  // Assign to matching categories
  if (matchingCategories.length > 0) {
    await assignBusinessToCategories(businessId, matchingCategories);
  }
}

// ===================== STATISTICS =====================

export async function getBusinessStatsByCategory(): Promise<any[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      business_category (
        businesses (
          id,
          status
        )
      )
    `);

  if (error) {
    console.error('Error getting business stats by category:', error);
    throw error;
  }

  return data?.map(category => ({
    ...category,
    business_count: category.business_category?.filter((bc: any) => 
      bc.businesses?.status === 'active'
    ).length || 0
  })) || [];
}

export async function getBusinessStatsByLocation(): Promise<any[]> {
  const { data, error } = await supabase
    .from('areas')
    .select(`
      *,
      businesses (
        id,
        status
      )
    `);

  if (error) {
    console.error('Error getting business stats by location:', error);
    throw error;
  }

  return data?.map(area => ({
    ...area,
    business_count: area.businesses?.filter((b: any) => b.status === 'active').length || 0
  })) || [];
} 