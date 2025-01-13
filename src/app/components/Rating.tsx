// src/app/components/Rating.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({ score, size = 'md' }: RatingProps) {
  const starCount = Math.round(score / 2);  // 10点満点を5段階に変換
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex gap-1" role="img" aria-label={`${score}点（5段階中${starCount}）`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          strokeWidth={0.5} // 線の太さを細くする（デフォルトは2）
          className={`${sizeClasses[size]} ${
            i < starCount 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-gray-100 text-gray-100 opacity-100' // 不透明度を追加
          }`}
        />
      ))}
    </div>
  );
}