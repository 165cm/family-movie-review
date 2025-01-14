// src/app/lib/utils/recommendation.ts
import { Movie, MovieListItem, FamilyScores } from '@/types/movie';

export function calculateFamilySimilarity(
  scoreA: FamilyScores,
  scoreB: FamilyScores
): number {
  const differences = [
    Math.abs(scoreA.father - scoreB.father),
    Math.abs(scoreA.mother - scoreB.mother),
    Math.abs(scoreA.bigSister - scoreB.bigSister),
    Math.abs(scoreA.littleSister - scoreB.littleSister)
  ];
  
  return differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
}

// MovieListItem型を受け取るように修正
export function getRecommendedMovies(
  currentMovie: Movie,
  allMovies: MovieListItem[],
  limit: number = 4
): MovieListItem[] {
  return allMovies
    .filter(movie => movie.id !== currentMovie.id)
    .map(movie => ({
      movie,
      similarity: calculateFamilySimilarity(
        currentMovie.familyScores,
        movie.familyScores
      )
    }))
    .sort((a, b) => a.similarity - b.similarity)
    .slice(0, limit)
    .map(item => item.movie);
}