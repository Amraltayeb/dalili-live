export default function EnglishHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-warm to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo-icon.svg" alt="DALILI" className="w-10 h-10" />
              <h1 className="text-xl font-bold text-gray-900">DALILI</h1>
            </div>
            <nav className="flex space-x-4">
              <button className="text-gray-600 hover:text-desert-blue">Sign In</button>
              <button className="bg-desert-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Join Now
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover the Best of
            <span className="text-mena-gold"> Local</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted guide to restaurants, services, and experiences in your city.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-blue focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Where?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-blue focus:border-transparent"
              />
              <button className="bg-desert-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Restaurants', emoji: '🍽️', color: 'bg-red-100 text-red-700' },
              { name: 'Shopping', emoji: '🛍️', color: 'bg-pink-100 text-pink-700' },
              { name: 'Healthcare', emoji: '🏥', color: 'bg-green-100 text-green-700' },
              { name: 'Beauty', emoji: '💄', color: 'bg-purple-100 text-purple-700' },
              { name: 'Auto', emoji: '🚗', color: 'bg-blue-100 text-blue-700' },
              { name: 'Services', emoji: '🔧', color: 'bg-yellow-100 text-yellow-700' },
            ].map((category) => (
              <div key={category.name} className="text-center group cursor-pointer">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${category.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                  {category.emoji}
                </div>
                <p className="font-medium text-gray-700">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-mena-gold rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                ⭐
              </div>
              <h3 className="text-xl font-bold mb-3">Trusted Reviews</h3>
              <p className="text-gray-600">Read authentic reviews from real customers in your area.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-olive-green rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🗺️
              </div>
              <h3 className="text-xl font-bold mb-3">Local Discovery</h3>
              <p className="text-gray-600">Find hidden gems and popular spots in your neighborhood.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sunset-orange rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                📱
              </div>
              <h3 className="text-xl font-bold mb-3">Mobile First</h3>
              <p className="text-gray-600">Designed for how people actually discover local businesses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/logo-icon.svg" alt="DALILI" className="w-8 h-8" />
            <h3 className="text-xl font-bold">DALILI</h3>
          </div>
          <p className="text-gray-400 mb-8">Your trusted local business discovery platform</p>
          <div className="flex justify-center space-x-8 text-sm">
            <a href="#" className="hover:text-mena-gold">About</a>
            <a href="#" className="hover:text-mena-gold">Privacy</a>
            <a href="#" className="hover:text-mena-gold">Terms</a>
            <a href="#" className="hover:text-mena-gold">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 