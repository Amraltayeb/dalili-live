import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [businesses, setBusinesses] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'active')
        .order('sort_order')

      // Fetch businesses with category info
      const { data: businessesData } = await supabase
        .from('businesses')
        .select(`
          *,
          categories (
            name,
            icon,
            color
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      setCategories(categoriesData || [])
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
                         business.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || business.category === selectedCategory
    const matchesArea = selectedArea === '' || business.area === selectedArea
    
    return matchesSearch && matchesCategory && matchesArea
  })

  // Get unique areas for filter
  const areas = [...new Set(businesses.map(b => b.area))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <div className="text-xl text-gray-600">Loading Dalili...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏢</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dalili</h1>
                <p className="text-sm text-gray-600">Business Directory</p>
              </div>
            </div>
            <Link href="/admin">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                ➕ Add Business
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Trusted Businesses
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Find the best services in New Cairo, El Shorouk, and Madinaty
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search businesses, services, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Areas</option>
              {areas.map(area => (
                <option key={area} value={area}>📍 {area}</option>
              ))}
            </select>

            {(selectedCategory || selectedArea || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedArea('')
                  setSearchTerm('')
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-2xl font-bold text-gray-900">{businesses.length}</div>
            <div className="text-gray-600">Total Businesses</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">📱</div>
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">📍</div>
            <div className="text-2xl font-bold text-gray-900">{areas.length}</div>
            <div className="text-gray-600">Areas Covered</div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {searchTerm || selectedCategory || selectedArea 
              ? `Search Results (${filteredBusinesses.length})` 
              : `All Businesses (${filteredBusinesses.length})`
            }
          </h3>
          <div className="text-gray-600">
            {searchTerm && <span>Searching for "{searchTerm}"</span>}
            {selectedCategory && <span> in {selectedCategory}</span>}
            {selectedArea && <span> in {selectedArea}</span>}
          </div>
        </div>

        {/* Business Grid */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(business => (
              <Link key={business.id} href={`/business/${business.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  {/* Business Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-1">
                          {business.name}
                        </h4>
                        {business.name_ar && (
                          <p className="text-gray-600 text-sm mb-2">{business.name_ar}</p>
                        )}
                      </div>
                      <div className="text-2xl ml-3">
                        {business.categories?.icon || '🏢'}
                      </div>
                    </div>

                    {/* Category & Area */}
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {business.category}
                      </span>
                      <span className="text-gray-600">📍 {business.area}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {business.description}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      {business.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📞</span>
                          <span>{business.phone}</span>
                        </div>
                      )}
                      
                      {business.price_range && (
                        <div className="flex items-center gap-2 text-sm">
                          <span>💰</span>
                          <span className="text-green-600 font-medium">{business.price_range}</span>
                        </div>
                      )}

                      {/* Working Hours Indicator */}
                      {business.working_hours && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <span>🕐</span>
                          <span>Hours available</span>
                        </div>
                      )}
                    </div>

                    {/* Rating placeholder */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex text-yellow-400">
                        {'⭐'.repeat(Math.floor(business.rating || 4.5))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {business.rating || '4.5'} ({business.reviews_count || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Don't see your business listed?
          </h3>
          <p className="text-gray-600 mb-6">
            Join hundreds of local businesses and get discovered by more customers
          </p>
          <Link href="/admin">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              ➕ Add Your Business For Free
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
} 