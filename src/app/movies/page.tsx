// src/app/movies/page.tsx
import { getMovies } from '@/app/lib/notion';
import { MovieGrid } from '../components/ui/movie-grid';
import { FilterBar } from '../components/ui/filter-bar';
import { HeroSection } from '../components/ui/hero-section';
import { Suspense } from 'react';

export const revalidate = 604800; // 7日間（秒単位）を静的な値で指定

export default async function MoviesPage() {
  const movies = await getMovies();
  const featuredMovie = movies.find(movie => movie.isBest5);

  // 開発環境でのみデバッグログを出力
  if (process.env.NODE_ENV === 'development') {
    console.log('Total movies in page:', movies.length);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection featuredMovie={featuredMovie} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">映画を探す</h2>
          <Suspense fallback={<div className="animate-pulse h-12 bg-gray-100 rounded-lg" />}>
            <FilterBar />
          </Suspense>
        </div>

        <Suspense 
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-gray-100 rounded-lg" />
              ))}
            </div>
          }
        >
          <MovieGrid movies={movies} />
        </Suspense>
      </div>
    </main>
  );
}