// src/app/components/GenreTagCloud/index.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

// タグの型を定義
type GenreTag = {
  name: string | null;
  count: number;
  label?: string;
};

interface GenreTagCloudProps {
  genres: Array<{
    name: string;
    count: number;
  }>;
  selectedGenre?: string;
  totalCount: number;
}

export const GenreTagCloud: React.FC<GenreTagCloudProps> = ({
  genres,
  selectedGenre,
  totalCount
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams() ?? new URLSearchParams();

  const createQueryString = (name: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    
    if (name === null) {
      current.delete('genre');
    } else {
      current.set('genre', name);
    }
    const search = current.toString();
    return search ? `?${search}` : '';
  };

  // 型安全な配列の作成
  const allTags: GenreTag[] = [
    { name: null, count: totalCount, label: 'すべて表示' },
    ...genres.map(genre => ({
      name: genre.name,
      count: genre.count
    }))
  ];

  return (
    <div className="mb-6">
      <div className="text-sm text-gray-600 mb-3">
        全{totalCount}件の映画
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = tag.name === selectedGenre || (tag.name === null && !selectedGenre);
          const displayText = tag.label ?? tag.name;
          
          return (
            <Link
              key={tag.name ?? 'all'}
              href={`${pathname}${createQueryString(tag.name)}`}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-colors duration-200
                ${isSelected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {displayText}
              <span className="ml-2 text-xs opacity-70">({tag.count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};