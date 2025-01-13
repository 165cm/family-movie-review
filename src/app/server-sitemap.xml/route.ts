// src/app/server-sitemap.xml/route.ts
import { getMovies } from '@/app/lib/notion';

export async function GET(): Promise<Response> {
  try {
    const movies = await getMovies();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://family-movie-review.vercel.app';

    // インデントを整理し、余分な空白を削除
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${movies.map(movie => `  <url>
    <loc>${baseUrl}/movies/${movie.slug}</loc>
    <lastmod>${new Date(movie.watchedDate || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    // 重要: Content-Typeとキャッシュヘッダーを適切に設定
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('サイトマップ生成エラー:', error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });
  }
}