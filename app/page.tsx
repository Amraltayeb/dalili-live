import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getFeaturedBusinesses } from 'lib/dal';
import { Business, Category } from 'lib/types';

import SearchBar from '../components/SearchBar';
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
      
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CompassIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.logoTitle}</h1>
              <p className="text-sm text-gray-500">{t.logoSubtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative h-[50vh] bg-cover bg-center text-white flex items-center justify-center" style={{backgroundImage: "url('/hero-background.svg')"}}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center px-6">
            <h2 className="text-5xl font-extrabold mb-4">{t.heroTitle}</h2>
            <p className="text-xl mb-8">{t.heroSubtitle}</p>
            <SearchBar 
              initialSearch=""
              initialLocation=""
              searchPlaceholder={t.searchPlaceholder}
              locationPlaceholder={t.locationPlaceholder}
            />
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-3">{t.categoriesTitle}</h2>
            <p className="text-lg text-gray-600 mb-12">{t.categoriesSubtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.length > 0 ? categories.map(category => (
                <Link key={category.id} href={`/search?category=${category.name_en}`}>
                  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="text-4xl mb-3" dangerouslySetInnerHTML={{ __html: category.icon_svg || '📍' }} />
                    <h3 className="font-semibold">{category.name_en}</h3>
                  </div>
                </Link>
              )) : <p className="col-span-full">Categories could not be loaded.</p>}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-3">{t.featuredTitle}</h2>
            <p className="text-lg text-gray-600 mb-12">{t.featuredSubtitle}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {featuredBusinesses.length > 0 ? featuredBusinesses.map(business => (
                <div key={business.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="relative h-56">
                     {business.images && business.images.length > 0 ? (
                      <Image 
                        src={business.images[0]} 
                        alt={`Image of ${business.name}`}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                     ) : (
                      <div className="h-full bg-gray-200 flex items-center justify-center">
                        <CompassIcon className="h-16 w-16 text-gray-400" />
                      </div>
                     )}
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-semibold text-blue-600 mb-1">{business.categories?.name || 'Category'}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate" title={business.name}>
                      {business.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      {business.rating && (
                          <div className="flex items-center mr-4">
                              <StarIcon className="h-5 w-5 mr-1 text-yellow-400" />
                              <span>{business.rating.toFixed(1)}</span>
                          </div>
                      )}
                      {business.phone && (
                          <div className="flex items-center">
                              <PhoneIcon className="h-5 w-5 mr-1 text-green-500" />
                              <span>{business.phone}</span>
                          </div>
                      )}
                    </div>
                    <p className="text-gray-600 flex items-start mb-4">
                      <MapPinIcon className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0 mt-1" />
                      <span>{business.address}</span>
                    </p>
                    <Link href={`/business/${business.id}`} legacyBehavior>
                      <a className="inline-block w-full text-center bg-blue-100 text-blue-800 font-semibold px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
                        {t.viewDetails}
                      </a>
                    </Link>
                  </div>
                </div>
              )) : <p className="col-span-full">Featured businesses could not be loaded.</p>}
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