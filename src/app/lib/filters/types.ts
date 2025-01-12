// src/app/lib/filters/types.ts
export type SortOption = 
  | 'totalScore'
  | 'fatherScore'
  | 'motherScore'
  | 'bigSisterScore'
  | 'littleSisterScore';
  
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