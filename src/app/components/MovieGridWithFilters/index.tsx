// src/app/components/MovieGridWithFilters/index.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { MovieGrid } from '@/app/components/ui/movie-grid';
import { MovieFilterFooter } from '../MovieFilterFooter';
import { Movie } from '@/types/movie';
import { sortMovies } from '@/app/lib/filters/utils';
import { SortOption } from '@/app/lib/filters/types';

interface MovieGridWithFiltersProps {
  movies: Movie[];
}

export const MovieGridWithFilters: React.FC<MovieGridWithFiltersProps> = ({
  movies
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('totalScore');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);

  // 検索とソートの処理
  useEffect(() => {
    let result = [...movies];
    
    // 検索処理
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(movie => 
        movie.name.toLowerCase().includes(term)
      );
    }

    // ソート処理
    result = sortMovies(result, sortBy);
    setFilteredMovies(result);
  }, [movies, searchTerm, sortBy]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSort = useCallback((option: SortOption) => {
    setSortBy(option);
  }, []);

  return (
    <div className="relative min-h-screen pb-24">
      <MovieGrid movies={filteredMovies} />
      <MovieFilterFooter
        onSearch={handleSearch}
        onSort={handleSort}
      />
    </div>
  );
};