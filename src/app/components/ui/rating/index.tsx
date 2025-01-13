'use client';
// src/app/components/ui/rating/index.tsx
import { Star } from 'lucide-react';
import React from 'react';
import { cn } from '../../../lib/utils'; // cn ユーティリティをインポート

interface RatingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  textColor?: string;
  className?: string;
  color?: string;
}

export function Rating({ score, size = 'md', className, color = '#fbbf24' }: RatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={cn('flex gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            sizeClasses[size],
            'transition-colors',
            value <= score
              ? 'fill-current text-current'
              : 'fill-gray-200'
          )}
          style={{ color: value <= score ? color : undefined }}
        />
      ))}
    </div>
  );
}