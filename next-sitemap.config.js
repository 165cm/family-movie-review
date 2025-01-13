// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://family-movie-review.vercel.app',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/*', '/_next/*', '/static/*'],
        },
      ],
      additionalSitemaps: [
        `${process.env.NEXT_PUBLIC_BASE_URL}/server-sitemap.xml`,
      ],
    },
    exclude: ['/api/*', '/_next/*', '/static/*'],
    generateIndexSitemap: true,
    changefreq: 'weekly',
    priority: 0.7,
    sitemapSize: 7000,
    transform: async (config, path) => {
      // 映画詳細ページの優先度を高く設定
      if (path.startsWith('/movies/')) {
        return {
          loc: path,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date().toISOString(),
        }
      }
      // その他のページ
      return {
        loc: path,
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: new Date().toISOString(),
      }
    },
  }