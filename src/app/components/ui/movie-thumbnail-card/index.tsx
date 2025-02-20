// src/app/components/ui/movie-thumbnail-card/index.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { MovieListItem } from '@/types/movie';
import { getYoutubeThumbnail, extractYoutubeId } from '@/app/lib/utils/youtube';
import { Rating } from '@/app/components/ui/rating';
import Link from 'next/link';
import { calculateTotalScore, formatIndividualScore } from '@/app/lib/utils/score';

export interface MovieThumbnailCardProps {
  movie: MovieListItem;
  className?: string;
}

export function MovieThumbnailCard({ movie, className = '' }: MovieThumbnailCardProps) {
  const { displayScore, starRating } = calculateTotalScore(movie.familyScores);

  const getRecommendationBadges = () => {
    const badges = [];
    
    if (movie.recommendedBy.includes('father')) {
      badges.push(
        <span key="father" className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          父オシ！
        </span>
      );
    }
    if (movie.recommendedBy.includes('mother')) {
      badges.push(
        <span key="mother" className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          母オシ！
        </span>
      );
    }
    if (movie.recommendedBy.includes('bigSister')) {
      badges.push(
        <span key="bigSister" className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          姉オシ！
        </span>
      );
    }
    if (movie.recommendedBy.includes('littleSister')) {
      badges.push(
        <span key="littleSister" className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
          妹オシ！
        </span>
      );
    }
    
    return badges;
  };

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
              <span className="text-white font-medium">{displayScore}</span>
              <Rating score={starRating} size="sm" />
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
                ${movie.check === '家族OK' ? 'bg-green-100 text-green-800' : 
                  movie.check === '気まずい' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}
              `}>
                {movie.check}
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {movie.genre}
            </span>
            {/* 家族メンバーごとのおすすめバッジ */}
            {getRecommendationBadges()}
          </div>

          {/* 家族スコア - コンパクト表示 */}
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <CompactFamilyScore label="父" score={movie.familyScores.father} />
            <CompactFamilyScore label="母" score={movie.familyScores.mother} />
            <CompactFamilyScore label="姉" score={movie.familyScores.bigSister} />
            <CompactFamilyScore label="妹" score={movie.familyScores.littleSister} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompactFamilyScore({ label, score }: { label: string; score: number }) {
  const { displayScore } = formatIndividualScore(score);
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-bold">{displayScore}</span>
    </div>
  );
}