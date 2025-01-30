// src/app/lib/images.ts
import { AMAZON_CONFIG } from '../config/amazon';

export const getProductImageUrl = (originalUrl: string, fallback?: string): string => {
  // URLが存在し、有効なAmazonの画像URLである場合
  if (originalUrl && (
    originalUrl.includes('amazon.com/images') || 
    originalUrl.includes('media-amazon.com/images')
  )) {
    return originalUrl;
  }
  return fallback || AMAZON_CONFIG.FALLBACK.imageUrl;
};