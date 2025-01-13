// src/app/components/ui/movie-thumbnail-card/index.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { MovieListItem } from '@/types/movie';
import { getYoutubeThumbnail, extractYoutubeId } from '@/app/lib/utils/youtube';
import { Rating } from '@/app/components/ui/rating';
import Link from 'next/link';

export interface MovieThumbnailCardProps {
  movie: MovieListItem;
  className?: string;
}

const calculateAverageScore = (movie: MovieListItem): number => {
  const scores = [
    movie.familyScores.father,
    movie.familyScores.mother,
    movie.familyScores.bigSister,
    movie.familyScores.littleSister
  ].filter((score): score is number => typeof score === 'number' && !isNaN(score));
  
  if (!scores.length) return 0;
  
  const rawScore = scores.reduce((a, b) => a + b, 0) / scores.length / 2;
  return Math.round(rawScore * 2) / 2;
};

export function MovieThumbnailCard({ movie, className = '' }: MovieThumbnailCardProps) {
  const score = calculateAverageScore(movie);

  return (
    <Link href={`/movies/${movie.slug}`}>
      <div className={`group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${className}`}>
        {/* サムネイル部分 */}
        <div className="relative w-full aspect-video overflow-hidden rounded-t-lg bg-gray-100">
          <Image
            src={getYoutubeThumbnail(movie.viewingUrl ? extractYoutubeId(movie.viewingUrl) || undefined : undefined)}
            alt={movie.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {movie.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= score ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-medium">{score.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* コンテンツ部分 */}
        <div className="p-4">
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {movie.synopsis}
          </p>

          {/* メタ情報 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.check && (
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${movie.check === 'OK' ? 'bg-green-100 text-green-800' : 
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
              {movie.viewingPlatform}
            </span>
          </div>

          {/* 家族スコア */}
          <div className="grid grid-cols-2 gap-2">
            <FamilyScore label="父" score={movie.familyScores.father / 2} />
            <FamilyScore label="母" score={movie.familyScores.mother / 2} />
            <FamilyScore label="姉" score={movie.familyScores.bigSister / 2} />
            <FamilyScore label="妹" score={movie.familyScores.littleSister / 2} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function FamilyScore({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
      <span className="font-medium">{label}</span>
      <Rating score={score} size="sm" />
    </div>
  );
}