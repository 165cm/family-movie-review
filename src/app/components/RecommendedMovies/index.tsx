// src/app/components/RecommendedMovies/index.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, MovieListItem } from '@/types/movie';
import { calculateTotalScore, formatIndividualScore } from '@/app/lib/utils/score';
import { Rating } from '@/app/components/ui/rating';
import { getYoutubeThumbnail, extractYoutubeId } from '@/app/lib/utils/youtube';

interface RecommendedMoviesProps {
  currentMovie: Movie;
  recommendedMovies: MovieListItem[];
}

function FamilyScore({ label, score }: { label: string; score: number }) {
  const { displayScore, starRating } = formatIndividualScore(score);
  return (
    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm">{displayScore}</span>
        <Rating score={starRating} size="sm" />
      </div>
    </div>
  );
}

export function RecommendedMovies({ recommendedMovies }: RecommendedMoviesProps) {
  return (
    <div className="mt-12 max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">こんな映画も観てみませんか？</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedMovies.map((movie) => {
          const { displayScore, starRating } = calculateTotalScore(movie.familyScores);
          return (
            <Link 
              key={movie.id} 
              href={`/movies/${movie.slug}`}
            >
              <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                {/* サムネイル部分 */}
                <div className="relative w-full aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                  <Image
                    src={getYoutubeThumbnail(movie.viewingUrl ? extractYoutubeId(movie.viewingUrl) || undefined : undefined)}
                    alt={movie.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
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
                        ${movie.check === 'OK' ? 'bg-green-100 text-green-800' : 
                          movie.check === '気まずい' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {movie.check}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {movie.genre}
                    </span>
                  </div>
                  {/* 家族スコア */}
                  <div className="grid grid-cols-2 gap-2">
                    <FamilyScore label="父" score={movie.familyScores.father} />
                    <FamilyScore label="母" score={movie.familyScores.mother} />
                    <FamilyScore label="姉" score={movie.familyScores.bigSister} />
                    <FamilyScore label="妹" score={movie.familyScores.littleSister} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}