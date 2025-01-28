// src/utils/amazonProducts.ts
import { AmazonProduct } from '../types/amazon';
import { amazonProducts } from '../app/data/amazonProducts';

export function getRandomProduct(): AmazonProduct {
  const products = Object.values(amazonProducts);
  if (products.length === 0) {
    throw new Error('No products available');
  }
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}

// 追加：より安全な実装
export function getSafeRandomProduct(): AmazonProduct | null {
  try {
    return getRandomProduct();
  } catch (error) {
    console.error('Error getting random product:', error);
    return null;
  }
}