// src/app/hooks/useFilterParams.ts
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MovieFilters, SortOption } from '@/app/lib/filters/types';

export const useFilterParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getFiltersFromUrl = useCallback((): MovieFilters => {
    return {
      search: searchParams.get('q') || '',
      sortBy: (searchParams.get('sort') as SortOption) || 'totalScore', // 'latest' から 'totalScore' に変更
      tags: {
        director: searchParams.get('director'),
        screenwriter: searchParams.get('screenwriter'),
        cast: searchParams.get('cast')
      }
    };
  }, [searchParams]);

  const updateFilters = useCallback((filters: MovieFilters) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('q', filters.search);
    if (filters.sortBy !== 'totalScore') params.set('sort', filters.sortBy); // デフォルト値を 'totalScore' に変更
    
    Object.entries(filters.tags).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`?${params.toString()}`);
  }, [router]);

  return {
    getFiltersFromUrl,
    updateFilters
  };
};