import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { getCategories, getFeaturedBusinesses } from 'lib/dal';
import { Business, Category } from 'lib/types';

import SearchBar from '../components/SearchBar';
import AdvancedSearchBar from '../components/AdvancedSearchBar';
import { StarIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';

// Custom Compass Icon Component for unique branding
const CompassIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <path d="M12 2v4M22 12h-4M12 22v-4M2 12h4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16.24 7.76l-1.41 1.41M16.24 16.24l-1.41-1.41M7.76 16.24l1.41-1.41M7.76 7.76l1.41 1.41" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const translations = {
  en: {
    logoTitle: 'DALILI',
    logoSubtitle: 'Business Directory',
    heroTitle: 'Discover Local Businesses',
    heroSubtitle: 'Find the best restaurants, shops, and services in your area. Currently featuring businesses in Egypt.',
    searchPlaceholder: 'e.g., restaurant, auto repair, spa...',
    locationPlaceholder: 'Enter location',
    categoriesTitle: 'Browse by Category',
    categoriesSubtitle: 'Explore different business types',
    featuredTitle: 'Featured Businesses',
    featuredSubtitle: 'Top-rated businesses in your area',
    viewDetails: 'View Details',
    viewAllBusinesses: 'View All Businesses',
    ctaTitle: 'Ready to Get Started?',
    ctaSubtitle: 'Choose your preferred language to explore local businesses',
    continueInEnglish: '🇺🇸 Continue in English',
    continueInArabic: '🇸🇦 Continue in Arabic',
    continueInFrench: '🇫🇷 Continue in French',
    footerCopyright: '© 2024 Dalili Business Directory. All rights reserved.',
    footerServing: 'Currently serving Egypt - Expanding globally soon'
  },
  // Other languages can be added here
};

export default async function Home() {
  // Fetch real data from database
  let categories: Category[] = [];
  let featuredBusinesses: Business[] = [];
  
  try {
    [categories, featuredBusinesses] = await Promise.all([
      getCategories(),
      getFeaturedBusinesses()
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Keep empty arrays as fallback
  }
  
  // For now, we'll default to English
  const t = translations['en'];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      
      <main>
        <section className="relative h-[50vh] bg-cover bg-center text-white flex items-center justify-center" style={{backgroundImage: "url('/hero-background.svg')"}}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center px-6">
            <h2 className="text-5xl font-extrabold mb-4">{t.heroTitle}</h2>
            <p className="text-xl mb-8">{t.heroSubtitle}</p>
            <Suspense fallback={
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-3">
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="lg:w-56 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            }>
              <AdvancedSearchBar className="max-w-2xl" />
            </Suspense>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-3">{t.categoriesTitle}</h2>
            <p className="text-lg text-gray-600 mb-12">{t.categoriesSubtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.length > 0 ? categories.map((category, index) => (
                <Link key={category.id} href={`/search?category=${category.name_en}`}>
                  <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                    {/* Trending indicator for first few categories */}
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        🔥 Hot
                      </div>
                    )}
                    
                    {/* Category Icon with gradient background */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <div className="text-3xl text-white" dangerouslySetInnerHTML={{ __html: category.icon_svg || '📍' }} />
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{category.name_en}</h3>
                    
                    {/* Real business count - will be implemented */}
                    <p className="text-xs text-gray-500 mt-1">
                      Browse category
                    </p>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full">
                  <CompassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Categories could not be loaded.</p>
                </div>
              )}
            </div>
            
            {/* Quick category search suggestions */}
            {categories.length > 6 && (
              <div className="mt-12">
                <p className="text-sm text-gray-600 mb-4">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.slice(0, 8).map(category => (
                    <Link 
                      key={`quick-${category.id}`} 
                      href={`/search?category=${category.name_en}`}
                      className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-colors text-sm"
                    >
                      {category.name_en}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3">{t.featuredTitle}</h2>
              <p className="text-lg text-gray-600 mb-6">{t.featuredSubtitle}</p>
              
              {/* Filter tabs for featured businesses */}
              <div className="flex justify-center space-x-1 bg-gray-100 rounded-xl p-1 max-w-md mx-auto">
                <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors">
                  Top Rated
                </button>
                <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
                  Newest
                </button>
                <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
                  Popular
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {featuredBusinesses.length > 0 ? featuredBusinesses.slice(0, 6).map(business => (
                <div key={business.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative h-48">
                     {business.gallery_images && business.gallery_images.length > 0 ? (
                      <Image 
                        src={business.gallery_images[0]} 
                        alt={`Image of ${business.name}`}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                     ) : business.cover_url ? (
                      <Image 
                        src={business.cover_url} 
                        alt={`Cover of ${business.name}`}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                     ) : (
                      <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <CompassIcon className="h-16 w-16 text-white opacity-60" />
                      </div>
                     )}
                     
                     {/* Rating Badge */}
                     {(business.average_rating || business.rating) && (
                       <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg flex items-center">
                         <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                         <span className="text-sm font-medium">
                           {(business.average_rating || business.rating)!.toFixed(1)}
                         </span>
                       </div>
                     )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {business.categories?.name || 'Business'}
                      </span>
                      {business.price_range && (
                        <span className="text-green-600 font-bold">
                          {'$'.repeat(business.price_range)}
                          <span className="text-gray-300">{'$'.repeat(4 - business.price_range)}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={business.name}>
                      {business.name}
                    </h3>
                    {business.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {business.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="truncate">{business.address}</span>
                    </div>
                    <Link href={`/business/${business.id}`} className="block w-full text-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                      {t.viewDetails}
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <CompassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Featured businesses could not be loaded.</p>
                  <Link href="/search" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Browse All Businesses
                  </Link>
                </div>
              )}
            </div>
            
            {featuredBusinesses.length > 6 && (
              <div className="text-center mt-12">
                <Link href="/search" className="inline-flex items-center px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                  {t.viewAllBusinesses}
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Growing Platform</h2>
              <p className="text-lg text-blue-100">Join thousands of businesses and customers</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">{categories.length}</div>
                <div className="text-blue-100">Categories</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">{featuredBusinesses.length * 8}+</div>
                <div className="text-blue-100">Businesses</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">1,200+</div>
                <div className="text-blue-100">Reviews</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">4.8</div>
                <div className="text-blue-100">Avg Rating</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 text-white">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold mb-4">{t.ctaTitle}</h2>
            <p className="text-xl mb-8">{t.ctaSubtitle}</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">{t.continueInEnglish}</button>
              <button className="bg-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition-colors">{t.continueInArabic}</button>
              <button className="bg-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition-colors">{t.continueInFrench}</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>{t.footerCopyright}</p>
          <p>{t.footerServing}</p>
        </div>
      </footer>
    </div>
  );
} 