// src/app/components/MovieList/index.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Movie } from '@/types/movie';
import { MovieGridWithFilters } from '../MovieGridWithFilters';
import { GenreTagCloud } from '../GenreTagCloud';

interface MovieListProps {
  initialMovies: Movie[];
  genres: Array<{ name: string; count: number }>;
  recommendationCounts: {
    father: number;
    mother: number;
    bigSister: number;
    littleSister: number;
  };
  selectedGenre?: string;
}// ...前のインポート部分は同じ

export const MovieList = ({
  initialMovies,
  genres,
  recommendationCounts,
  selectedGenre,
}: MovieListProps): React.ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(initialMovies);

  // フィルタリングロジック
  const applyFilters = React.useCallback(() => {
    let results = [...initialMovies];
    const genre = searchParams?.get('genre') || null;
    const recommendedBy = searchParams?.get('recommendedBy') || null;

    if (genre) {
      results = results.filter(movie => movie.genre === genre);
    }
    if (recommendedBy) {
      results = results.filter(movie => movie.recommendedBy.includes(recommendedBy));
    }

    setFilteredMovies(results);
  }, [initialMovies, searchParams]);

  // URLパラメータが変更されたときにフィルタリングを適用
  useEffect(() => {
    applyFilters();
  }, [applyFilters, searchParams]);

  // フィルター変更時の処理
  const handleFilterChange = React.useCallback(({ type, value, member }: { 
    type: 'genre' | 'recommendation';
    value: string | null;
    member?: string;
  }) => {
    // 新しいURLSearchParamsインスタンスを作成
    const params = new URLSearchParams();
    
    // 既存のパラメータをコピー（searchParamsがnullの場合は空のままにする）
    if (searchParams) {
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
    }

    if (type === 'genre') {
      params.delete('recommendedBy');
      if (value) {
        params.set('genre', value);
      } else {
        params.delete('genre');
      }
    } else if (type === 'recommendation' && member) {
      params.delete('genre');
      if (value) {
        params.set('recommendedBy', member);
      } else {
        params.delete('recommendedBy');
      }
    }

    // クライアントサイドナビゲーション
    const queryString = params.toString();
    const newPath: string = queryString ? `${pathname ?? ''}?${queryString}` : pathname ?? '';
    router.push(newPath);
  }, [router, pathname, searchParams]);

  return (
    <>
      <GenreTagCloud 
        genres={genres}
        selectedGenre={selectedGenre}
        totalCount={initialMovies.length}
        recommendationCounts={recommendationCounts}
        onFilterChange={handleFilterChange}
      />
      <MovieGridWithFilters movies={filteredMovies} />
    </>
  );
};