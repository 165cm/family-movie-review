// app/api/sitemap/route.ts
import { getMovies } from '@/app/lib/notion';
import { MetadataRoute } from 'next';

export async function GET(): Promise<Response> {
  try {
    const movies = await getMovies();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://movie.choc-coin.com';
    
    const sitemap: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      ...movies.map(movie => ({
        url: `${baseUrl}/movies/${movie.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })),
    ];

    return new Response(JSON.stringify(sitemap), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });

  } catch {
    // フォールバック用の最小限のサイトマップ
    const fallbackSitemap: MetadataRoute.Sitemap = [
      {
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://movie.choc-coin.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }
    ];

    return new Response(JSON.stringify(fallbackSitemap), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  }
}