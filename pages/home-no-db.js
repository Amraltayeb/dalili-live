import Link from 'next/link'

export default function HomeNoDB() {
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
          
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-8">
            <strong>Test Version:</strong> This page works without database connections.
            <br />If you see this, the issue is with Supabase connection in the main pages.
          </div>
        </div>

        {/* Mock Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-gray-600">Total Businesses</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">📱</div>
            <div className="text-2xl font-bold text-gray-900">10</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">📍</div>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-gray-600">Areas Covered</div>
          </div>
        </div>

        {/* Mock Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Sample Business {i}
              </h4>
              <div className="flex items-center gap-4 mb-3 text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Restaurant
                </span>
                <span className="text-gray-600">📍 New Cairo</span>
              </div>
              <p className="text-gray-600 mb-4">
                This is a sample business description to test the layout.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>📞</span>
                <span>+20 123 456 7890</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success!</strong> If you can see this page properly, Next.js is working.
            <br />The main issue is likely with the Supabase connection in the database-dependent pages.
          </div>
        </div>
      </div>
    </div>
  )
} 