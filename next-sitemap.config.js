/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://family-movie-review.vercel.app',  // 完全なURLを指定
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
  exclude: ['/api/*', '/_next/*', '/static/*', '/server-sitemap.xml'],  // 除外パスを明示的に指定
  generateIndexSitemap: false,
  sitemapSize: 7000,  // 十分大きなサイズを指定
  changefreq: 'weekly',
  priority: 0.7,
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
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}