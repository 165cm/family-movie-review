// src/app/movies/[slug]/page.tsx
import { getMovieBySlug, getMovies } from '@/app/lib/notion';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';  // Metadataのインポートを追加
import { Card, CardContent } from "../../components/ui/card";
import { familyColors } from '@/app/lib/theme';
import { Clock, Timer } from 'lucide-react';
import { Rating } from '../../components/ui/rating';
import { calculateTotalScore, formatIndividualScore } from '@/app/lib/utils/score';
import { RecommendedMovies } from '../../components/RecommendedMovies';
import { getRecommendedMovies } from '@/app/lib/utils/recommendation';
import { MovieNavigation } from '@/app/components/MovieNavigation';
import { BreadcrumbNav } from '@/app/components/BreadcrumbNav';
import { getAdjacentMovies } from '@/app/lib/utils/navigation';
import { SortOption } from '@/app/lib/filters/types';
import StructuredData from '@/app/components/StructuredData';

const FAMILY_COLORS = {
  father: '#4CAF50',    // ソフトグリーン
  mother: '#E1BEE7',    // ライトパープル
  bigSister: '#81D4FA', // スカイブルー
  littleSister: '#FF9ED2', // ソフトピンク
  total: '#FFD54F'      // ウォームイエロー
} as const;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface ReviewStructuredData {
  '@type': 'Review';
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  author: {
    '@type': 'Person';
    name: string;
  };
  reviewBody: string;
}

interface StructuredData {
  '@context': 'https://schema.org';
  '@type': 'Movie';
  name: string;
  description: string;
  director: {
    '@type': 'Person';
    name: string;
  };
  actor: Array<{
    '@type': 'Person';
    name: string;
  }>;
  datePublished: string;
  aggregateRating: {
    '@type': 'AggregateRating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
    ratingCount: number;
  };
  review: ReviewStructuredData[];
}

const getYouTubeId = (url: string | null): string => {
  if (!url) return '';
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : '';
};


export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const movie = await getMovieBySlug(slug);
  
  if (!movie) {
    return {
      title: 'ページが見つかりません | 家族で観る映画レビュー',
      description: '指定された映画情報は見つかりませんでした。',
      robots: 'noindex'
    };
  }

  const { displayScore } = calculateTotalScore(movie.familyScores);

  return {
    title: `『${movie.name}』こどもと見ても大丈夫? | 家族で観る映画レビュー`,
    description: `${movie.name}を家族で観てみました。総合評価${displayScore}点。${movie.synopsis.slice(0, 100)}...`,
    keywords: [
      ...movie.cast,
      movie.director,
      '家族向け',
      '映画レビュー',
      'こども向け映画',
      '家族で観る映画'
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/movies/${slug}`,
    },
    openGraph: {
      title: `『${movie.name}』こどもと見ても大丈夫? 家族の評価：${displayScore}点`,
      description: movie.synopsis,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/movies/${slug}`,
      images: [
        {
          url: '/ogp-default.png',
          width: 1200,
          height: 630,
          alt: `${movie.name}の映画情報 - 家族の評価：${displayScore}点`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `『${movie.name}』こどもと見ても大丈夫? | 家族で観る映画レビュー`,
      description: `家族の評価：${displayScore}点。${movie.synopsis.slice(0, 100)}...`,
      images: ['/ogp-default.png'],
    },
  };
}

// 静的パラメータ生成
export async function generateStaticParams() {
  try {
    const movies = await getMovies();
    return movies.map((movie: { slug: string }) => ({  // 明示的な型付け
      slug: movie.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function Page(props: PageProps) {
  try {
    const allMovies = await getMovies();
    const { slug } = await props.params;
    const searchParams = await props.searchParams;
    const { sort = 'totalScore', genre } = searchParams;
    
    const movie = await getMovieBySlug(slug);
    if (!movie) {
      notFound();
    }

    const { 
      prevMovie, 
      nextMovie, 
      currentIndex, 
      totalCount 
    } = getAdjacentMovies(
      movie, 
      allMovies, 
      sort as SortOption,
      genre as string
    );

    // レコメンド映画を取得
    const recommendedMovies = getRecommendedMovies(movie, allMovies);

    // スコアの計算を行う
    const { displayScore, starRating } = calculateTotalScore(movie.familyScores);

    return (
      <>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* パンくずナビとナビゲーション */}
            <BreadcrumbNav 
              genre={movie.genre} 
              movieName={movie.name}
            />

          <div className="flex flex-wrap gap-2 mb-4">
            {/* 既存のメタ情報 */}
            <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(movie.watchedDate).toLocaleDateString('ja-JP')}
            </span>
            
            {/* 上映時間 */}
            {movie.duration && (
              <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                <Timer className="w-4 h-4 mr-1" />
                {movie.duration}分
              </span>
            )}
            
            {/* 監督情報 */}
            <div className="inline-flex items-center gap-1">
              <span className="text-sm text-gray-600">監督:</span>
              <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                {movie.director}
              </span>
            </div>
            
            {/* 脚本家情報 */}
            <div className="inline-flex items-center gap-1">
              <span className="text-sm text-gray-600">脚本:</span>
              <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                {movie.screenwriter}
              </span>
            </div>

            {/* 出演者情報（まとめて表示） */}
            <div className="inline-flex items-center gap-1 flex-wrap">
              <span className="text-sm text-gray-600">出演:</span>
              {movie.cast.map((actor, index) => (
                <span key={index} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {actor}
                </span>
              ))}
            </div>
          </div>

          {/* YouTube埋め込み */}
          {movie.viewingUrl && (
            <Card className="mb-8 shadow-sm overflow-hidden">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeId(movie.viewingUrl)}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
          )}
          
          {/* メインコンテンツ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 左: 家族視聴とあらすじ */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-6">
                {/* 家族視聴 */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm font-medium text-gray-500 mb-2" style={{ marginTop: "20px" }}>家族視聴</div>
                  <div className={`
                    flex flex-col items-center justify-center 
                    w-24 h-24 rounded-full shadow-md 
                    ${
                      movie.check === '家族OK' 
                        ? 'bg-emerald-500' 
                        : movie.check === '気まずい'
                        ? 'bg-yellow-500'
                        : movie.check === '家族NG'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }
                  `}>
                    <span className="text-white text-base font-bold">
                      {movie.check || 'NG'}
                    </span>
                  </div>
                </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-700 mb-2" style={{ marginTop: "20px" }}>あらすじ</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {movie.synopsis}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 右: 評価 */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                {/* ヘッダーと総合評価を横並びに */}
                <div className="flex justify-between items-center mb-4" style={{ marginTop: "20px" }}>
                  <h3 className="text-lg font-bold text-gray-700">総合評価</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-yellow-500">
                      {displayScore}
                    </span>
                    <Rating score={starRating} size="lg" color="#FFD700" />
                  </div>
                </div>

                {/* 個別評価 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { role: '父', colorKey: 'father' as const },
                    { role: '母', colorKey: 'mother' as const },
                    { role: '姉', colorKey: 'bigSister' as const },
                    { role: '妹', colorKey: 'littleSister' as const }
                  ].map(({ role, colorKey }) => {
                    const { displayScore, starRating } = formatIndividualScore(movie.familyScores[colorKey]);
                    return (
                      <div key={role} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
                        <span className="font-medium">{role}</span>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-lg font-bold"
                            style={{ color: FAMILY_COLORS[colorKey] }}
                          >
                            {displayScore}
                          </span>
                          <Rating 
                            score={starRating} 
                            size="md" 
                            color={FAMILY_COLORS[colorKey]} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* レビュー（タブなしバージョン） */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-4" style={{ marginTop: "20px" }}>家族の感想</h3>
              <div className="space-y-4">
                {/* 父のレビュー */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">論理派パパ</p>
                  <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.father.background }}>
                    <p>{movie.reviews.father || 'レビューはまだありません'}</p>
                  </div>
                </div>

                {/* 母のレビュー */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">共感派ママ</p>
                  <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.mother.background }}>
                    <p>{movie.reviews.mother || 'レビューはまだありません'}</p>
                  </div>
                </div>

                {/* 姉のレビュー */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">探究派お姉ちゃん</p>
                  <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.bigSister.background }}>
                    <p>{movie.reviews.bigSister || 'レビューはまだありません'}</p>
                  </div>
                </div>

                {/* 妹のレビュー */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">エンターテイメント派妹</p>
                  <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.littleSister.background }}>
                    <p>{movie.reviews.littleSister || 'レビューはまだありません'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <StructuredData movie={movie} />
          </Card>
          </div>
          <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b mb-6">
          <MovieNavigation 
          currentMovie={movie}
          prevMovie={prevMovie}
          nextMovie={nextMovie}
          currentSort={sort as string}
          searchParams={searchParams}
          currentIndex={currentIndex}
          totalCount={totalCount}
        />
          </div>
        {/* レコメンデーション追加 */}
        <RecommendedMovies
          currentMovie={movie}
          recommendedMovies={recommendedMovies}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading movie:', error);
    throw error;
  }
}
