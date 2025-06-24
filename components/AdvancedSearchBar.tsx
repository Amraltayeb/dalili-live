'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getCategories } from '../lib/dal';
import { Category } from '../lib/types';

interface AdvancedSearchBarProps {
  className?: string;
  showFilters?: boolean;
}

export default function AdvancedSearchBar({ className = '', showFilters = false }: AdvancedSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Search states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0);
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  
  // UI states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(showFilters);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (minRating > 0) params.set('rating', minRating.toString());
    if (priceRange) params.set('price', priceRange);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    
    router.push(`/search?${params.toString()}`);
    setTimeout(() => setIsLoading(false), 500);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCategory('');
    setMinRating(0);
    setPriceRange('');
    setSortBy('relevance');
    router.push('/search');
  };

  const activeFiltersCount = [
    selectedCategory,
    minRating > 0,
    priceRange,
    sortBy !== 'relevance'
  ].filter(Boolean).length;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Main Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-3 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search businesses, services, products..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent search-input-fix"
            />
          </div>

          {/* Location Input */}
          <div className="lg:w-56 relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Location (city, area)"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent search-input-fix"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search
              </>
            )}
          </button>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px]">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name_en}>
                    {category.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                    className="flex-1 flex items-center justify-center py-2 px-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <StarSolidIcon 
                      className={`h-4 w-4 ${rating <= minRating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                    <span className="ml-1 text-xs">{rating}+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Price</option>
                <option value="1">$ - Budget Friendly</option>
                <option value="2">$$ - Moderate</option>
                <option value="3">$$$ - Expensive</option>
                <option value="4">$$$$ - Very Expensive</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Most Relevant</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="distance">Nearest</option>
                <option value="newest">Newest</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 