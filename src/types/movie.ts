// src/types/movie.ts
export type FamilyCheck = 'OK' | '気まずい' | 'NG';

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

export interface Movie {
  id: string;
  name: string;
  slug: string;
  synopsis: string;
  youtubeId?: string;
  
  // 評価スコア
  totalScore: number;
  familyScores: {
    father: number;
    mother: number;
    bigSister: number;
    littleSister: number;
  };
  
  // レビュー
  reviews: {
    father: string;
    mother: string;
    bigSister: string;
    littleSister: string;
  };
  
  // 作品情報
  director: string;
  cast: string[];
  screenwriter: string;
  highlights: string[];
  
  // 視聴情報
  watchedDate: string;
  viewingPlatform: string;
  viewingUrl: string | null;
  
  // 分類・ステータス
  status: string;
  isBest5: boolean;
  monthDb: string;
  check: FamilyCheck;
}

// src/types/movie.ts
export interface MovieListItem {
  id: string;
  name: string;
  slug: string;
  synopsis: string;
  totalScore: number;
  familyScores: {
    father: number;
    mother: number;
    bigSister: number;
    littleSister: number;
  };
  watchedDate: string;
  viewingPlatform: string;
  isBest5: boolean;
  viewingUrl: string | null;
  // フィルタリングに必要なプロパティを追加
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