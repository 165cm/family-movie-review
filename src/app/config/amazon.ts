// src/config/amazon.ts
export const AMAZON_CONFIG = {
  API: {
    region: process.env.AMAZON_REGION || 'jp',
    baseUrl: 'https://webservices.amazon.co.jp/paapi5',
    imagesDomain: ['images-na.ssl-images-amazon.com', 'm.media-amazon.com'],
  },
  CACHE: {
    ttl: 3600,
    maxItems: 100,
  },
  FALLBACK: {
    imageUrl: '/images/no-image.png',
  },
};