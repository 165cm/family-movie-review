// src/app/components/GenreTagCloud/index.tsx
'use client';

import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

// 型定義の修正
type GenreTag = {
  name: string | null;
  count: number;
  label?: string;
  type?: 'genre' | 'recommendation';
  member?: string;
};

interface GenreTagCloudProps {
  genres: Array<{
    name: string;
    count: number;
  }>;
  selectedGenre?: string;
  totalCount: number;
  recommendationCounts: {
    father: number;
    mother: number;
    bigSister: number;
    littleSister: number;
  };
  onFilterChange?: (params: { type: 'genre' | 'recommendation', value: string | null, member?: string }) => void;
}

export const GenreTagCloud: React.FC<GenreTagCloudProps> = ({
  genres,
  selectedGenre,
  totalCount,
  recommendationCounts,
  onFilterChange
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URLパラメータ生成ロジックをメモ化
  const createQueryString = useCallback((params: { 
    name: string | null; 
    type: 'genre' | 'recommendation'; 
    member?: string 
  }) => {
    const current = new URLSearchParams();
    
    // 既存のパラメータをコピー
    if (searchParams) {
      searchParams.forEach((value, key) => {
        current.append(key, value);
      });
    }
    
    if (params.type === 'genre') {
      current.delete('recommendedBy'); // おすすめフィルターをクリア
      if (params.name === null) {
        current.delete('genre');
      } else {
        current.set('genre', params.name);
      }
    } else if (params.type === 'recommendation') {
      current.delete('genre'); // ジャンルフィルターをクリア
      if (params.name === null) {
        current.delete('recommendedBy');
      } else {
        current.set('recommendedBy', params.member!);
      }
    }
    
    const queryString = current.toString();
    return queryString ? `?${queryString}` : '';
  }, [searchParams]);

  // タグリストをメモ化
  const allTags: GenreTag[] = useMemo(() => [
    { name: null, count: totalCount, label: 'すべて', type: 'genre' },
    ...genres.map(genre => ({
      name: genre.name,
      count: genre.count,
      type: 'genre' as const
    })),
    { 
      name: 'father', 
      count: recommendationCounts.father,
      label: '父オシ！',
      type: 'recommendation',
      member: 'father'
    },
    { 
      name: 'mother', 
      count: recommendationCounts.mother,
      label: '母オシ！',
      type: 'recommendation',
      member: 'mother'
    },
    { 
      name: 'bigSister', 
      count: recommendationCounts.bigSister,
      label: '姉オシ！',
      type: 'recommendation',
      member: 'bigSister'
    },
    { 
      name: 'littleSister', 
      count: recommendationCounts.littleSister,
      label: '妹オシ！',
      type: 'recommendation',
      member: 'littleSister'
    }
  ], [genres, totalCount, recommendationCounts]);

  const selectedMember = searchParams?.get('recommendedBy') || null;

  // タグクリック時のハンドラー
  const handleTagClick = useCallback((tag: GenreTag) => {
    if (onFilterChange) {
      onFilterChange({
        type: tag.type!,
        value: tag.name,
        member: tag.member
      });
    }
  }, [onFilterChange]);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => {
          const isSelected = 
            (tag.type === 'genre' && tag.name === selectedGenre && !selectedMember) || 
            (tag.type === 'genre' && tag.name === null && !selectedGenre && !selectedMember) ||
            (tag.type === 'recommendation' && tag.member === selectedMember);
          
          const displayText = tag.label ?? tag.name;
          const href = `${pathname}${createQueryString({ 
            name: tag.name, 
            type: tag.type!, 
            member: tag.member 
          })}`;
          
          return (
            <Link
              key={`${tag.type}-${tag.name ?? 'all'}`}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                handleTagClick(tag);
                window.history.pushState({}, '', href);
              }}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                transition-colors duration-200
                ${isSelected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {displayText}
              <span className="ml-1 text-xs opacity-70">({tag.count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};