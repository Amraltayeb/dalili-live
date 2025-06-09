import Link from 'next/link';
import Image from 'next/image';
import { getBusinessById } from 'lib/dal';
import { Business } from 'lib/types';
import { 
  StarIcon, 
  PhoneIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShareIcon,
  HeartIcon,
  WifiIcon,
  TruckIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface BusinessPageProps {
  params: { id: string };
}

// Mock reviews data (in real app, this would come from database)
const mockReviews = [
  {
    id: 1,
    userName: "Ahmed M.",
    rating: 5,
    date: "2024-01-15",
    comment: "Amazing food and great service! The Nile view is absolutely stunning. Highly recommend the grilled fish.",
    helpful: 12
  },
  {
    id: 2,
    userName: "Sarah L.",
    rating: 4,
    date: "2024-01-10",
    comment: "Beautiful location with excellent Mediterranean cuisine. A bit pricey but worth it for special occasions.",
    helpful: 8
  },
  {
    id: 3,
    userName: "Omar K.",
    rating: 5,
    date: "2024-01-05",
    comment: "Perfect spot for dinner with family. The staff was incredibly friendly and the atmosphere is very relaxing.",
    helpful: 15
  }
];

// Mock photos (in real app, this would come from business.gallery_images)
const mockPhotos = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop", // Restaurant interior
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop", // Restaurant dining
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop", // Food dish
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop", // Outdoor seating
  "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=400&fit=crop"  // Restaurant atmosphere
];

export default async function BusinessPage({ params }: BusinessPageProps) {
  const business: Business | null = await getBusinessById(params.id);

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Business Not Found</h1>
          <p className="text-gray-600 mb-6">The business you're looking for doesn't exist.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const mockRating = 4.2 + Math.random() * 0.8;
  const reviewCount = Math.floor(Math.random() * 100 + 20);
  const photos = business.gallery_images || mockPhotos;
  const priceRange = business.price_range || 2;

  // Mock business hours (in real app, this would come from business.business_hours)
  const businessHours = {
    monday: { open: "11:00", close: "23:00" },
    tuesday: { open: "11:00", close: "23:00" },
    wednesday: { open: "11:00", close: "23:00" },
    thursday: { open: "11:00", close: "23:00" },
    friday: { open: "11:00", close: "00:00" },
    saturday: { open: "11:00", close: "00:00" },
    sunday: { open: "11:00", close: "22:00" }
  };

  // Mock features (in real app, this would come from business.features)
  const features = business.features || {
    wifi: true,
    parking: true,
    delivery: false,
    takeout: true,
    reservations: true,
    wheelchair_accessible: true,
    outdoor_seating: true,
    accepts_cards: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/search" className="flex items-center text-blue-600 hover:text-blue-800">
              <ChevronLeftIcon className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Back to Search</span>
              <span className="sm:hidden">Back</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <HeartIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Hero Photo Gallery */}
        <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-200">
          {photos.length > 0 ? (
            <div className="relative h-full">
              <Image 
                src={photos[0]} 
                alt={business.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              
              {/* Photo count indicator */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                1 / {photos.length}
              </div>
              
              {/* Navigation arrows for mobile */}
              {photos.length > 1 && (
                <>
                  <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all">
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all">
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="text-white text-8xl opacity-50">🏢</div>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          {/* Business Info Header */}
          <div className="bg-white -mt-8 relative z-10 rounded-t-2xl shadow-xl">
            <div className="px-6 pt-8 pb-6">
              {/* Business Name & Rating */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{business.name}</h1>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon 
                          key={star} 
                          className={`h-5 w-5 ${star <= Math.round(mockRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-700 mr-2">
                      {mockRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">({reviewCount} reviews)</span>
                  </div>

                  {/* Price Range & Category */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center text-green-600 font-medium">
                      {'$'.repeat(priceRange)}
                      <span className="text-gray-300">{'$'.repeat(4 - priceRange)}</span>
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {business.categories?.name || 'Restaurant'}
                    </span>
                    <span className="flex items-center text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Open until 11:00 PM
                    </span>
                  </div>
                </div>

                {/* Action Buttons - Mobile First */}
                <div className="flex flex-col sm:flex-row gap-3 sm:min-w-[200px]">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      <PhoneIcon className="h-5 w-5 mr-2" />
                      Call
                    </a>
                  )}
                  {business.address && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                    >
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      Directions
                    </a>
                  )}
                </div>
              </div>

              {/* Business Description */}
              {business.description && (
                <div className="border-t pt-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {business.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pb-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Business Features */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {features.wifi && (
                    <div className="flex items-center text-gray-700">
                      <WifiIcon className="h-5 w-5 mr-3 text-blue-500" />
                      <span>Free WiFi</span>
                    </div>
                  )}
                  {features.parking && (
                    <div className="flex items-center text-gray-700">
                      <span className="text-blue-500 mr-3">🚗</span>
                      <span>Parking</span>
                    </div>
                  )}
                  {features.delivery && (
                    <div className="flex items-center text-gray-700">
                      <TruckIcon className="h-5 w-5 mr-3 text-blue-500" />
                      <span>Delivery</span>
                    </div>
                  )}
                  {features.takeout && (
                    <div className="flex items-center text-gray-700">
                      <CheckBadgeIcon className="h-5 w-5 mr-3 text-blue-500" />
                      <span>Takeout</span>
                    </div>
                  )}
                  {features.reservations && (
                    <div className="flex items-center text-gray-700">
                      <ClockIcon className="h-5 w-5 mr-3 text-blue-500" />
                      <span>Reservations</span>
                    </div>
                  )}
                  {features.wheelchair_accessible && (
                    <div className="flex items-center text-gray-700">
                      <CheckBadgeIcon className="h-5 w-5 mr-3 text-blue-500" />
                      <span>Accessible</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Write Review
                  </button>
                </div>

                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon 
                                key={star} 
                                className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <button className="hover:text-blue-600 transition-colors">
                          👍 Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                                 <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                   <button className="text-blue-600 hover:text-blue-800 font-medium">
                     See all {reviewCount} reviews
                   </button>
                 </div>
               </div>

               {/* Similar Businesses Section */}
               <div className="bg-white rounded-xl shadow-lg p-6">
                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Businesses Nearby</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {/* Mock similar businesses */}
                   <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                     <div className="flex items-start space-x-3">
                       <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                         <Image 
                           src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=64&h=64&fit=crop"
                           alt="Restaurant"
                           width={64}
                           height={64}
                           className="object-cover"
                         />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="font-semibold text-gray-900 truncate">Cairo Kitchen</h4>
                         <div className="flex items-center mt-1">
                           {[1, 2, 3, 4, 5].map((star) => (
                             <StarIcon key={star} className="h-3 w-3 text-yellow-400" />
                           ))}
                           <span className="text-xs text-gray-500 ml-1">4.5 • 85 reviews</span>
                         </div>
                         <p className="text-sm text-gray-600 mt-1">Egyptian Cuisine • $$</p>
                         <p className="text-xs text-gray-500 mt-1">0.3 miles away</p>
                       </div>
                     </div>
                   </div>

                   <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                     <div className="flex items-start space-x-3">
                       <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                         <Image 
                           src="https://images.unsplash.com/photo-1515669097368-22e68427d265?w=64&h=64&fit=crop"
                           alt="Restaurant"
                           width={64}
                           height={64}
                           className="object-cover"
                         />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="font-semibold text-gray-900 truncate">Mediterranean Breeze</h4>
                         <div className="flex items-center mt-1">
                           {[1, 2, 3, 4].map((star) => (
                             <StarIcon key={star} className="h-3 w-3 text-yellow-400" />
                           ))}
                           <StarIcon className="h-3 w-3 text-gray-300" />
                           <span className="text-xs text-gray-500 ml-1">4.2 • 62 reviews</span>
                         </div>
                         <p className="text-sm text-gray-600 mt-1">Mediterranean • $$$</p>
                         <p className="text-xs text-gray-500 mt-1">0.5 miles away</p>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="mt-4 text-center">
                   <button className="text-blue-600 hover:text-blue-800 font-medium">
                     View More Similar Businesses
                   </button>
                 </div>
               </div>
             </div>

            {/* Right Column - Contact & Hours */}
            <div className="space-y-6">
              
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h3>
                <div className="space-y-4">
                  {business.address && (
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Address</p>
                        <p className="text-gray-600 text-sm">{business.address}</p>
                      </div>
                    </div>
                  )}

                  {business.phone && (
                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Phone</p>
                        <a 
                          href={`tel:${business.phone}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.website && (
                    <div className="flex items-start">
                      <GlobeAltIcon className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Website</p>
                        <a 
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hours</h3>
                <div className="space-y-2">
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-800 capitalize">{day}</span>
                      <span className="text-gray-600">
                        {hours.open} - {hours.close}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-medium">Open now</span>
                    <span className="text-gray-500 ml-2">• Closes at 11:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {business.whatsapp && (
                    <a
                      href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-500 text-white text-center py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  
                  <button className="block w-full bg-gray-100 text-gray-800 text-center py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    📝 Write Review
                  </button>
                  
                  <button className="block w-full bg-gray-100 text-gray-800 text-center py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    📷 Add Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 