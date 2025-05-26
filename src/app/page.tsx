import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-warm via-white to-mena-gold/10 flex items-center justify-center p-4">
      <div className="max-w-4xl text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <img src="/logo-icon.svg" alt="DALILI" className="w-16 h-16" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">DALILI</h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to Dalili Live
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Your Real-Time Business Discovery Platform
        </p>

        {/* Language Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">Choose Your Language</h3>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link 
              href="/en" 
              className="group bg-desert-blue text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
            >
              <span className="mr-2">🇺🇸</span>
              English
            </Link>
            <Link 
              href="/ar" 
              className="group bg-olive-green text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
            >
              <span className="mr-2">🇸🇦</span>
              العربية
            </Link>
            <Link 
              href="/fr" 
              className="group bg-sunset-orange text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
            >
              <span className="mr-2">🇫🇷</span>
              Français
            </Link>
          </div>
        </div>

        <p className="text-gray-600 text-lg">
          Discover amazing businesses and experiences in your area
        </p>
        
        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <div className="text-3xl mb-3">🍽️</div>
            <p className="font-medium text-gray-700">Restaurants & Cafes</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <div className="text-3xl mb-3">🛍️</div>
            <p className="font-medium text-gray-700">Shopping & Services</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <div className="text-3xl mb-3">⭐</div>
            <p className="font-medium text-gray-700">Reviews & Ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
} 