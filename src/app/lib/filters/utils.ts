// src/app/lib/filters/utils.ts
import { Movie } from '@/types/movie';
import { SortOption } from './types';

// スコアの計算ヘルパー関数
const calculateTotalScore = (familyScores: Movie['familyScores']): number => {
  const scores = [
    familyScores.father,
    familyScores.mother,
    familyScores.bigSister,
    familyScores.littleSister
  ];
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
};

export const sortMovies = (movies: Movie[], sortBy: SortOption): Movie[] => {
  return [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'totalScore':
        const scoreA = calculateTotalScore(a.familyScores);
        const scoreB = calculateTotalScore(b.familyScores);
        return scoreB - scoreA;
      case 'fatherScore':
        return b.familyScores.father - a.familyScores.father;
      case 'motherScore':
        return b.familyScores.mother - a.familyScores.mother;
      case 'bigSisterScore':
        return b.familyScores.bigSister - a.familyScores.bigSister;
      case 'littleSisterScore':
        return b.familyScores.littleSister - a.familyScores.littleSister;
      default:
        return 0;
    }
  });
};