'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBusinesses } from 'lib/supabase';
import { MapPinIcon, PhoneIcon, StarIcon } from '@heroicons/react/24/outline';

// Re-using the same professional types from the homepage for consistency
interface BusinessCategory {
  name: string;
  name_ar: string | null;
  icon: string | null;
  color: string | null;
}

interface Business {
  id: number;
  created_at: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  area: string | null;
  address: string | null;
  category_id: number | null;
  subcategory: string | null;
  services_offered: any | null; 
  price_range: string | null;
  working_hours: { day: string; hours: string; }[] | null; 
  images: string[] | null;
  social_links: any | null;
  custom_data: any | null;
  status: string;
  featured: boolean;
  verified: boolean;
  rating: number | null;
  categories: BusinessCategory; 
}

const SearchResultsContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('q') || '' : '';
  const location = searchParams ? searchParams.get('location') || '' : '';

  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Here we use our powerful getBusinesses function with the search filter
        const data = await getBusinesses({ search: query, area: location });
        setResults(data as Business[]);
      } catch (err: any) {
        console.error("Failed to fetch search results:", err);
        setError("We couldn't fetch your search results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, location]);

  const BusinessCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {query ? `Search Results for "${query}"` : 'Search'}
        </h1>
        {location && <p className="text-lg text-gray-600 mt-1">in {location}</p>}
      </header>

      <main>
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <BusinessCardSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-red-50 rounded-2xl">
            <h2 className="text-xl font-semibold text-red-700">Something went wrong</h2>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800">No results found</h2>
            <p className="text-gray-600 mt-2">
              We couldn't find any businesses matching "{query}". Try a different search term.
            </p>
          </div>
        )}
        
        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((business) => (
              <div key={business.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group">
                <div className="relative h-56">
                  <Image
                    src={business.images && business.images.length > 0 ? business.images[0] : '/placeholder-image.png'}
                    alt={business.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold text-blue-600 mb-1">{business.categories?.name || 'Category'}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                    {business.name}
                  </h3>
                  <p className="text-gray-600 flex items-center mb-4">
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {business.area}
                  </p>
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
                  <Link href={`/business/${business.id}`} legacyBehavior>
                    <a className="inline-block w-full text-center bg-blue-100 text-blue-800 font-semibold px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
                      View Details
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Next.js 13 requires Suspense boundary for useSearchParams
const SearchPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchResultsContent />
  </Suspense>
);

export default SearchPage; 