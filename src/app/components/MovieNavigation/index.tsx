// src/app/components/MovieNavigation/index.tsx
'use client';

import React, { JSX } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Movie } from '@/types/movie';
import { useSwipeable } from 'react-swipeable';

interface MovieNavigationProps {
  currentMovie: Movie;
  prevMovie?: { slug: string; name: string } | null;
  nextMovie?: { slug: string; name: string } | null;
  currentSort: string;
  searchParams: { [key: string]: string | string[] | undefined };
  currentIndex: number;
  totalCount: number;
}

export function MovieNavigation({ 
  prevMovie, 
  nextMovie,
  searchParams,
  currentIndex,
  totalCount
}: MovieNavigationProps): JSX.Element {
  // フィルタリングパラメータを生成
  const filterParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => filterParams.append(key, v));
      } else {
        filterParams.append(key, value);
      }
    }
  });

  const listPageUrl = `/movies?${filterParams.toString()}`;
  const genre = searchParams.genre as string;
  const contextLabel = genre ? `${genre}作品` : '全作品';

  // スワイプハンドラーの修正
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextMovie) {
        window.location.href = `/movies/${nextMovie.slug}?${filterParams.toString()}`;
      }
    },
    onSwipedRight: () => {
      if (prevMovie) {
        window.location.href = `/movies/${prevMovie.slug}?${filterParams.toString()}`;
      }
    },
    trackMouse: true
  });

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t md:relative md:border-t-0 z-50"
      {...handlers}
    >
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* 前の作品 */}
          <div className="flex-1">
            {prevMovie ? (
              <Link 
                href={`/movies/${prevMovie.slug}?${filterParams.toString()}`}
                className="group flex items-center gap-2 hover:text-blue-600"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="hidden md:inline text-sm truncate">{prevMovie.name}</span>
              </Link>
            ) : (
              <div className="w-5 h-5" /> // スペーサー
            )}
          </div>

          {/* 中央の情報 */}
          <div className="flex flex-col items-center min-w-0">
            <Link 
              href={listPageUrl}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap"
            >
              {contextLabel}一覧に戻る
            </Link>
            <div className="text-xs text-gray-500 mt-1">
              {currentIndex + 1} / {totalCount}作品
            </div>
          </div>

          {/* 次の作品 */}
          <div className="flex-1 flex justify-end">
            {nextMovie ? (
              <Link 
                href={`/movies/${nextMovie.slug}?${filterParams.toString()}`}
                className="group flex items-center gap-2 hover:text-blue-600 text-right"
              >
                <span className="hidden md:inline text-sm truncate">{nextMovie.name}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div className="w-5 h-5" /> // スペーサー
            )}
          </div>
        </div>
      </div>
    </div>
  );
}