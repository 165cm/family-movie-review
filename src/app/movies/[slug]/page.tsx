// src/app/movies/[slug]/page.tsx
import { getMovieBySlug, getMovies } from '@/app/lib/notion';
import MovieDetail from '@/app/components/MovieDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { MovieListItem } from '@/types/movie';

type PageParams = {
  slug: string;
};

type Props = {
  params: PageParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
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
}

export default async function Page({ params }: Props) {
  const movie = await getMovieBySlug(params.slug);

  if (!movie) {
    notFound();
  }

  return <MovieDetail movie={movie} />;
}

export async function generateStaticParams() {
  const movies = await getMovies();
  
  return movies.map(({ slug }: MovieListItem) => ({
    slug,
  }));
}