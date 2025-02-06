// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      }
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        }
      };
    }

    if (isServer) {
      const externals = [...(config.externals || []), 'canvas'];
      config.externals = externals;
    }

    return config;
  },
  experimental: {
    optimizePackageImports: ['@notionhq/client'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  // 環境変数が設定されていない場合のビルドエラーを防ぐ
  env: {
    NOTION_API_KEY: process.env.NOTION_API_KEY || '',
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID || '',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://movie.choc-coin.com',
  },
};

module.exports = nextConfig;