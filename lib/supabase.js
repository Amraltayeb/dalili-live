import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions for businesses
export const getBusinesses = async (filters = {}) => {
  let query = supabase
    .from('businesses')
    .select(`
      *,
      categories (
        name,
        name_ar,
        icon,
        color
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.area) {
    query = query.eq('area', filters.area)
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const addBusiness = async (businessData) => {
  // Process the data to match our schema
  const processedData = {
    name: businessData.name,
    name_ar: businessData.name_ar || null,
    category: businessData.category,
    subcategory: businessData.subcategory || null,
    phone: businessData.phone,
    whatsapp: businessData.whatsapp || null,
    email: businessData.email || null,
    area: businessData.area,
    address: businessData.address || null,
    description: businessData.description,
    description_ar: businessData.description_ar || null,
    services_offered: businessData.services_offered || null,
    price_range: businessData.price_range || '$',
    working_hours: businessData.working_hours || null,
    images: businessData.images || [],
    social_links: businessData.social_links || {},
    custom_data: businessData.custom_data || {},
    featured: businessData.featured || false,
    verified: businessData.verified || false,
    status: 'active'
  }

  // Add category_id if available
  if (businessData.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', businessData.category)
      .single()
    
    if (categoryData) {
      processedData.category_id = categoryData.id
    }
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert([processedData])
    .select()
  
  if (error) throw error
  return data[0]
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'active')
    .order('sort_order')
  
  if (error) throw error
  return data
}

export const getBusiness = async (id) => {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      categories (
        name,
        name_ar,
        icon,
        color
      )
    `)
    .eq('id', id)
    .eq('status', 'active')
    .single()
  
  if (error) throw error
  return data
}

export const updateBusiness = async (id, updates) => {
  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteBusiness = async (id) => {
  const { data, error } = await supabase
    .from('businesses')
    .update({ status: 'inactive' })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

// Business statistics
export const getBusinessStats = async () => {
  const { data, error } = await supabase
    .from('businesses')
    .select('category, status')
  
  if (error) throw error
  
  const stats = {
    total: data.length,
    active: data.filter(b => b.status === 'active').length,
    pending: data.filter(b => b.status === 'pending').length,
    by_category: {}
  }
  
  data.forEach(business => {
    if (!stats.by_category[business.category]) {
      stats.by_category[business.category] = 0
    }
    stats.by_category[business.category]++
  })
  
  return stats
} 