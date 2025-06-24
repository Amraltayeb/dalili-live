// =================================================================
//  DATA ACCESS LAYER (DAL) - MVP VERSION
// =================================================================
//  Description: Centralized database access logic for Dalili MVP.
//  Only supports the new schema: areas, categories, businesses,
//  business_category, users. No tags, ratings, or extra fields.
// =================================================================

import { createClient } from '@supabase/supabase-js';
import { Business, Category, Area, CategorizationKeyword, AdminSetting, KeywordFormData } from './types';

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

export async function getBusinessCountByCategory(categoryId: string): Promise<number> {
  const { count, error } = await supabase
    .from('business_category')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId);
  if (error) {
    console.error('Error getting business count:', error);
    return 0;
  }
  return count || 0;
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
  console.log('🔍 getBusinessById called with ID:', id);
  
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
    .eq('id', id)
    .single();

  console.log('📊 getBusinessById result:', { data, error });

  if (error) {
    console.error('❌ Database error in getBusinessById:', error);
    return null;
  }
  
  if (!data) {
    console.warn('⚠️ No business data found for ID:', id);
    return null;
  }

  // Transform the data to match the expected format
  const transformedBusiness = {
    ...data,
    area: data.areas,
    categories: data.business_category?.[0]?.categories || null,
    rating: data.average_rating || 4.2 + Math.random() * 0.8,
    images: data.cover_url ? [data.cover_url] : []
  };

  console.log('✅ Successfully found business:', transformedBusiness.name);
  return transformedBusiness as Business;
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
    .from('businesses')
    .select(`
      id,
      name,
      areas (
        name_en,
        city
      )
    `)
    .eq('status', 'active');

  if (error) {
    console.error('Error getting business stats by location:', error);
    throw error;
  }

  // Group by location
  const locationStats: { [key: string]: number } = {};
  data?.forEach(business => {
    const area = business.areas as any; // Handle Supabase join result
    const location = area?.name_en || area?.city || 'Unknown';
    locationStats[location] = (locationStats[location] || 0) + 1;
  });

  return Object.entries(locationStats).map(([location, count]) => ({
    location,
    count
  }));
}

// ===================== KEYWORD MANAGEMENT =====================

export async function getCategorizationKeywords(region?: string): Promise<CategorizationKeyword[]> {
  let query = supabase
    .from('categorization_keywords')
    .select(`
      *,
      categories (
        id,
        name_en,
        name_ar,
        icon_svg,
        color
      )
    `)
    .eq('is_active', true)
    .order('priority', { ascending: false });

  if (region) {
    query = query.eq('region', region);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error getting categorization keywords:', error);
    throw error;
  }

  return data?.map(keyword => ({
    ...keyword,
    category: keyword.categories
  })) || [];
}

export async function getKeywordsByCategory(categoryId: string, region?: string): Promise<CategorizationKeyword[]> {
  let query = supabase
    .from('categorization_keywords')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('priority', { ascending: false });

  if (region) {
    query = query.eq('region', region);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error getting keywords by category:', error);
    throw error;
  }

  return data || [];
}

export async function createKeyword(keywordData: KeywordFormData): Promise<CategorizationKeyword> {
  const { data, error } = await supabase
    .from('categorization_keywords')
    .insert([keywordData])
    .select()
    .single();

  if (error) {
    console.error('Error creating keyword:', error);
    throw error;
  }

  return data;
}

export async function updateKeyword(id: string, updates: Partial<KeywordFormData>): Promise<CategorizationKeyword> {
  const { data, error } = await supabase
    .from('categorization_keywords')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating keyword:', error);
    throw error;
  }

  return data;
}

export async function deleteKeyword(id: string): Promise<void> {
  const { error } = await supabase
    .from('categorization_keywords')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting keyword:', error);
    throw error;
  }
}

export async function toggleKeywordStatus(id: string, isActive: boolean): Promise<CategorizationKeyword> {
  const { data, error } = await supabase
    .from('categorization_keywords')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling keyword status:', error);
    throw error;
  }

  return data;
}

// ===================== ADMIN SETTINGS =====================

export async function getAdminSettings(): Promise<AdminSetting[]> {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .order('setting_key');

  if (error) {
    console.error('Error getting admin settings:', error);
    throw error;
  }

  return data || [];
}

export async function getAdminSetting(key: string): Promise<AdminSetting | null> {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('setting_key', key)
    .single();

  if (error) {
    console.error('Error getting admin setting:', error);
    return null;
  }

  return data;
}

export async function updateAdminSetting(key: string, value: string, updatedBy?: string): Promise<AdminSetting> {
  const { data, error } = await supabase
    .from('admin_settings')
    .update({
      setting_value: value,
      updated_by: updatedBy
    })
    .eq('setting_key', key)
    .select()
    .single();

  if (error) {
    console.error('Error updating admin setting:', error);
    throw error;
  }

  return data;
}

// ===================== SMART CATEGORIZATION WITH DB KEYWORDS =====================

export async function autoCategorizeBusiness(businessId: string, forceRegion?: string): Promise<void> {
  // Get business details
  const business = await getBusinessById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  // Detect region (or use forced region)
  const region = forceRegion || detectBusinessRegion(business);
  
  // Get keywords for region and global
  const keywords = await getCategorizationKeywords();
  const regionalKeywords = keywords.filter(k => k.region === region || k.region === 'global');
  
  // Find best matching category
  const businessText = `${business.name} ${business.description || ''}`.toLowerCase();
  
  let bestMatch: { category: Category; keyword: string; priority: number } | null = null;
  
  for (const keywordEntry of regionalKeywords) {
    if (businessText.includes(keywordEntry.keyword.toLowerCase())) {
      if (!bestMatch || keywordEntry.priority > bestMatch.priority) {
        const category = await supabase
          .from('categories')
          .select('*')
          .eq('id', keywordEntry.category_id)
          .single();
        
        if (category.data) {
          bestMatch = {
            category: category.data,
            keyword: keywordEntry.keyword,
            priority: keywordEntry.priority
          };
        }
      }
    }
  }
  
  if (bestMatch) {
    // Clear existing category links
    await supabase
      .from('business_category')
      .delete()
      .eq('business_id', businessId);
    
    // Add new category link
    await supabase
      .from('business_category')
      .insert({
        business_id: businessId,
        category_id: bestMatch.category.id
      });
  }
}

function detectBusinessRegion(business: Business): string {
  const text = `${business.name} ${business.description || ''} ${business.address || ''}`.toLowerCase();
  
  // Egyptian indicators
  if (text.includes('cairo') || text.includes('egypt') || text.includes('alexandria') || 
      text.includes('giza') || text.includes('koshary') || text.includes('sequoia')) {
    return 'egypt';
  }
  
  // Add other region detection logic here
  // USA indicators
  if (text.includes('usa') || text.includes('america') || text.includes('new york') || 
      text.includes('california')) {
    return 'usa';
  }
  
  // Default to global
  return 'global';
}

// ===================== BATCH OPERATIONS =====================

export async function clearAllBusinessCategories(): Promise<void> {
  const { error } = await supabase
    .from('business_category')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('Error clearing all business categories:', error);
    throw error;
  }
}

export async function autoCategorizeBatch(businessIds: string[], forceRegion?: string): Promise<{ success: number; errors: string[] }> {
  let successCount = 0;
  const errors: string[] = [];

  for (const businessId of businessIds) {
    try {
      await autoCategorizeBusiness(businessId, forceRegion);
      successCount++;
    } catch (error) {
      errors.push(`Business ${businessId}: ${error}`);
    }
  }

  return { success: successCount, errors };
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ===================== SUBMISSIONS =====================

export async function getPendingSubmissions() {
  const { data, error } = await supabase
    .from('business_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching pending submissions:", error);
    throw new Error("Could not fetch pending submissions.");
  }
  return data;
}

export async function getSubmissionById(id: string) {
  const { data, error } = await supabase
    .from('business_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching submission ${id}:`, error);
    throw new Error("Could not fetch the submission.");
  }
  return data;
}

// ===================== REVIEWS =====================

export async function getReviewsByBusinessId(businessId: string) {
    try {
        // First try with specific foreign key
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                users!user_id ( id, name, avatar_url )
            `)
            .eq('business_id', businessId)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn(`Specific foreign key failed, trying simple approach:`, error);
            
            // Fallback: get reviews without user data, then fetch users separately
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .eq('business_id', businessId)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (reviewsError) {
                console.error(`Error fetching reviews for business ${businessId}:`, reviewsError);
                return [];
            }

            // Fetch user data separately for each review
            const reviewsWithUsers = await Promise.all(
                (reviewsData || []).map(async (review) => {
                    if (review.user_id) {
                        const { data: userData } = await supabase
                            .from('users')
                            .select('id, name, avatar_url')
                            .eq('id', review.user_id)
                            .single();
                        
                        return {
                            ...review,
                            users: userData
                        };
                    }
                    return {
                        ...review,
                        users: null
                    };
                })
            );

            return reviewsWithUsers;
        }

        return data || [];
    } catch (error) {
        console.error(`Unexpected error fetching reviews for business ${businessId}:`, error);
        return [];
    }
}

// ===================== ENHANCED SEARCH WITH FILTERS =====================

export async function searchBusinessesWithFilters(params: {
  query?: string;
  location?: string;
  category?: string;
  minRating?: number;
  priceRange?: number;
  sortBy?: string;
  limit?: number;
}): Promise<Business[]> {
  const {
    query = '',
    location = '',
    category = '',
    minRating = 0,
    priceRange,
    sortBy = 'relevance',
    limit = 50
  } = params;

  try {
    let searchQuery = supabase
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
      .eq('status', 'active');

    // Apply text search filters
    if (query.trim()) {
      const searchTerm = query.trim();
      searchQuery = searchQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply location filter
    if (location.trim()) {
      searchQuery = searchQuery.ilike('address', `%${location.trim()}%`);
    }

    // Apply category filter (server-side)
    if (category) {
      searchQuery = searchQuery.eq('business_category.categories.name_en', category);
    }

    // Apply rating filter
    if (minRating > 0) {
      searchQuery = searchQuery.gte('average_rating', minRating);
    }

    // Apply price range filter
    if (priceRange) {
      searchQuery = searchQuery.eq('price_range', priceRange);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        searchQuery = searchQuery.order('average_rating', { ascending: false });
        break;
      case 'reviews':
        searchQuery = searchQuery.order('total_reviews', { ascending: false });
        break;
      case 'newest':
        searchQuery = searchQuery.order('created_at', { ascending: false });
        break;
      case 'name':
        searchQuery = searchQuery.order('name', { ascending: true });
        break;
      case 'distance':
        // For now, just order by name. Distance would require coordinates
        searchQuery = searchQuery.order('name', { ascending: true });
        break;
      default:
        // Relevance: prioritize by rating, then by name
        searchQuery = searchQuery.order('average_rating', { ascending: false })
                                 .order('name', { ascending: true });
        break;
    }

    // Apply limit
    searchQuery = searchQuery.limit(limit);

    const { data, error } = await searchQuery;

    if (error) {
      console.error('Enhanced search error:', error);
      throw error;
    }

    return data?.map(business => ({
      ...business,
      area: business.areas,
      categories: business.business_category?.[0]?.categories || null,
      rating: business.average_rating || 4.2 + Math.random() * 0.8,
      images: business.cover_url ? [business.cover_url] : []
    })) || [];

  } catch (error) {
    console.error('Enhanced search failed:', error);
    // Fallback to basic search
    return searchBusinessesAdvanced(query, category, location);
  }
}

// ===================== GET REAL-TIME BUSINESS STATS =====================

export async function getBusinessStats(): Promise<{
  totalBusinesses: number;
  totalCategories: number;
  totalReviews: number;
  averageRating: number;
}> {
  try {
    const [
      { count: businessCount },
      { count: categoryCount },
      { count: reviewCount },
      { data: ratings }
    ] = await Promise.all([
      supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('reviews').select('rating').eq('status', 'active')
    ]);

    const avgRating = ratings && ratings.length > 0 
      ? ratings.reduce((acc, review) => acc + review.rating, 0) / ratings.length 
      : 0;

    return {
      totalBusinesses: businessCount || 0,
      totalCategories: categoryCount || 0,
      totalReviews: reviewCount || 0,
      averageRating: Math.round(avgRating * 10) / 10
    };
  } catch (error) {
    console.error('Error fetching business stats:', error);
    return {
      totalBusinesses: 0,
      totalCategories: 0,
      totalReviews: 0,
      averageRating: 0
    };
  }
}

// ===================== GET TRENDING CATEGORIES =====================

export async function getTrendingCategories(limit: number = 6): Promise<(Category & { businessCount: number })[]> {
  try {
    // Get categories with business count
    const { data: categoriesWithCount, error } = await supabase.rpc('get_categories_with_business_count');

    if (error) {
      console.error('Error fetching trending categories:', error);
      // Fallback to regular categories
      const categories = await getCategories();
      return categories.slice(0, limit).map(cat => ({ ...cat, businessCount: 0 }));
    }

    return (categoriesWithCount || [])
      .sort((a: any, b: any) => b.business_count - a.business_count)
      .slice(0, limit)
      .map((cat: any) => ({
        id: cat.id,
        name_en: cat.name_en,
        name_ar: cat.name_ar,
        icon_svg: cat.icon_svg,
        color: cat.color,
        created_at: cat.created_at,
        businessCount: cat.business_count || 0
      }));
  } catch (error) {
    console.error('Error fetching trending categories:', error);
    const categories = await getCategories();
    return categories.slice(0, limit).map(cat => ({ ...cat, businessCount: 0 }));
  }
} 