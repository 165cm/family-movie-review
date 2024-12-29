'use client';
// src/app/components/ui/movie-card/index.tsx
import React from 'react';
import Image from 'next/image';
import { MovieListItem } from '@/types/movie';
import { getYoutubeThumbnail, extractYoutubeId } from '@/app/lib/utils/youtube';
import Link from 'next/link';

export interface MovieCardProps {
  movie: MovieListItem;
  className?: string;
}

export function MovieCard({ movie, className = '' }: MovieCardProps) {
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex justify-between text-white">
              <span className="text-lg font-bold">総合評価</span>
              <span className="text-xl font-bold">{movie.totalScore}点</span>
            </div>
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
            <FamilyScore label="父" score={movie.familyScores.father} className="family-score-father" />
            <FamilyScore label="母" score={movie.familyScores.mother} className="family-score-mother" />
            <FamilyScore label="姉" score={movie.familyScores.bigSister} className="family-score-big-sister" />
            <FamilyScore label="妹" score={movie.familyScores.littleSister} className="family-score-little-sister" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function FamilyScore({ label, score, className = '' }: { label: string; score: number; className?: string }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded bg-gray-50 ${className}`}>
      <span className="font-medium">{label}</span>
      <span className="text-lg font-bold">{score}点</span>
    </div>
  );
}