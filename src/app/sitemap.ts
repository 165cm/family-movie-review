// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getMovies } from '@/app/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const movies = await getMovies();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://family-movie-review.vercel.app';

    // 基本ページのエントリー
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/movies`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ];

    // 映画詳細ページのエントリー
    const moviePages = movies.map((movie) => ({
      url: `${baseUrl}/movies/${movie.slug}`,
      lastModified: new Date(movie.watchedDate),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...moviePages];
  } catch (error) {
    console.error('サイトマップ生成エラー:', error);
    // エラーが発生した場合でも最低限のサイトマップを返す
    return [
      {
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://family-movie-review.vercel.app',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ];
  }
}