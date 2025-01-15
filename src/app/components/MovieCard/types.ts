// src/app/components/MovieCard/types.ts
import { MovieListItem } from '@/types/movie';

export type MovieCardVariant = 'list' | 'recommendation';
export type MovieCardSize = 'normal' | 'compact';

export interface MovieCardProps {
  movie: MovieListItem;
  variant?: MovieCardVariant;
  size?: MovieCardSize;
  className?: string;
}