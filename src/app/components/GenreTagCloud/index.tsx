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
}

export const GenreTagCloud: React.FC<GenreTagCloudProps> = ({
  genres,
  selectedGenre,
  totalCount,
  recommendationCounts
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (params: { name: string | null; type: 'genre' | 'recommendation'; member?: string }) => {
    const current = new URLSearchParams();
    
    // 既存のパラメータをコピー
    searchParams?.forEach((value, key) => {
      current.append(key, value);
    });
    
    if (params.type === 'genre') {
      if (params.name === null) {
        current.delete('genre');
      } else {
        current.set('genre', params.name);
      }
      // ジャンル選択時はおすすめフィルターをクリア
      current.delete('recommendedBy');
    } else if (params.type === 'recommendation') {
      if (params.name === null) {
        current.delete('recommendedBy');
      } else {
        current.set('recommendedBy', params.member!);
      }
      // おすすめ選択時はジャンルフィルターをクリア
      current.delete('genre');
    }
    
    const search = current.toString();
    return search ? `?${search}` : '';
  };

  // 型安全な配列の作成
  const allTags: GenreTag[] = [
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
  ];

  const selectedMember = searchParams?.get('recommendedBy') || null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => {
          const isSelected = 
            (tag.type === 'genre' && tag.name === selectedGenre && !selectedMember) || 
            (tag.type === 'genre' && tag.name === null && !selectedGenre && !selectedMember) ||
            (tag.type === 'recommendation' && tag.member === selectedMember);
          
          const displayText = tag.label ?? tag.name;
          
          return (
            <Link
              key={`${tag.type}-${tag.name ?? 'all'}`}
              href={`${pathname}${createQueryString({ 
                name: tag.name, 
                type: tag.type!, 
                member: tag.member 
              })}`}
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