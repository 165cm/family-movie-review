// src/app/movies/[slug]/page.tsx
import { getMovieBySlug, getMovies } from '@/app/lib/notion';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';  // Metadataのインポートを追加
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { familyColors } from '@/app/lib/theme';
import { Clock } from 'lucide-react';
import { Rating } from '../../components/ui/rating';
import ShareButton from '@/app/components/ShareButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StructuredData from '../../components/StructuredData';

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

  const avgScore = ((movie.familyScores.father + 
    movie.familyScores.mother + 
    movie.familyScores.bigSister + 
    movie.familyScores.littleSister) / 8).toFixed(1);

  return {
    title: `『${movie.name}』こどもと見ても大丈夫? | 家族で観る映画レビュー`,
    description: `${movie.name}を家族で観てみました。総合評価${avgScore}点。${movie.synopsis.slice(0, 100)}...`,
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
      title: `『${movie.name}』こどもと見ても大丈夫? 家族の評価：${avgScore}点`,
      description: movie.synopsis,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/movies/${slug}`,
      images: [
        {
          url: '/ogp-default.png',
          width: 1200,
          height: 630,
          alt: `${movie.name}の映画情報 - 家族の評価：${avgScore}点`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `『${movie.name}』こどもと見ても大丈夫? | 家族で観る映画レビュー`,
      description: `家族の評価：${avgScore}点。${movie.synopsis.slice(0, 100)}...`,
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
    const { slug } = await props.params;
    const movie = await getMovieBySlug(slug);

    if (!movie) {
      notFound();
    }

    return (
      <>
        <StructuredData movie={movie} />
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* ナビゲーションバー */}
          <div className="flex justify-between items-center mb-6">
            <Link 
              href="/movies" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              映画一覧に戻る
            </Link>
            <ShareButton url={`${process.env.NEXT_PUBLIC_BASE_URL}/movies/${movie.slug}`} />
          </div>

          {/* タイトルセクション */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              『{movie.name}』こどもと見ても大丈夫?
            </h1>
            
            
            {/* メタ情報 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(movie.watchedDate).toLocaleDateString('ja-JP')}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">監督:</span>
                <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {movie.director}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">脚本:</span>
                <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {movie.screenwriter}
                </span>
              </div>
            </div>

            {/* 出演者タグ */}
            <div className="flex flex-wrap gap-2">
              {movie.cast.map((actor, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 text-sm rounded-md hover:bg-gray-200 cursor-pointer transition-colors">
                  {actor}
                </span>
              ))}
            </div>
          </div>

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
                      movie.check === 'OK' 
                        ? 'bg-emerald-500' 
                        : movie.check === '気まずい'
                        ? 'bg-yellow-500'
                        : movie.check === 'NG'
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
                {/* 家族の総合評価 */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-700 mb-2" style={{ marginTop: "20px" }}>家族の総合評価</h3>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl font-bold text-yellow-500">
                      {((movie.familyScores.father + 
                        movie.familyScores.mother + 
                        movie.familyScores.bigSister + 
                        movie.familyScores.littleSister) / 8).toFixed(1)}
                    </span>
                    <Rating 
                      score={(movie.familyScores.father + 
                            movie.familyScores.mother + 
                            movie.familyScores.bigSister + 
                            movie.familyScores.littleSister) / 8} 
                      size="lg" 
                    />
                  </div>
                </div>

                {/* 個別の評価 */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { role: '父', score: movie.familyScores.father },
                    { role: '母', score: movie.familyScores.mother },
                    { role: '姉', score: movie.familyScores.bigSister },
                    { role: '妹', score: movie.familyScores.littleSister }
                  ].map(({ role, score }) => (
                    <div key={role} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="font-medium text-sm">{role}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{(score / 2).toFixed(1)}</span>
                        <Rating score={score / 2} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

          {/* レビュー（タブなしバージョン） */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-4"　style={{ marginTop: "20px" }}>家族の感想</h3>
              <div className="space-y-6">

                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* 父のレビュー */}
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback style={{ backgroundColor: familyColors.father.background, color: familyColors.father.primary }}>
                          父
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">論理派パパ</p>
                        <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.father.background }}>
                          <p>{movie.reviews.father || 'レビューはまだありません'}</p>
                        </div>
                      </div>
                    </div>

                    {/* 母のレビュー */}
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback style={{ backgroundColor: familyColors.mother.background, color: familyColors.mother.primary }}>
                          母
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">共感派ママ</p>
                        <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.mother.background }}>
                          <p>{movie.reviews.mother || 'レビューはまだありません'}</p>
                        </div>
                      </div>
                    </div>

                    {/* 姉のレビュー */}
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback style={{ backgroundColor: familyColors.bigSister.background, color: familyColors.bigSister.primary }}>
                          姉
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">探究派お姉ちゃん</p>
                        <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.bigSister.background }}>
                          <p>{movie.reviews.bigSister || 'レビューはまだありません'}</p>
                        </div>
                      </div>
                    </div>

                    {/* 妹のレビュー */}
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback style={{ backgroundColor: familyColors.littleSister.background, color: familyColors.littleSister.primary }}>
                          妹
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">エンターテイメント派妹</p>
                        <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.littleSister.background }}>
                          <p>{movie.reviews.littleSister || 'レビューはまだありません'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </CardContent>
          </Card>
          </div>
      </>
    );
  } catch (error) {
    console.error('Error loading movie:', error);
    throw error;
  }
}