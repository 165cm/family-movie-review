// src/app/movies/page.tsx
import { getMovies } from '@/app/lib/notion';
import { MovieGrid } from '../components/ui/movie-grid';
import { FilterBar } from '../components/ui/filter-bar';
import { HeroSection } from '../components/ui/hero-section';
import { Suspense } from 'react';

// キャッシュ設定を調整
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export default async function MoviesPage() {
  try {
    const movies = await getMovies();
    
    if (!movies || movies.length === 0) {
      console.log('No movies found');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold mb-2">映画情報がありません</h2>
            <p className="text-gray-600">現在表示できる映画情報はありません。</p>
          </div>
        </div>
      );
    }


    console.log('Fetching movies with:', {
      hasApiKey: !!process.env.NOTION_API_KEY,
      hasDatabaseId: !!process.env.NOTION_DATABASE_ID
    });

    const featuredMovie = movies.find(movie => movie.isBest5);

    console.log('MoviesPage data:', {
      totalMovies: movies.length,
      hasFeaturedMovie: !!featuredMovie
    });

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
  } catch (error) {
    console.error('MoviesPage Error:', error);
    throw error; // App RouterのErrorBoundaryに処理を委譲
  }
}

