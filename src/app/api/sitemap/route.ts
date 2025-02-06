// src/app/api/sitemap/route.ts
import { getMovies } from '@/app/lib/notion';
import { MetadataRoute } from 'next';

// changeFrequencyの有効な値の型を定義
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// XMLエスケープ用のヘルパー関数
const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

// サイトマップXMLの生成関数
const generateSitemapXml = (urls: MetadataRoute.Sitemap): string => {
  const urlsets = urls.map(({ url, lastModified, changeFrequency, priority }) => {
    const lastModifiedStr = lastModified instanceof Date 
      ? lastModified.toISOString()
      : typeof lastModified === 'string' 
        ? lastModified
        : new Date().toISOString();

    return `
    <url>
      <loc>${escapeXml(url)}</loc>
      <lastmod>${lastModifiedStr}</lastmod>
      ${changeFrequency ? `<changefreq>${changeFrequency}</changefreq>` : ''}
      ${priority ? `<priority>${priority}</priority>` : ''}
    </url>
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlsets}
    </urlset>`;
};

export async function GET(): Promise<Response> {
  try {
    const movies = await getMovies();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://movie.choc-coin.com';
    
    const sitemap: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as ChangeFrequency,
        priority: 1.0,
      },
      ...movies.map(movie => ({
        url: `${baseUrl}/movies/${movie.slug}`,
        lastModified: new Date(movie.updatedAt || Date.now()),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.8,
      })),
    ];

    const xml = generateSitemapXml(sitemap);

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);

    // フォールバック用の最小限のサイトマップ
    const fallbackSitemap: MetadataRoute.Sitemap = [{
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://movie.choc-coin.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1.0,
    }];

    const fallbackXml = generateSitemapXml(fallbackSitemap);

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
}