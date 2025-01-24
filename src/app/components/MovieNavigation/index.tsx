// src/app/components/MovieNavigation/index.tsx
'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieListItem } from '@/types/movie';
import { FamilyMember } from '@/types/family';
import { FAMILY_MEMBERS } from '@/constants/family';

interface MovieNavigationProps {
  prevMovie: MovieListItem | null;
  nextMovie: MovieListItem | null;
  currentIndex: number;
  totalCount: number;
  currentSort: string;
  filterInfo: {
    genre?: string;
    recommendedBy?: FamilyMember;
  };
}

export function MovieNavigation({
  prevMovie,
  nextMovie,
  currentIndex,
  totalCount,
  currentSort,
  filterInfo
}: MovieNavigationProps) {
  // フィルタリング情報をURLパラメータに変換
  const getNavigationUrl = (movie: MovieListItem) => {
    const params = new URLSearchParams();
    params.set('sort', currentSort);
    if (filterInfo.genre) {
      params.set('genre', filterInfo.genre);
    }
    if (filterInfo.recommendedBy) {
      params.set('recommendedBy', filterInfo.recommendedBy);
    }
    return `/movies/${movie.slug}?${params.toString()}`;
  };

  // フィルタリング情報の表示テキストを生成
  const getFilterText = () => {
    const filters = [];
    if (filterInfo.genre) {
      filters.push(`ジャンル: ${filterInfo.genre}`);
    }
    if (filterInfo.recommendedBy) {
      const member = FAMILY_MEMBERS.find(m => m.id === filterInfo.recommendedBy);
      if (member) {
        filters.push(`おすすめ: ${member.displayName}`);
      }
    }
    return filters.length > 0 ? `(${filters.join(', ')})` : '';
  };

  return (
    <div className="flex items-center justify-between py-4 px-6">
      <div className="flex-1">
        {prevMovie ? (
          <Link
            href={getNavigationUrl(prevMovie)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">{prevMovie.name}</span>
          </Link>
        ) : (
          <span className="text-gray-400">前の映画はありません</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{currentIndex + 1} / {totalCount}</span>
        <span>{getFilterText()}</span>
      </div>

      <div className="flex-1 text-right">
        {nextMovie ? (
          <Link
            href={getNavigationUrl(nextMovie)}
            className="flex items-center justify-end text-blue-600 hover:text-blue-800"
          >
            <span className="mr-1">{nextMovie.name}</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <span className="text-gray-400">次の映画はありません</span>
        )}
      </div>
    </div>
  );
}