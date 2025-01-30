// src/utils/cache.ts
import { PaApiProduct } from '@/types/paapi';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class ProductCache {
  private storage: Map<string, CacheItem<PaApiProduct>>;
  private readonly ttl: number;

  constructor(ttlSeconds: number = 3600) {
    this.storage = new Map();
    this.ttl = ttlSeconds;
  }

  set(key: string, value: PaApiProduct): void {
    this.storage.set(key, {
      data: value,
      timestamp: Date.now()
    });
  }

  get(key: string): PaApiProduct | null {
    const item = this.storage.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.ttl * 1000;
    if (isExpired) {
      this.storage.delete(key);
      return null;
    }

    return item.data;
  }
}

export const productCache = new ProductCache();