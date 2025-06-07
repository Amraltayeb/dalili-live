'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon';
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon';
import StarIcon from '@heroicons/react/24/solid/StarIcon'; // Use solid icon for filled stars
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import { useState, useEffect } from 'react';
import { getCategories, getBusinesses } from 'lib/dal';
import { Business, Category } from 'lib/types';

// Custom Compass Icon Component for unique branding
const CompassIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <path d="M12 2v4M22 12h-4M12 22v-4M2 12h4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16.24 7.76l-1.41 1.41M16.24 16.24l-1.41-1.41M7.76 16.24l1.41-1.41M7.76 7.76l1.41 1.41" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

// Language type definition
type Language = 'en' | 'ar' | 'fr';

// Translation interface
interface Translation {
  logoTitle: string;
  logoSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  locationPlaceholder: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  featuredTitle: string;
  featuredSubtitle: string;
  viewDetails: string;
  viewAllBusinesses: string;
  ctaTitle: string;
  ctaSubtitle: string;
  continueInEnglish: string;
  continueInArabic: string;
  continueInFrench: string;
  footerCopyright: string;
  footerServing: string;
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('New Cairo');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesData, businessesData] = await Promise.all([
          getCategories(),
          getBusinesses({ featured: true })
        ]);
        setCategories(categoriesData);
        setFeaturedBusinesses(businessesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    router.push(`/search?${params.toString()}`);
  };
  
  const translations: Record<Language, Translation> = {
    en: {
      logoTitle: 'DALILI',
      logoSubtitle: 'Business Directory',
      heroTitle: 'Discover Local Businesses',
      heroSubtitle: 'Find the best restaurants, shops, and services in New Cairo, El Shorouk, and Madinaty',
      searchPlaceholder: 'e.g., car wash, tire repair...',
      locationPlaceholder: 'Location',
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
      footerServing: 'Serving New Cairo, El Shorouk, and Madinaty'
    },
    ar: {
      logoTitle: 'دليلي',
      logoSubtitle: 'دليل الأعمال',
      heroTitle: 'اكتشف الأعمال المحلية',
      heroSubtitle: 'اعثر على أفضل المطاعم والمحلات والخدمات في القاهرة الجديدة والشروق ومدينتي',
      searchPlaceholder: 'مثال: غسيل سيارات، تصليح إطارات...',
      locationPlaceholder: 'الموقع',
      categoriesTitle: 'تصفح حسب الفئة',
      categoriesSubtitle: 'استكشف أنواع الأعمال المختلفة',
      featuredTitle: 'الأعمال المميزة',
      featuredSubtitle: 'أعلى الأعمال تقييماً في منطقتك',
      viewDetails: 'عرض التفاصيل',
      viewAllBusinesses: 'عرض جميع الأعمال',
      ctaTitle: 'جاهز للبدء؟',
      ctaSubtitle: 'اختر لغتك المفضلة لاستكشاف الأعمال المحلية',
      continueInEnglish: '🇺🇸 متابعة بالإنجليزية',
      continueInArabic: '🇸🇦 متابعة بالعربية',
      continueInFrench: '🇫🇷 متابعة بالفرنسية',
      footerCopyright: '© 2024 دليلي دليل الأعمال. جميع الحقوق محفوظة.',
      footerServing: 'نخدم القاهرة الجديدة والشروق ومدينتي'
    },
    fr: {
      logoTitle: 'DALILI',
      logoSubtitle: 'Annuaire d\'Entreprises',
      heroTitle: 'Découvrez les Entreprises Locales',
      heroSubtitle: 'Trouvez les meilleurs restaurants, magasins et services au Nouveau Caire, El Shorouk et Madinaty',
      searchPlaceholder: 'ex: lavage auto, réparation de pneus...',
      locationPlaceholder: 'Emplacement',
      categoriesTitle: 'Parcourir par Catégorie',
      categoriesSubtitle: 'Explorez différents types d\'entreprises',
      featuredTitle: 'Entreprises en Vedette',
      featuredSubtitle: 'Entreprises les mieux notées de votre région',
      viewDetails: 'Voir les Détails',
      viewAllBusinesses: 'Voir Toutes les Entreprises',
      ctaTitle: 'Prêt à Commencer?',
      ctaSubtitle: 'Choisissez votre langue préférée pour explorer les entreprises locales',
      continueInEnglish: '🇺🇸 Continuer en Anglais',
      continueInArabic: '🇸🇦 Continuer en Arabe',
      continueInFrench: '🇫🇷 Continuer en Français',
      footerCopyright: '© 2024 Dalili Annuaire d\'Entreprises. Tous droits réservés.',
      footerServing: 'Desservant Le Nouveau Caire, El Shorouk et Madinaty'
    }
  };

  const t = translations[currentLanguage];

  const getCategoryName = (category: Category | Business['categories']): string => {
    if (currentLanguage === 'ar' && category.name_ar) return category.name_ar;
    return category.name;
  };

  const getBusinessName = (business: Business): string => {
    if (currentLanguage === 'ar' && business.name_ar) return business.name_ar;
    return business.name;
  };

  return (
    <div className={`bg-gray-50 min-h-screen text-gray-800 font-sans ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      
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
        {/* Hero Section */}
        <section className="relative h-[50vh] bg-cover bg-center text-white flex items-center justify-center" style={{backgroundImage: "url('/hero-background.jpg')"}}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center px-6">
            <h2 className="text-5xl font-extrabold mb-4">{t.heroTitle}</h2>
            <p className="text-xl mb-8">{t.heroSubtitle}</p>
            <div className="bg-white rounded-full shadow-xl max-w-3xl mx-auto p-2 flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-grow bg-transparent text-gray-700 px-4 py-2 focus:outline-none"
              />
              <div className="w-px bg-gray-200 h-8"></div>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder={t.locationPlaceholder}
                className="bg-transparent text-gray-700 px-4 py-2 w-48 focus:outline-none"
              />
              <button onClick={handleSearch} className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-3">{t.categoriesTitle}</h2>
            <p className="text-lg text-gray-600 mb-12">{t.categoriesSubtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map(category => (
                <Link key={category.id} href={`/search?category=${category.name}`}>
                  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <span className="text-4xl mb-3">{category.icon}</span>
                    <h3 className="font-semibold">{getCategoryName(category)}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Businesses Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-3">{t.featuredTitle}</h2>
            <p className="text-lg text-gray-600 mb-12">{t.featuredSubtitle}</p>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {featuredBusinesses.map(business => (
                  <div key={business.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <div className="relative h-56">
                       {business.images && business.images.length > 0 ? (
                        <Image 
                          src={business.images[0]} 
                          alt={`Image of ${getBusinessName(business)}`}
                          layout="fill"
                          objectFit="cover"
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 h-full flex items-center justify-center">
                          <CompassIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      {business.categories && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
                          {getCategoryName(business.categories)}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{getBusinessName(business)}</h3>
                      <p className="text-gray-600 mb-4 h-20 overflow-hidden">{business.description}</p>
                      <div className="flex items-center mb-2 text-gray-700">
                        <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <span>{business.area}</span>
                      </div>
                      {business.phone &&
                        <div className="flex items-center mb-4 text-gray-700">
                          <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
                          <span>{business.phone}</span>
                        </div>
                      }
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <StarIcon className="h-6 w-6 text-yellow-400" />
                          <span className="ml-1 text-lg font-bold">{business.rating?.toFixed(1)}</span>
                        </div>
                        <span className="text-lg font-semibold text-green-600">{business.price_range}</span>
                      </div>
                      <Link href={`/business/${business.id}`} passHref>
                        <span className="cursor-pointer block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                          {t.viewDetails}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-16">
              <Link href="/search" passHref>
                <span className="cursor-pointer bg-gray-800 text-white font-bold py-4 px-8 rounded-lg hover:bg-black transition-colors duration-300">
                  {t.viewAllBusinesses}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold mb-4">{t.ctaTitle}</h2>
            <p className="text-xl mb-8">{t.ctaSubtitle}</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setCurrentLanguage('en')} className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105">{t.continueInEnglish}</button>
              <button onClick={() => setCurrentLanguage('ar')} className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105">{t.continueInArabic}</button>
              <button onClick={() => setCurrentLanguage('fr')} className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105">{t.continueInFrench}</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>{t.footerCopyright}</p>
          <p className="text-sm text-gray-400 mt-2">{t.footerServing}</p>
        </div>
      </footer>
    </div>
  );
} 