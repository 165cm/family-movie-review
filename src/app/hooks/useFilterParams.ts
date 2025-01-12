// src/app/hooks/useFilterParams.ts
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MovieFilters, SortOption } from '@/app/lib/filters/types';

export const useFilterParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getFiltersFromUrl = useCallback((): MovieFilters => {
    // searchParamsが存在しない場合のデフォルト値を設定
    if (!searchParams) {
      return {
        search: '',
        sortBy: 'totalScore',
        tags: {
          director: null,
          screenwriter: null,
          cast: null
        }
      };
    }

    // 型安全な方法でパラメータを取得
    const sortParam = searchParams.get('sort');
    const isValidSortOption = (sort: string | null): sort is SortOption => {
      return sort === 'totalScore' || 
             sort === 'fatherScore' || 
             sort === 'motherScore' || 
             sort === 'bigSisterScore' || 
             sort === 'littleSisterScore';
    };

    return {
      search: searchParams.get('q') ?? '',
      sortBy: isValidSortOption(sortParam) ? sortParam : 'totalScore',
      tags: {
        director: searchParams.get('director'),
        screenwriter: searchParams.get('screenwriter'),
        cast: searchParams.get('cast')
      }
    };
  }, [searchParams]);

  const updateFilters = useCallback((filters: MovieFilters) => {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.set('q', filters.search);
    }
    
    if (filters.sortBy !== 'totalScore') {
      params.set('sort', filters.sortBy);
    }
    
    // tagsのnull安全な処理
    Object.entries(filters.tags).forEach(([key, value]) => {
      if (value !== null) {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`);
  }, [router]);

  return {
    getFiltersFromUrl,
    updateFilters
  };
};