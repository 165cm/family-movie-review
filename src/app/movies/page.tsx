// src/app/movies/page.tsx
import { getMovies } from '@/app/lib/notion';
import { MovieGridWithFilters } from '../components/MovieGridWithFilters';
import { Movie, MovieListItem } from '@/types/movie';
import type { Metadata } from 'next';
import { GenreTagCloud } from '../components/GenreTagCloud';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24時間

// 正しい型定義
type SearchParamsProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
};

export async function generateMetadata({
  searchParams,
}: SearchParamsProps): Promise<Metadata> {
  const params = await searchParams;
  const genre = params.genre;
  
  return {
    title: genre 
      ? `${genre}の映画レビュー一覧 | 家族で観る映画レビュー` 
      : '映画レビュー一覧 | 家族で観る映画レビュー',
    description: genre
      ? `${genre}ジャンルの映画レビューを家族の視点で紹介。子供と一緒に観られるかどうかの参考に。`
      : '家族で観られる映画のレビューを紹介。子供と一緒に観られるかどうかの参考に。',
  };
}

export default async function Page({
  searchParams,
}: SearchParamsProps) {
  try {
    const params = await searchParams;
    const movieListItems = await getMovies();
    const selectedGenre = typeof params.genre === 'string' ? params.genre : undefined;
    const selectedMember = typeof params.recommendedBy === 'string' ? params.recommendedBy : undefined;

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

    // ジャンル集計
    const genreCounts = movieListItems.reduce((acc, movie: MovieListItem) => {
      if (movie.genre) {
        acc[movie.genre] = (acc[movie.genre] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const genres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // メンバーごとのおすすめ数をカウント
    const recommendationCounts = {
      father: movieListItems.filter(movie => movie.recommendedBy.includes('father')).length,
      mother: movieListItems.filter(movie => movie.recommendedBy.includes('mother')).length,
      bigSister: movieListItems.filter(movie => movie.recommendedBy.includes('bigSister')).length,
      littleSister: movieListItems.filter(movie => movie.recommendedBy.includes('littleSister')).length,
    };

    // フィルタリング
    let filteredMovies = movieListItems;
    if (selectedGenre) {
      filteredMovies = filteredMovies.filter(movie => movie.genre === selectedGenre);
    }
    if (selectedMember) {
      filteredMovies = filteredMovies.filter(movie => movie.recommendedBy.includes(selectedMember));
    }

    // 全データを変換
    const allMovies: Movie[] = filteredMovies.map(item => ({
      ...item,
      reviews: {
        father: '',
        mother: '',
        bigSister: '',
        littleSister: ''
      },
      // オプショナルチェーンを使用
      director: item.director ?? '',
      cast: item.cast ?? [],
      screenwriter: item.screenwriter ?? '',
      highlights: item.highlights ?? [],
      status: item.status ?? 'Published',
      monthDb: item.monthDb ?? '',
      check: item.check ?? 'OK'
    }));

    return (
      <main className="min-h-screen bg-gray-50">
        {/* ヒーローセクション追加 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              家族で観た映画レビュー
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-2">
              毎週１回映画の日！小中学生の子どもたちと一緒に観た映画をご紹介
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">          
          <GenreTagCloud 
            genres={genres}
            selectedGenre={selectedGenre}
            totalCount={movieListItems.length}
            recommendationCounts={recommendationCounts}
          />
          
          <MovieGridWithFilters movies={allMovies} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('MoviesPage Error:', error);
    return <ErrorFallback />;
  }
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