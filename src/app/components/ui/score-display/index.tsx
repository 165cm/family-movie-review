// src/app/components/ui/score-display/index.tsx
import React from 'react';
import { Rating } from '../rating';
import { cn } from '@/app/lib/utils';

interface ScoreDisplayProps {
  displayScore: number;
  starRating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStars?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  displayScore,
  starRating,
  size = 'md',
  className,
  showStars = true
}) => {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-2',
    lg: 'text-lg gap-3'
  };

  return (
    <div className={cn(
      'flex items-center',
      sizeClasses[size],
      className
    )}>
      <span className="font-bold text-yellow-500">
        {displayScore}
      </span>
      {showStars && (
        <Rating 
          score={starRating} 
          size={size} 
          className="translate-y-[1px]" 
        />
      )}
    </div>
  );
};