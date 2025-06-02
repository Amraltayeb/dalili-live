import { useState, useEffect } from 'react';
import Link from 'next/link';
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon';
import BuildingOfficeIcon from '@heroicons/react/24/outline/BuildingOfficeIcon';
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';

export default function WorkingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Demo data (same structure as from Supabase)
  const demoCategories = [
    { id: 1, name: 'مطاعم', name_en: 'Restaurants', icon: '🍽️' },
    { id: 2, name: 'صيدليات', name_en: 'Pharmacies', icon: '💊' },
    { id: 3, name: 'مراكز طبية', name_en: 'Medical Centers', icon: '🏥' },
    { id: 4, name: 'تعليم', name_en: 'Education', icon: '🎓' },
    { id: 5, name: 'جمال', name_en: 'Beauty', icon: '💄' },
    { id: 6, name: 'تسوق', name_en: 'Shopping', icon: '🛍️' }
  ];

  const demoBusinesses = [
    {
      id: 1,
      name: "مطعم الأصالة",
      name_en: "Al Asala Restaurant", 
      category: "مطاعم",
      location: "القاهرة الجديدة - التجمع الخامس",
      phone: "01234567890",
      hours: "9:00 AM - 11:00 PM",
      rating: 4.5
    },
    {
      id: 2,
      name: "صيدلية النور",
      name_en: "Al Nour Pharmacy",
      category: "صيدليات", 
      location: "الشروق - المنطقة السكنية",
      phone: "01098765432",
      hours: "24/7",
      rating: 4.8
    },
    {
      id: 3,
      name: "مركز مدينتي الطبي", 
      name_en: "Madinaty Medical Center",
      category: "مراكز طبية",
      location: "مدينتي - الحي الأول",
      phone: "01555123456",
      hours: "8:00 AM - 10:00 PM",
      rating: 4.7
    }
  ];

  const heroSlides = [
    {
      title: "اكتشف الأعمال في منطقتك",
      subtitle: "دليل شامل للأعمال في القاهرة الجديدة والشروق ومدينتي",
      image: "/api/placeholder/800/400"
    },
    {
      title: "Find Local Businesses",
      subtitle: "Complete directory for New Cairo, El Shorouk, and Madinaty",
      image: "/api/placeholder/800/400"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">دليلي</h1>
              <span className="text-sm text-gray-500 ml-2">Dalili</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/ar" className="text-gray-700 hover:text-blue-600">العربية</Link>
              <Link href="/en" className="text-gray-700 hover:text-blue-600">English</Link>
              <Link href="/fr" className="text-gray-700 hover:text-blue-600">Français</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                {heroSlides[currentSlide].title}
              </h2>
              <p className="text-xl md:text-2xl mb-8">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="max-w-2xl mx-auto">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="ابحث عن الأعمال... Search businesses..."
                    className="flex-1 px-6 py-3 text-lg rounded-l-lg text-gray-900"
                  />
                  <button className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 text-lg font-semibold rounded-r-lg transition duration-200">
                    بحث
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">تصفح حسب الفئة</h3>
            <p className="text-xl text-gray-600">Browse by Category</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {demoCategories.map((category) => (
              <div key={category.id} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition duration-200 cursor-pointer">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.name_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">أعمال مميزة</h3>
            <p className="text-xl text-gray-600">Featured Businesses</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoBusinesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-semibold text-gray-900">{business.name}</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-600 ml-1">{business.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{business.name_en}</p>
                  <p className="text-blue-600 font-medium mb-4">{business.category}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 ml-2" />
                      <span>{business.location}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 ml-2" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 ml-2" />
                      <span>{business.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> This is a preview version with sample data. 
                Database connection is being configured.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Dalili Business Directory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 