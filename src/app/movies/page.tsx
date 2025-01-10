// src/app/movies/page.tsx
import { getMovies } from '@/app/lib/notion';
import { HeroSection } from '../components/ui/hero-section';
import { Suspense } from 'react';
import { MovieGridWithFilters } from '../components/MovieGridWithFilters';
import { Movie } from '@/types/movie';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export default async function MoviesPage() {
  try {
    const movieListItems = await getMovies();
    
    if (!movieListItems || movieListItems.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold mb-2">映画情報がありません</h2>
            <p className="text-gray-600">現在表示できる映画情報はありません。</p>
          </div>
        </div>
      );
    }

    // MovieListItem[] を Movie[] に変換
    const movies: Movie[] = movieListItems.map(item => ({
      ...item,
      reviews: {
        father: '',
        mother: '',
        bigSister: '',
        littleSister: ''
      },
      // Notionから取得した値を使用（デフォルト値の設定）
      director: item.director ?? '',
      cast: item.cast ?? [],
      screenwriter: item.screenwriter ?? '',
      highlights: item.highlights ?? [],
      status: item.status ?? 'Published',
      monthDb: item.monthDb ?? '',
      check: item.check ?? 'OK'
    }));

    const featuredMovie = movies.find(movie => movie.isBest5);

    return (
      <main className="min-h-screen bg-gray-50">
        <HeroSection featuredMovie={featuredMovie} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">映画を探す</h2>
          </div>
          <Suspense 
            fallback={
              <div className="space-y-6">
                <div className="animate-pulse h-12 bg-gray-100 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse h-64 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              </div>
            }
          >
            <MovieGridWithFilters movies={movies} />
          </Suspense>
        </div>
      </main>
    );
  } catch (error) {
    console.error('MoviesPage Error:', error);
    throw error;
  }
}