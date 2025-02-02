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

export interface MovieListItem {
  id: string;
  name: string;
  slug: string;
  synopsis: string;
  totalScore: number;
  familyScores: FamilyScores;
  watchedDate: string;
  viewingPlatform: string;
  viewingUrl: string | null;
  genre: string;
  check: string;
  isBest5: boolean;
  recommendedBy: string[];
  updatedAt?: string;
  // 必要なフィールドを追加
  director?: string;
  cast?: string[];
  screenwriter?: string;
  highlights?: string[];
  status?: string;
  monthDb?: string;
}

export interface MovieBase {
  id: string;
  name: string;
  slug: string;
  synopsis: string;
  totalScore: number;
  familyScores: FamilyScores;
  recommendedBy: string[];  // 追加：おすすめしている家族メンバー
}

export interface FamilyScores {
  father: number;
  mother: number;
  bigSister: number;
  littleSister: number;
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