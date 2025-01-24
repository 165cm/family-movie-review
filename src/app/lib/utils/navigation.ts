// src/app/lib/utils/navigation.ts

import { Movie, MovieListItem } from '@/types/movie';
import { SortOption } from '@/app/lib/filters/types';
import { FamilyMember } from '@/types/family';

export function sortMoviesByOption(movies: MovieListItem[], sortOption: SortOption): MovieListItem[] {
  const sorted = [...movies].sort((a, b) => {
    switch (sortOption) {
      case 'fatherScore':
        return b.familyScores.father - a.familyScores.father;
      case 'motherScore':
        return b.familyScores.mother - a.familyScores.mother;
      case 'bigSisterScore':
        return b.familyScores.bigSister - a.familyScores.bigSister;
      case 'littleSisterScore':
        return b.familyScores.littleSister - a.familyScores.littleSister;
      default:
        return b.totalScore - a.totalScore;
    }
  });
  return sorted;
}

export function getFilteredMovies(
  movies: MovieListItem[], 
  filters: {
    genre?: string;
    recommendedBy?: FamilyMember;
  }
): MovieListItem[] {
  let filtered = movies;

  if (filters.genre) {
    filtered = filtered.filter(movie => movie.genre === filters.genre);
  }

  if (filters.recommendedBy) {
    filtered = filtered.filter(movie => 
      movie.recommendedBy.includes(filters.recommendedBy!)
    );
  }

  return filtered;
}

export function getAdjacentMovies(
  currentMovie: Movie, 
  allMovies: MovieListItem[], 
  sort: SortOption,
  filters: {
    genre?: string;
    recommendedBy?: FamilyMember;
  }
) {
  // フィルタリングとソートを適用
  const filteredMovies = getFilteredMovies(allMovies, filters);
  const sortedMovies = sortMoviesByOption(filteredMovies, sort);
  
  // 現在の映画のインデックスを取得
  const currentIndex = sortedMovies.findIndex(m => m.slug === currentMovie.slug);

  return {
    prevMovie: currentIndex > 0 ? sortedMovies[currentIndex - 1] : null,
    nextMovie: currentIndex < sortedMovies.length - 1 ? sortedMovies[currentIndex + 1] : null,
    currentIndex,
    totalCount: sortedMovies.length,
    // フィルタリング情報を追加
    filterInfo: {
      genre: filters.genre,
      recommendedBy: filters.recommendedBy
    }
  };
}