'use client';
// src/app/components/ui/rating/index.tsx
import { Star } from 'lucide-react';
import React from 'react';

interface RatingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  textColor?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export function Rating({ 
  score, 
  size = 'md', 
  showScore = false,
  textColor = 'text-gray-900'
}: RatingProps) {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  
  // スコアを小数点以下1桁で固定表示（3 → 3.0）
  const formattedScore = score.toFixed(1);

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            className={`${sizeClasses[size]} ${
              index <= fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : index <= fullStars + (hasHalfStar ? 1 : 0)
                ? 'text-yellow-400 fill-yellow-400/50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showScore && (
        <span className={`font-bold ${textColor} ${
          size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'
        } min-w-[2.5em]`}>
          {formattedScore}
        </span>
      )}
    </div>
  );
}