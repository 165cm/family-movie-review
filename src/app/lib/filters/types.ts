// src/app/lib/filters/types.ts
// src/app/lib/filters/types.ts
export type SortOption = 
  | 'totalScore' // 総合評価
  | 'fatherScore' // 父の評価
  | 'motherScore' // 母の評価
  | 'bigSisterScore' // 姉の評価
  | 'littleSisterScore'; // 妹の評価

export type FilterType = 
  | 'director' 
  | 'cast' 
  | 'screenwriter' 
  | 'genre'  
  | 'year'   
  | 'company';

export interface FilterState {
  search: string;
  sort: string;
  tags: {
    director: string | null;
    screenwriter: string | null;
    cast: string | null;
  };
}

export interface MovieFilters {
  search: string;
  sortBy: SortOption;
  tags: {
    director: string | null;
    screenwriter: string | null;
    cast: string | null;
  };
}

export interface ActiveFilter {
  type: FilterType;
  value: string;
}

export interface FilterTags {
  directors: string[];
  screenwriters: string[];
  cast: string[];
  genres: string[];
  years: string[];
  companies: string[];
}