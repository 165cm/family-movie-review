// src/app/components/MovieCard.tsx
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import { MovieListItem } from '@/types/movie';

export default function MovieCard({ movie }: { movie: MovieListItem }) {
  return (
    <Link href={`/movies/${movie.slug}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold text-gray-900 line-clamp-2">
              {movie.name}
            </h2>
            {movie.isBest5 && (
              <span className="bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                BEST5
              </span>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <time dateTime={movie.watchedDate}>
                {new Date(movie.watchedDate).toLocaleDateString('ja-JP')}
              </time>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-semibold">{movie.totalScore}点</span>
              </div>
              <span className="text-sm text-gray-600">
                {movie.viewingPlatform}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}