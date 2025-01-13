// src/types/movie.ts
export type FamilyCheck = 'OK' | '気まずい' | 'NG';

export interface FamilyScores {
  father: number;
  mother: number;
  bigSister: number;
  littleSister: number;
}

interface MovieBase {
  id: string;
  name: string;
  slug: string;
  synopsis: string;
  totalScore: number;  // 10点満点の生スコア
  familyScores: FamilyScores;
}

export interface ContentWarning {
  category: string;
  level: number;
  scenes: {
    timestamp: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

export interface AgeGroupRating {
  ageGroup: string;
  isRecommended: boolean;
  warning?: string;
}

export interface Movie extends MovieBase {
  youtubeId?: string;
  reviews: {
    father: string;
    mother: string;
    bigSister: string;
    littleSister: string;
  };
  director: string;
  cast: string[];
  screenwriter: string;
  highlights: string[];
  watchedDate: string;
  viewingPlatform: string;
  viewingUrl: string | null;
  status: string;
  isBest5: boolean;
  monthDb: string;
  check: FamilyCheck;
}

export interface MovieListItem extends MovieBase {
  watchedDate: string;
  viewingPlatform: string;
  isBest5: boolean;
  viewingUrl: string | null;
  director?: string;
  cast?: string[];
  screenwriter?: string;
  highlights?: string[];
  monthDb?: string;
  check?: FamilyCheck;
  status?: string;
}

export interface MovieDetailLayoutProps {
  movie: Movie;
}