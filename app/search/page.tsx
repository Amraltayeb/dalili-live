import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBusinesses, getCategories, searchBusinessesAdvanced, searchBusinessesByCategoryEnhanced, searchBusinessesWithFilters } from '../../lib/dal';
import { Business, Category } from '../../lib/types';
import { StarIcon, PhoneIcon, MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import AdvancedSearchBar from '../../components/AdvancedSearchBar';

// Custom Compass Icon Component
const CompassIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <path d="M12 2v4M22 12h-4M12 22v-4M2 12h4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16.24 7.76l-1.41 1.41M16.24 16.24l-1.41-1.41M7.76 16.24l1.41-1.41M7.76 7.76l1.41 1.41" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

async function SearchResults({ searchParams }: { searchParams: { q?: string; location?: string; category?: string; rating?: string; price?: string; sort?: string } }) {
  const query = searchParams.q || '';
  const location = searchParams.location || '';
  const selectedCategory = searchParams.category || '';
  const minRating = Number(searchParams.rating) || 0;
  const priceRange = searchParams.price || '';
  const sortBy = searchParams.sort || 'relevance';
  
  // Fetch businesses and categories
  let businesses: Business[] = [];
  let categories: Category[] = [];
  
  try {
    // Get categories first
    categories = await getCategories();
    
    // Use the working search functions
    if (selectedCategory) {
      // Use the working category search for specific categories
      businesses = await searchBusinessesByCategoryEnhanced(selectedCategory);
      console.log('🔍 Category search for:', selectedCategory, 'found:', businesses.length);
    } else {
      // Use the enhanced search for general searches
      businesses = await searchBusinessesWithFilters({
        query,
        location,
        minRating,
        priceRange: priceRange ? parseInt(priceRange) : undefined,
        sortBy,
        limit: 50
      });
      console.log('🔍 General search found:', businesses.length);
    }
    
    // Debug: Log search results
    console.log('📊 Search results:', businesses.map(b => ({ id: b.id, name: b.name })));
    
    // Additional client-side filtering for location if needed
    if (location && !selectedCategory) {
      businesses = businesses.filter(business => 
        business.address?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Apply client-side filtering for rating and price if not handled by server
    if (minRating > 0) {
      businesses = businesses.filter(business => 
        (business.average_rating || business.rating || 0) >= minRating
      );
    }
    
    if (priceRange) {
      const targetPrice = parseInt(priceRange);
      businesses = businesses.filter(business => 
        (business.price_range || 2) === targetPrice
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        businesses.sort((a, b) => (b.average_rating || b.rating || 0) - (a.average_rating || a.rating || 0));
        break;
      case 'reviews':
        businesses.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
        break;
      case 'newest':
        businesses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'name':
        businesses.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for relevance
        break;
    }
    
  } catch (error) {
    console.error('Error fetching search data:', error);
    // Fallback to basic search if advanced search fails
    try {
      const allBusinesses = await getBusinesses();
      businesses = allBusinesses.filter(business => {
        if (query) {
          const searchText = query.toLowerCase();
          if (!business.name.toLowerCase().includes(searchText) && 
              !business.description?.toLowerCase().includes(searchText) &&
              !business.address?.toLowerCase().includes(searchText)) {
            return false;
          }
        }
        if (location) {
          const locationText = location.toLowerCase();
          if (!business.address?.toLowerCase().includes(locationText)) {
            return false;
          }
        }
        if (minRating > 0) {
          if ((business.average_rating || business.rating || 0) < minRating) {
            return false;
          }
        }
        if (priceRange) {
          const targetPrice = parseInt(priceRange);
          if ((business.price_range || 2) !== targetPrice) {
            return false;
          }
        }
        return business.status === 'active';
      });
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <AdvancedSearchBar showFilters={false} />
        </div>

        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory ? `${selectedCategory}` : 
                 query ? `Results for "${query}"` : 'All Businesses'}
              </h1>
              <p className="text-gray-600">
                {businesses.length} business{businesses.length !== 1 ? 'es' : ''} found
                {location && ` in ${location}`}
                {selectedCategory && ` in ${selectedCategory}`}
                {minRating > 0 && ` · ${minRating}+ stars`}
                {priceRange && ` · ${Array(parseInt(priceRange)).fill('$').join('')}`}
              </p>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-gray-500">Sorted by: <span className="font-medium">{
                sortBy === 'relevance' ? 'Most Relevant' :
                sortBy === 'rating' ? 'Highest Rated' :
                sortBy === 'reviews' ? 'Most Reviews' :
                sortBy === 'distance' ? 'Nearest' :
                sortBy === 'newest' ? 'Newest' :
                sortBy === 'name' ? 'Name A-Z' : 'Relevance'
              }</span></p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
              <div className="space-y-2">
                <Link 
                  href={`/search?q=${query}&location=${location}`}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !selectedCategory 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </Link>
                {categories.map(category => (
                  <Link 
                    key={category.id}
                    href={`/search?q=${query}&location=${location}&category=${category.name_en}`}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.name_en 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.icon_svg} {category.name_en}
                  </Link>
                ))}
              </div>
            </div>

            {/* Status Info */}
            <div className="mt-6 bg-green-50 rounded-lg shadow p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2">✅ Status</h4>
              <p className="text-xs text-green-700">RLS Disabled: Categories should filter properly</p>
              <p className="text-xs text-green-700">Categories: {categories.length}</p>
              <p className="text-xs text-green-700">Current Filter: {selectedCategory || 'All'}</p>
              <p className="text-xs text-green-700">Results: {businesses.length}</p>
              <Link 
                href="/debug-data" 
                className="text-xs text-green-600 hover:text-green-800 underline"
              >
                View Database Debug →
              </Link>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {businesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map(business => (
                  <div key={business.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Business Image */}
                    <div className="relative h-48">
                      {business.cover_url ? (
                        <Image 
                          src={business.cover_url} 
                          alt={`Cover image of ${business.name}`}
                          fill={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <CompassIcon className="h-16 w-16 text-white opacity-50" />
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      {business.categories && (
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
                            {business.categories.icon} {business.categories.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Business Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                        {business.name}
                      </h3>
                      
                      {business.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {business.description}
                        </p>
                      )}

                      {/* Rating and Contact */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {business.average_rating || business.rating || 4.2}
                          </span>
                        </div>
                        {business.phone && (
                          <div className="flex items-center text-green-600">
                            <PhoneIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">{business.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      {business.address && (
                        <div className="flex items-start mb-4">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{business.address}</span>
                        </div>
                      )}

                      {/* View Details Button */}
                      <Link 
                        href={`/business/${business.id}`}
                        className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <CompassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-6">
                  {categories.length === 0 
                    ? "Run the Egyptian setup to populate the database with categories and businesses."
                    : selectedCategory 
                    ? `No businesses found in "${selectedCategory}" category.`
                    : "Try adjusting your search criteria or browse all categories."
                  }
                </p>
                <div className="space-x-4">
                  {categories.length === 0 && (
                    <Link 
                      href="/setup-egypt"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      🇪🇬 Setup Egyptian Data
                    </Link>
                  )}
                  <Link 
                    href="/debug-data"
                    className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    🔍 Debug Database
                  </Link>
                  <Link 
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string; location?: string; category?: string; rating?: string; price?: string; sort?: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
} 