// src/app/components/MovieGridWithFilters/index.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { MovieGrid } from '@/app/components/ui/movie-grid';
import { MovieFilterFooter } from '../MovieFilterFooter';
import { Movie } from '@/types/movie';
import { sortMovies } from '@/app/lib/filters/utils';
import { SortOption } from '@/app/lib/filters/types';
import { useDebounce } from '@/app/hooks/useDebounce';
import { useFilterParams } from '@/app/hooks/useFilterParams';

interface MovieGridWithFiltersProps {
  movies: Movie[];
  initialChunkSize?: number;
}

// 表示件数の定数を統一
const LOAD_INCREMENT = 15; // PCでもモバイルでも15件ずつ表示

const formatTotalCount = (count: number) => {
  if (count > 100) {
    return '100件以上';
  }
  return `${count}件`;
};

export const MovieGridWithFilters: React.FC<MovieGridWithFiltersProps> = ({ 
  movies 
}) => {
  const { getFiltersFromUrl, updateFilters } = useFilterParams();
  const initialFilters = getFiltersFromUrl();
  
  const [sortBy, setSortBy] = useState<SortOption>(initialFilters.sortBy);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search);
  const [displayCount, setDisplayCount] = useState(LOAD_INCREMENT);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // フィルタリング処理
  const filteredMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    
    let result = [...movies];
    
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(movie => 
        movie.name.toLowerCase().includes(term) ||
        movie.director.toLowerCase().includes(term) ||
        (movie.cast && movie.cast.some(actor => 
          actor.toLowerCase().includes(term)
        ))
      );
    }

    return sortMovies(result, sortBy);
  }, [movies, debouncedSearchTerm, sortBy]);

  // 表示する映画を制限
  const displayedMovies = useMemo(() => {
    return filteredMovies.slice(0, displayCount);
  }, [filteredMovies, displayCount]);

  // さらに読み込む処理
  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => Math.min(prev + LOAD_INCREMENT, filteredMovies.length));
  }, [filteredMovies.length]);

  // 検索処理
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setDisplayCount(LOAD_INCREMENT); // 検索時は表示件数をリセット
    updateFilters({
      search: term,
      sortBy,
      tags: initialFilters.tags
    });
  }, [sortBy, initialFilters.tags, updateFilters]);

  // ソート処理
  const handleSort = useCallback((option: SortOption) => {
    setSortBy(option);
    setDisplayCount(LOAD_INCREMENT); // ソート時は表示件数をリセット
    updateFilters({
      search: searchTerm,
      sortBy: option,
      tags: initialFilters.tags
    });
  }, [searchTerm, initialFilters.tags, updateFilters]);

  if (filteredMovies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          該当する映画が見つかりませんでした。
        </p>
      </div>
    );
  }

  const hasMore = displayedMovies.length < filteredMovies.length;
  const remainingCount = filteredMovies.length - displayedMovies.length;
  const nextLoadCount = Math.min(LOAD_INCREMENT, remainingCount);

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        {debouncedSearchTerm ? (
          `${filteredMovies.length}件が見つかりました`
        ) : (
          `${formatTotalCount(filteredMovies.length)}以上から${displayedMovies.length}件を表示`
        )}
      </div>

      <MovieGrid movies={displayedMovies} />
      
      {/* もっと見るボタン */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            さらに{nextLoadCount}件を表示
          </button>
        </div>
      )}

      <div className="pb-24">
        <MovieFilterFooter
          onSearch={handleSearch}
          onSort={handleSort}
          currentSort={sortBy}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};