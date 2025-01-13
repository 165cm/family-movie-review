// src/app/hooks/useInfiniteScroll.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { Movie } from '@/types/movie';

export const useInfiniteScroll = (movies: Movie[], initialChunkSize: number = 30) => {
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(initialChunkSize);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初期表示分を設定
    setDisplayedMovies(movies.slice(0, initialChunkSize));
    setHasMore(movies.length > initialChunkSize);
  }, [movies, initialChunkSize]);

  useEffect(() => {
    const loadMore = () => {
      setIsLoading(true);
      setTimeout(() => {
        const nextIndex = currentIndex + initialChunkSize;
        const newMovies = movies.slice(0, nextIndex);
        setDisplayedMovies(newMovies);
        setCurrentIndex(nextIndex);
        setHasMore(nextIndex < movies.length);
        setIsLoading(false);
      }, 500); // ローディング表示のための遅延
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [currentIndex, hasMore, isLoading, movies, initialChunkSize]);

  return {
    displayedMovies,
    isLoading,
    hasMore,
    loaderRef
  };
};