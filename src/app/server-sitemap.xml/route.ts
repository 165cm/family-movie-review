// app/server-sitemap.xml/route.ts
import { getMovies } from '@/app/lib/notion';

export async function GET(): Promise<Response> {
  try {
    const movies = await getMovies();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://family-movie-review.vercel.app';

    // lastModifiedを確実にDate型に変換
    const sitemap = movies.map(movie => ({
      url: `${baseUrl}/movies/${movie.slug}`,
      lastModified: new Date(movie.watchedDate || Date.now()).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }));

    // XMLヘッダーを設定
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap.map(entry => `
        <url>
          <loc>${entry.url}</loc>
          <lastmod>${entry.lastModified}</lastmod>
          <changefreq>${entry.changeFrequency}</changefreq>
          <priority>${entry.priority}</priority>
        </url>
      `).join('')}
    </urlset>`.trim();

    // XMLとしてレスポンス
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('サイトマップ生成エラー:', error);
    return new Response('サイトマップの生成に失敗しました', { status: 500 });
  }
}