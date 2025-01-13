// src/app/components/ui/movie-grid/index.tsx
import React from 'react';
import { Movie } from '@/types/movie';
import { MovieThumbnailCard } from '../movie-thumbnail-card';

interface MovieGridProps {
  movies: Movie[];
  className?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {movies.map((movie) => (
        <MovieThumbnailCard 
          key={movie.id} 
          movie={movie} 
        />
      ))}
    </div>
  );
};