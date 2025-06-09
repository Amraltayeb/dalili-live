'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';

interface SearchBarProps {
  initialSearch: string;
  initialLocation: string;
  searchPlaceholder: string;
  locationPlaceholder: string;
}

export default function SearchBar({ initialSearch, initialLocation, searchPlaceholder, locationPlaceholder }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationQuery, setLocationQuery] = useState(initialLocation);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-full shadow-xl max-w-3xl mx-auto p-2 flex items-center space-x-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={searchPlaceholder}
        className="flex-grow bg-transparent text-gray-700 px-4 py-2 focus:outline-none"
      />
      <div className="w-px bg-gray-200 h-8"></div>
      <input
        type="text"
        value={locationQuery}
        onChange={(e) => setLocationQuery(e.target.value)}
        placeholder={locationPlaceholder}
        className="bg-transparent text-gray-700 px-4 py-2 w-48 focus:outline-none"
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors">
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
    </div>
  );
} 