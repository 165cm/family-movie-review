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
    },
    exclude: ['/api/*', '/_next/*', '/static/*', '/server-sitemap.xml'],
    generateIndexSitemap: false,
    outDir: 'public',
    sitemapSize: 7000,
    changefreq: 'daily',
    priority: 0.7,
    autoLastmod: true,
  }