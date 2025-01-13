// src/app/movies/page.tsx
import { getMovies } from '@/app/lib/notion';
import { HeroSection } from '../components/ui/hero-section';
import { Suspense } from 'react';
import { MovieGridWithFilters } from '../components/MovieGridWithFilters';
import { Movie } from '@/types/movie';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export default async function MoviesPage() {
  try {
    const movieListItems = await getMovies();
    
    if (!movieListItems || movieListItems.length === 0) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold mb-2">映画情報がありません</h2>
            <p className="text-gray-600">現在表示できる映画情報はありません。</p>
          </div>
        </div>
      );
    }

    // 全データを変換
    const allMovies: Movie[] = movieListItems.map(item => ({
      ...item,
      reviews: {
        father: '',
        mother: '',
        bigSister: '',
        littleSister: ''
      },
      director: item.director ?? '',
      cast: item.cast ?? [],
      screenwriter: item.screenwriter ?? '',
      highlights: item.highlights ?? [],
      status: item.status ?? 'Published',
      monthDb: item.monthDb ?? '',
      check: item.check ?? 'OK'
    }));

    // おすすめ映画の取得
    const featuredMovie = movieListItems.find(movie => movie.isBest5);

    return (
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<HeroSectionSkeleton />}>
          <HeroSection featuredMovie={featuredMovie} />
        </Suspense>
        
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-8">映画を探す</h2>
          
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieGridWithFilters movies={allMovies} />
          </Suspense>
        </div>
      </main>
    );
  } catch (error) {
    console.error('MoviesPage Error:', error);
    return <ErrorFallback />;
  }
}

function HeroSectionSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse h-64" />
  );
}

function MovieGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse h-12 bg-gray-100 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="animate-pulse bg-gray-100 rounded-lg h-64"
            style={{animationDelay: `${i * 100}ms`}}
          />
        ))}
      </div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
      <div className="text-center p-4">
        <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
        <p className="text-gray-600">
          申し訳ありません。データの読み込み中にエラーが発生しました。
        </p>
      </div>
    </div>
  );
}