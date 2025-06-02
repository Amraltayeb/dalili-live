import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Businesses() {
  const [businesses, setBusinesses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [error, setError] = useState(null)
  const [supabase, setSupabase] = useState(null)

  const areas = [
    'New Cairo',
    'New Administrative Capital',
    'El Shorouk City',
    'Badr City',
    'New Heliopolis',
    'Rehab City',
    'Madinaty'
  ]

  useEffect(() => {
    initializeSupabase()
  }, [])

  const initializeSupabase = async () => {
    try {
      const supabaseModule = await import('../lib/supabase')
      setSupabase(supabaseModule.supabase)
      fetchData()
    } catch (error) {
      console.error('Error initializing Supabase:', error)
      setError('Database connection error')
      setLoading(false)
    }
  }

  const fetchData = async () => {
    if (!supabase) return
    
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order')

      setCategories(categoriesData || [])

      // Fetch businesses
      const { data: businessesData } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      setBusinesses(businessesData || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  // Filter businesses based on search and filters
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || business.category === selectedCategory
    const matchesArea = selectedArea === '' || business.area === selectedArea

    return matchesSearch && matchesCategory && matchesArea
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading businesses...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏢 Dalili Business Directory
          </h1>
          <p className="text-gray-600">Discover trusted businesses in New Cairo and surrounding areas</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search businesses, services, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">All Areas</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBusinesses.length} of {businesses.length} businesses
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {categories.map(category => {
            const categoryCount = businesses.filter(b => b.category === category.name).length
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedCategory === category.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{categoryCount} businesses</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Businesses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map(business => (
            <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{business.name}</h3>
                  <span className="text-lg">{business.price_range}</span>
                </div>
                
                {business.name_ar && (
                  <div className="text-gray-600 mb-2 text-right">{business.name_ar}</div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {business.category}
                  </span>
                  {business.subcategory && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {business.subcategory}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{business.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    <span>{business.area}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📞</span>
                    <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                      {business.phone}
                    </a>
                  </div>

                  {business.whatsapp && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">💬</span>
                      <a 
                        href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        WhatsApp
                      </a>
                    </div>
                  )}

                  {business.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">✉️</span>
                      <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                        {business.email}
                      </a>
                    </div>
                  )}

                  {business.working_hours?.general && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">🕒</span>
                      <span>{business.working_hours.general}</span>
                    </div>
                  )}

                  {business.services_offered && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">🔧</span>
                      <span>{business.services_offered}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(business.social_links?.instagram || business.social_links?.facebook || business.social_links?.website) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      {business.social_links?.instagram && (
                        <a 
                          href={business.social_links.instagram.startsWith('http') ? business.social_links.instagram : `https://instagram.com/${business.social_links.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700"
                        >
                          📷 Instagram
                        </a>
                      )}
                      {business.social_links?.facebook && (
                        <a 
                          href={business.social_links.facebook.startsWith('http') ? business.social_links.facebook : `https://facebook.com/${business.social_links.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          📘 Facebook
                        </a>
                      )}
                      {business.social_links?.website && (
                        <a 
                          href={business.social_links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-700"
                        >
                          🌐 Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">No businesses found</div>
            <div className="text-gray-400">Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">🏢 Dalili - Your trusted business directory for New Cairo</p>
            <p className="text-sm">Want to add your business? <a href="/admin" className="text-blue-600 hover:underline">Contact us</a></p>
          </div>
        </div>
      </div>
    </div>
  )
} 