"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReviewForm from '@/components/reviews/ReviewForm';
import { getBusinessById } from '@/lib/dal';
import { Business } from '@/lib/types';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function NewReviewPage() {
    const router = useRouter();
    const params = useParams();
    const businessId = params.id as string;

    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (businessId) {
            getBusinessById(businessId)
                .then(data => {
                    if (!data) {
                        setError('Business not found. It might have been removed or the link is incorrect.');
                    }
                    setBusiness(data);
                })
                .catch(() => setError('Failed to fetch business details. Please check your connection.'))
                .finally(() => setLoading(false));
        }
    }, [businessId]);

    const handleSuccess = () => {
        // Show a success message and then redirect
        alert('Thank you! Your review has been submitted successfully.');
        router.push(`/business/${businessId}`);
    };

    const renderState = (title: string, message: string) => (
        <div className="text-center p-12 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h2>
            <p className="text-gray-500">{message}</p>
            <Link href="/businesses" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                Explore other businesses
            </Link>
        </div>
    );

    if (loading) {
        return renderState("Loading Business...", "Please wait while we fetch the details.");
    }

    if (error) {
        return renderState("An Error Occurred", error);
    }

    if (!business) {
        return renderState("Business Not Found", "We couldn't find the business you're looking for.");
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href={`/business/${businessId}`} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back to {business.name}
                    </Link>
                </div>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Review <span className="text-blue-600">{business.name}</span>
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">Share your experience with the community.</p>
                </div>
                <ReviewForm businessId={businessId} onSuccess={handleSuccess} />
            </div>
        </div>
    );
} 