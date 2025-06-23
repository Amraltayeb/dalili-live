"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBusinessById, getReviewsByBusinessId } from 'lib/dal';
import { Business, Review } from 'lib/types';
import {
    StarIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon,
    ClockIcon,
    ShareIcon,
    HeartIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';

// --- Helper Component: PhotoGallery ---
const PhotoGallery = ({ photos, businessName }: { photos: string[]; businessName: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!photos || photos.length === 0) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                <div className="text-white text-8xl opacity-30">🏢</div>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <p className="absolute bottom-4 text-white text-sm">No photos available</p>
            </div>
        );
    }

    const nextSlide = () => setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));

    return (
        <div className="relative h-full group">
            <Image
                src={photos[currentIndex]}
                alt={`${businessName} photo ${currentIndex + 1}`}
                fill
                className="object-cover transition-transform duration-500 ease-in-out"
                priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                {currentIndex + 1} / {photos.length}
            </div>

            {photos.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all opacity-0 group-hover:opacity-100 focus:outline-none">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button onClick={nextSlide} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all opacity-0 group-hover:opacity-100 focus:outline-none">
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                </>
            )}
        </div>
    );
};

// --- Helper Component: BusinessHours ---
const BusinessHours = ({ hours, timezone }: { hours?: any, timezone?: string }) => {
    if (!hours) return <p className="text-gray-600">Hours not available.</p>;

    const today = new Date().toLocaleString('en-US', { weekday: 'long', timeZone: timezone || 'UTC' }).toLowerCase();
    const todayHours = hours[today];
    
    // A more robust check for open status would require parsing time and comparing with current time.
    // This is a simplified visual indicator.
    const isOpen = todayHours && todayHours.open && todayHours.close;

    return (
        <div className="flex items-center text-sm">
            <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
            {isOpen ? (
                <>
                    <span className="text-green-600 font-semibold">Open</span>
                    <span className="text-gray-600 ml-1">until {todayHours.close}</span>
                </>
            ) : (
                <span className="text-red-600 font-semibold">Closed</span>
            )}
        </div>
    );
};

// --- Helper Component: BusinessFeatures ---
const BusinessFeatures = ({ features }: { features?: any }) => {
    if (!features) return null;

    const featureList = Object.entries(features)
        .filter(([, value]) => value === true)
        .map(([key]) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    if (featureList.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                {featureList.map((feature) => (
                    <div key={feature} className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Helper Component: ReviewCard ---
const ReviewCard = ({ review }: { review: Review }) => {
    const userInitial = (review.users?.name || 'U').charAt(0).toUpperCase();
    const hasAvatar = Boolean(review.users?.avatar_url);
    
    return (
        <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start">
                <div className="w-11 h-11 bg-gray-200 rounded-full flex-shrink-0 mr-4 overflow-hidden relative">
                    {hasAvatar ? (
                        <Image 
                            src={review.users!.avatar_url!} 
                            alt={review.users?.name || 'User'} 
                            fill 
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                    parent.innerHTML = `
                                        <div class="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                            ${userInitial}
                                        </div>
                                    `;
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                            {userInitial}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{review.users?.name || 'Anonymous'}</p>
                    <div className="flex items-center mt-1">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="text-gray-500 text-xs ml-2">
                            {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>
            {review.title && <h4 className="font-semibold text-gray-800 mt-3">{review.title}</h4>}
            <p className="text-gray-700 mt-2 leading-relaxed">
                {review.content}
            </p>
            {review.photos && review.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {review.photos.map((photo: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                            <Image 
                                src={photo} 
                                alt={`Review photo ${idx + 1}`} 
                                fill 
                                className="object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = `
                                            <div class="w-full h-full bg-gray-300 flex items-center justify-center">
                                                <span class="text-gray-500 text-xs">Photo unavailable</span>
                                            </div>
                                        `;
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Main Page Component ---
export default function BusinessPage({ params }: { params: { id: string } }) {
    const [business, setBusiness] = useState<Business | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const businessData = await getBusinessById(params.id);
                if (businessData) {
                    const reviewsData = await getReviewsByBusinessId(params.id);
                    setBusiness(businessData);
                    setReviews(reviewsData);
                }
            } catch (error) {
                console.error("Failed to fetch business data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    if (loading) {
        return <div className="text-center p-20 font-semibold text-gray-600">Loading business details...</div>;
    }

    if (!business) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Business Not Found</h1>
                    <p className="text-gray-600 mb-6">The business you're looking for doesn't exist.</p>
                    <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }
    
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;
    
    const priceRange = business.price_range || 2;

    // Create safe link variables to help with type inference
    const phoneLink = business.phone ? `tel:${business.phone}` : undefined;
    const directionsLink = business.address ? `https://maps.google.com/?q=${encodeURIComponent(business.address)}` : undefined;
    const websiteLink = business.website_url ? business.website_url : undefined;

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:py-8">
                <div className="relative h-64 sm:h-80 lg:h-[450px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                    <PhotoGallery photos={business.gallery_images || []} businessName={business.name} />
                </div>
                
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="bg-white -mt-16 relative z-10 rounded-2xl shadow-xl p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                                  {business.categories?.name || 'Category'}
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">{business.name}</h1>
                                {business.description && <p className="text-gray-600 mt-2 text-lg">{business.description}</p>}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
                                    <div className="flex items-center">
                                        <span className="text-lg font-bold text-gray-800 mr-1">{averageRating.toFixed(1)}</span>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <StarIcon key={star} className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500 ml-2">({reviews.length} reviews)</span>
                                    </div>
                                    <span className="text-gray-500 text-2xl font-light">·</span>
                                    <span className="flex items-center text-sm text-green-700 font-medium">
                                        {'$'.repeat(priceRange)}<span className="text-gray-300">{'$'.repeat(4 - priceRange)}</span>
                                    </span>
                                    <span className="text-gray-500 text-2xl font-light">·</span>
                                    <BusinessHours hours={business.business_hours} timezone={business.timezone || undefined} />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-3">
                                <Link href={`/business/${business.id}/reviews/new`} className="w-full text-center bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition-colors font-bold text-md">
                                    Write a Review
                                </Link>
                                {phoneLink && <a href={phoneLink} className="w-full text-center bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"><PhoneIcon className="h-5 w-5 inline -mt-1 mr-2" />Call</a>}
                                {directionsLink && <a href={directionsLink} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-gray-700 text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"><MapPinIcon className="h-5 w-5 inline -mt-1 mr-2" />Directions</a>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        <div className="lg:col-span-2 space-y-8">
                            <BusinessFeatures features={business.features} />
                            <div id="reviews" className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold text-gray-800 mb-5">Reviews</h3>
                                {reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to share your experience!</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Location & Contact</h3>
                                <div className="space-y-3 text-sm">
                                    {business.address && (
                                        <div className="flex items-start">
                                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <p className="text-gray-700">{business.address}</p>
                                        </div>
                                    )}
                                    {phoneLink && (
                                        <div className="flex items-start">
                                            <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <a href={phoneLink} className="text-blue-600 hover:underline">{business.phone}</a>
                                        </div>
                                    )}
                                    {websiteLink && (
                                        <div className="flex items-start">
                                            <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <a href={websiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                                {business.website_url?.replace(/^(https?:\/\/)?(www\.)?/, '') || ''}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 