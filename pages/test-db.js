import { useState, useEffect } from 'react'

export default function TestDatabase() {
  const [supabase, setSupabase] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    initializeSupabase()
  }, [])

  const initializeSupabase = async () => {
    try {
      const supabaseModule = await import('../lib/supabase')
      setSupabase(supabaseModule.supabase)
      testConnection()
    } catch (error) {
      console.error('Error initializing Supabase:', error)
      setError('Failed to initialize Supabase')
      setLoading(false)
    }
  }

  const testConnection = async () => {
    if (!supabase) return
    
    try {
      // Test categories table
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(5)

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Test businesses table
      const { data: businessesData, error: businessesError } = await supabase
        .from('businesses')
        .select('*')
        .limit(5)

      if (businessesError) throw businessesError
      setBusinesses(businessesData || [])

      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Testing database connection...</div>
  if (error) return <div className="p-8 text-red-600">Database Error: {error}</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-green-600">
        🎉 Database Connected Successfully!
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="text-sm text-gray-600">{category.name_ar}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Businesses ({businesses.length})</h2>
          <div className="space-y-2">
            {businesses.map((business) => (
              <div key={business.id} className="p-3 border rounded-lg">
                <div className="font-medium">{business.name}</div>
                <div className="text-sm text-gray-600">{business.category}</div>
                <div className="text-sm text-gray-600">{business.area}</div>
                <div className="text-sm text-blue-600">{business.phone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-100 rounded-lg">
        <h3 className="font-semibold text-green-800">Next Steps:</h3>
        <ul className="mt-2 text-green-700 space-y-1">
          <li>✅ Database is connected and working</li>
          <li>✅ Sample data is loaded</li>
          <li>🔄 Ready to build admin panel (Day 3)</li>
          <li>🔄 Ready to build public listing page (Day 4)</li>
        </ul>
      </div>
    </div>
  )
} 