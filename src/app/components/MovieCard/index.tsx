// src/app/components/MovieCard/index.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MovieListItem } from '@/types/movie';
import { Rating } from '@/app/components/ui/rating';
import { calculateTotalScore } from '@/app/lib/utils/score';
import { getYoutubeThumbnail, extractYoutubeId } from '@/app/lib/utils/youtube';
import { FamilyScore } from '../FamilyScore';

export type MovieCardVariant = 'thumbnail' | 'recommended' | 'compact';

interface MovieCardProps {
  movie: MovieListItem;
  variant?: MovieCardVariant;
  className?: string;
  showFamilyScores?: boolean;
}

export function MovieCard({ 
  movie, 
  variant = 'thumbnail',
  className = '',
  showFamilyScores = true
}: MovieCardProps) {
  const { displayScore, starRating } = calculateTotalScore(movie.familyScores);

  return (
    <Link href={`/movies/${movie.slug}`}>
      <div className={`
        group relative bg-white rounded-lg shadow-md 
        hover:shadow-xl transition-all duration-300
        ${variant === 'compact' ? 'flex gap-4' : ''}
        ${className}
      `}>
        {/* サムネイル */}
        <div className={`
          relative overflow-hidden rounded-t-lg bg-gray-100
          ${variant === 'compact' ? 'w-32 rounded-l-lg rounded-t-none' : 'w-full'}
          aspect-video
        `}>
          <Image
            src={getYoutubeThumbnail(movie.viewingUrl ? extractYoutubeId(movie.viewingUrl) || undefined : undefined)}
            alt={movie.name}
            fill
            className="object-cover"
            sizes={variant === 'compact' ? '8rem' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* タイトルとスコア */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className={`
              font-bold text-white mb-2 line-clamp-2
              ${variant === 'compact' ? 'text-base' : 'text-xl'}
            `}>
              {movie.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{displayScore}</span>
              <Rating score={starRating} size="sm" />
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <div className={`
          ${variant === 'compact' ? 'flex-1 py-2 pr-4' : 'p-4'}
        `}>
          {variant !== 'compact' && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {movie.synopsis}
            </p>
          )}

          {/* メタ情報 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.check && (
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${movie.check === '家族OK' ? 'bg-green-100 text-green-800' : 
                  movie.check === '気まずい' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}
              `}>
                {movie.check}
              </span>
            )}
            {movie.isBest5 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                BEST5
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {movie.genre}
            </span>
          </div>

          {/* 家族スコア */}
          {showFamilyScores && (
            <div className={`
              grid gap-2
              ${variant === 'compact' ? 'grid-cols-1' : 'grid-cols-2'}
            `}>
              <FamilyScore 
                scores={movie.familyScores}
                variant={variant === 'compact' ? 'compact' : 'default'}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}