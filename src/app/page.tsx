'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon';
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon';
import StarIcon from '@heroicons/react/24/outline/StarIcon';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import { useState, useEffect } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Demo categories data
  const categories = [
    { id: 1, name: 'Restaurants', name_ar: 'مطاعم', icon: '🍽️', count: 45, color: 'bg-red-500' },
    { id: 2, name: 'Shopping', name_ar: 'تسوق', icon: '🛍️', count: 32, color: 'bg-blue-500' },
    { id: 3, name: 'Healthcare', name_ar: 'صحة', icon: '🏥', count: 28, color: 'bg-green-500' },
    { id: 4, name: 'Education', name_ar: 'تعليم', icon: '🎓', count: 19, color: 'bg-purple-500' },
    { id: 5, name: 'Beauty', name_ar: 'جمال', icon: '💄', count: 23, color: 'bg-pink-500' },
    { id: 6, name: 'Services', name_ar: 'خدمات', icon: '🔧', count: 41, color: 'bg-orange-500' }
  ];

  // Featured businesses demo data
  const featuredBusinesses = [
    {
      id: 1,
      name: 'Cairo Kitchen',
      name_ar: 'مطبخ القاهرة',
      category: 'Restaurant',
      area: 'New Cairo',
      rating: 4.8,
      image: '/api/placeholder/300/200',
      phone: '01234567890',
      hours: '9:00 AM - 11:00 PM'
    },
    {
      id: 2,
      name: 'Tech Plaza',
      name_ar: 'تك بلازا',
      category: 'Shopping',
      area: 'Madinaty',
      rating: 4.6,
      image: '/api/placeholder/300/200',
      phone: '01098765432',
      hours: '10:00 AM - 10:00 PM'
    },
    {
      id: 3,
      name: 'Family Clinic',
      name_ar: 'عيادة العائلة',
      category: 'Healthcare',
      area: 'El Shorouk',
      rating: 4.9,
      image: '/api/placeholder/300/200',
      phone: '01555123456',
      hours: '8:00 AM - 8:00 PM'
    }
  ];

  const heroSlides = [
    {
      title: 'Discover Local Businesses',
      subtitle: 'Find the best restaurants, shops, and services in New Cairo, El Shorouk, and Madinaty',
      bg: 'from-blue-600 to-purple-700'
    },
    {
      title: 'اكتشف الأعمال المحلية',
      subtitle: 'اعثر على أفضل المطاعم والمحلات والخدمات في القاهرة الجديدة والشروق ومدينتي',
      bg: 'from-green-600 to-blue-600'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">دليلي</h1>
                <p className="text-xs text-gray-500">DALILI</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/en" className="text-gray-700 hover:text-blue-600 font-medium">English</Link>
              <Link href="/ar" className="text-gray-700 hover:text-blue-600 font-medium">العربية</Link>
              <Link href="/fr" className="text-gray-700 hover:text-blue-600 font-medium">Français</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative h-96 bg-gradient-to-r ${heroSlides[currentSlide].bg} overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              {heroSlides[currentSlide].title}
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {heroSlides[currentSlide].subtitle}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for businesses, restaurants, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-16 text-lg rounded-full text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                />
                <button className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-200">
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h3>
            <p className="text-xl text-gray-600">تصفح حسب الفئة</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/en/category/${category.name.toLowerCase()}`}
                className="group bg-gray-50 hover:bg-white rounded-xl p-6 text-center transition duration-300 shadow-sm hover:shadow-md"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{category.name_ar}</p>
                <p className="text-xs text-blue-600 font-medium">{category.count} businesses</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Businesses</h3>
            <p className="text-xl text-gray-600">الأعمال المميزة</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl">🏢</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{business.name}</h4>
                      <p className="text-gray-600">{business.name_ar}</p>
                    </div>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-gray-600 ml-1">{business.rating}</span>
                    </div>
                  </div>
                  <p className="text-blue-600 font-medium mb-2">{business.category}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span>{business.area}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>{business.hours}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/en/businesses"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              View All Businesses
              <MagnifyingGlassIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8">Choose your preferred language to explore local businesses</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link 
              href="/en" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              🇺🇸 Continue in English
            </Link>
            <Link 
              href="/ar" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              🇸🇦 متابعة بالعربية
            </Link>
            <Link 
              href="/fr" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              🇫🇷 Continuer en Français
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Dalili Business Directory. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Serving New Cairo, El Shorouk, and Madinaty</p>
        </div>
      </footer>
    </div>
  );
} 