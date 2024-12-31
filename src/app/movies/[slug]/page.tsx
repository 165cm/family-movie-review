
// src/app/movies/[slug]/page.tsx
import { getMovieBySlug, getMovies } from '@/app/lib/notion';
import MovieDetail from '@/app/components/MovieDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { MovieListItem } from '@/types/movie';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// メタデータ生成関数の修正
export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  try {
    const params = await props.params;
    const movie = await getMovieBySlug(params.slug);
    
    if (!movie) {
      return {
        title: 'ページが見つかりません | 家族で観る映画レビュー',
        description: '指定された映画情報は見つかりませんでした。',
      };
    }

    return {
      title: `『${movie.name}』こどもに見せても大丈夫? | 家族で観る映画レビュー`,
      description: movie.synopsis,
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
      openGraph: {
        title: `『${movie.name}』こどもに見せても大丈夫?`,
        description: movie.synopsis,
        type: 'article',
        images: [
          {
            url: '/ogp-default.png',
            width: 1200,
            height: 630,
            alt: `${movie.name}の映画情報`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'エラー | 家族で観る映画レビュー',
      description: '情報の取得中にエラーが発生しました。',
    };
  }
}

// ページコンポーネントの修正
export default async function Page(props: PageProps) {
  try {
    const params = await props.params;
    const movie = await getMovieBySlug(params.slug);

    if (!movie) {
      notFound();
    }

    return <MovieDetail movie={movie} />;
  } catch (error) {
    console.error('Error loading movie:', error);
    notFound();
  }
}

// 静的パラメータ生成
export async function generateStaticParams() {
  try {
    const movies = await getMovies();
    return movies.map(({ slug }: MovieListItem) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}