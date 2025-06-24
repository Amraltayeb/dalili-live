"use client";
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, ReviewData } from '@/lib/validations';
import { uploadBusinessPhoto } from '@/lib/photo-upload';
import { getCurrentUser } from '@/lib/dal';
import { StarIcon, PhotoIcon } from '@heroicons/react/24/solid';

// --- Helper: Star Rating Component ---
const StarRating = ({ field }: { field: any }) => {
    const [rating, setRating] = useState(field.value || 0);
    const [hover, setHover] = useState(0);

    return (
        <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={ratingValue}>
                        <input
                            type="radio"
                            name={field.name}
                            className="hidden"
                            value={ratingValue}
                            onChange={() => {
                                setRating(ratingValue);
                                field.onChange(ratingValue);
                            }}
                            onBlur={field.onBlur}
                        />
                        <StarIcon
                            className={`h-10 w-10 cursor-pointer transition-colors ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                        />
                    </label>
                );
            })}
        </div>
    );
};

interface ReviewFormProps {
  businessId: string;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ businessId, onSuccess }) => {
  const [user, setUser] = React.useState<any>(null);
  const [photoFiles, setPhotoFiles] = React.useState<File[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [uploadingPhotos, setUploadingPhotos] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const methods = useForm<ReviewData>({
    resolver: zodResolver(reviewSchema),
    mode: 'onBlur',
  });

  React.useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  if (!user) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to write a review.</p>
        <p className="mt-2 text-sm text-gray-500">Your feedback is valuable to the community!</p>
      </div>
    );
  }

  const onSubmit = async (data: ReviewData) => {
    setSubmitting(true);
    setError(null);
    try {
      // Upload photos with error handling
      let photoUrls: string[] = [];
      if (photoFiles.length > 0) {
        setUploadingPhotos(true);
        try {
          photoUrls = await Promise.all(
            photoFiles.map((file, idx) => uploadBusinessPhoto(file, `review-${businessId}-${user.id}`, idx))
          );
        } catch (uploadError) {
          console.error('Photo upload failed:', uploadError);
          setError('Some photos failed to upload. Please try again or submit without photos.');
          setSubmitting(false);
          setUploadingPhotos(false);
          return;
        } finally {
          setUploadingPhotos(false);
        }
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, photos: photoUrls, businessId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Review submission failed. Please try again.');
      }
      
      onSuccess();
      methods.reset();
      setPhotoFiles([]);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Write your review</h2>

        <div>
          <label className="block text-md font-semibold text-gray-700 mb-3">Select your rating *</label>
          <Controller
            name="rating"
            control={methods.control}
            rules={{ required: "Rating is required" }}
            render={({ field }) => <StarRating field={field} />}
          />
          {methods.formState.errors.rating && <p className="text-red-600 text-sm mt-2">{methods.formState.errors.rating.message}</p>}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Review Title (Optional)</label>
          <input id="title" {...methods.register('title')} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 search-input-fix" />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Your Review *</label>
          <textarea id="content" {...methods.register('content')} rows={6} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 search-input-fix"></textarea>
          {methods.formState.errors.content && <p className="text-red-600 text-sm mt-2">{methods.formState.errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Add photos (Optional)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload files</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={e => setPhotoFiles(Array.from(e.target.files || []))} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              {photoFiles.length > 0 && <p className="text-sm text-green-600 pt-2">{photoFiles.length} file(s) selected.</p>}
            </div>
          </div>
        </div>

        {error && <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>}

        <button
          type="submit"
          disabled={submitting || uploadingPhotos}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploadingPhotos ? 'Uploading Photos...' : 
           submitting ? 'Submitting Review...' : 'Submit Review'}
        </button>
      </form>
    </FormProvider>
  );
};

export default ReviewForm; 