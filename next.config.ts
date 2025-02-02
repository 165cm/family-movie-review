// next.config.ts
import type { Configuration } from 'webpack';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      }
    ],
  },
  webpack: (config: Configuration, { dev, isServer }) => {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        }
      };
    }

    if (isServer) {
      config.externals = [...(config.externals as unknown as string[] || []), 'canvas'];
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
};

export default nextConfig;