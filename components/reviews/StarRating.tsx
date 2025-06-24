'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showRating?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showRating = false,
  className = ''
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (newRating: number) => {
    if (interactive && onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= Math.round(rating);
          
          const StarComponent = isFilled ? StarIcon : StarOutlineIcon;
          
          return (
            <StarComponent
              key={index}
              className={`${sizeClasses[size]} ${
                isFilled ? 'text-yellow-400' : 'text-gray-300'
              } ${
                interactive ? 'cursor-pointer hover:text-yellow-500 transition-colors' : ''
              }`}
              onClick={() => handleStarClick(starNumber)}
            />
          );
        })}
      </div>
      {showRating && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
} 