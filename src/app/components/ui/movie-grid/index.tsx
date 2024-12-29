// src/components/ui/movie-grid/index.tsx
import React from 'react';
import { MovieListItem } from '@/types/movie';
import { MovieThumbnailCard } from '../movie-thumbnail-card';

export interface MovieGridProps {
  movies: MovieListItem[];
  className?: string;
}

export function MovieGrid({ movies, className = '' }: MovieGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {movies.map((movie) => (
        <MovieThumbnailCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}