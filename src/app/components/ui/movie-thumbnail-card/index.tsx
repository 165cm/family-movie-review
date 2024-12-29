'use client';
// src/app/components/ui/movie-thumbnail-card/index.tsx
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
    
    // 10点満点から5点満点に変換し、0.5単位で四捨五入
    const rawScore = scores.reduce((a, b) => a + b, 0) / scores.length / 2;
    return Math.round(rawScore * 2) / 2;
  };


export function MovieThumbnailCard({ movie, className = '' }: MovieThumbnailCardProps) {
    const score = calculateAverageScore(movie);
  
    return (
      <Link href={`/movies/${movie.slug}`}>
        <div className={`group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl ${className}`}>
          {/* サムネイル画像 */}
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            <Image
              src={getYoutubeThumbnail(movie.viewingUrl ? extractYoutubeId(movie.viewingUrl) || undefined : undefined)}
              alt={movie.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* スコアオーバーレイ */}
            <div className="absolute top-0 right-0 p-2 bg-black/50 rounded-bl">
              <Rating score={score} size="sm" showScore textColor="text-white" />
            </div>
          </div>
  
          {/* コンテンツ */}
          <div className="p-4">
            <h3 className="mb-2 text-xl font-semibold line-clamp-2">{movie.name}</h3>
            
            <p className="mb-4 text-sm text-gray-600 line-clamp-2">
              {movie.synopsis}
            </p>
  
            <div className="mb-4 flex gap-2 flex-wrap">
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