// src/types/movie.ts
export interface Movie extends MovieBase {
  youtubeId?: string;
  reviews: {
    father: string;
    mother: string;
    bigSister: string;
    littleSister: string;
  };
  genre: string;  // MovieGenre型を文字列型に変更
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
  check: string;  // FamilyCheck型を削除し、stringに
  duration?: number; // 上映時間（分）を追加
}

export interface MovieListItem extends MovieBase {
  watchedDate: string;
  viewingPlatform: string;
  isBest5: boolean;
  viewingUrl: string | null;
  genre: string;  // MovieGenre型を文字列型に変更
  director?: string;
  cast?: string[];
  screenwriter?: string;
  highlights?: string[];
  monthDb?: string;
  check: string;  // FamilyCheck型を削除し、stringに
  status?: string;
}

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

export interface MovieDetailLayoutProps {
  movie: Movie;
}