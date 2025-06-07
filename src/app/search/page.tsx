import Link from 'next/link';
import Image from 'next/image';
import { searchBusinesses } from 'lib/dal';
import { Business } from 'lib/types';
import { MapPinIcon, PhoneIcon, StarIcon } from '@heroicons/react/24/outline';

interface SearchPageProps {
  searchParams: {
    q?: string;
    location?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q || '';
  const location = searchParams.location || '';

  // Data is now fetched on the server before the page is rendered.
  const results: Business[] = await searchBusinesses(query, location);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {query ? `Search Results for "${query}"` : 'Perform a search to see results'}
        </h1>
        {location && <p className="text-lg text-gray-600 mt-1">in {location}</p>}
      </header>

      <main>
        {results.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800">No results found</h2>
            <p className="text-gray-600 mt-2">
              We couldn't find any businesses matching your search. Try a different term or check your spelling.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((business) => (
              <div key={business.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group">
                <div className="relative h-56">
                  <Image
                    src={business.images && business.images.length > 0 ? business.images[0] : '/placeholder-image.png'}
                    alt={business.name}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold text-blue-600 mb-1">{business.categories?.name || 'Category'}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate" title={business.name}>
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

export default SearchPage; 