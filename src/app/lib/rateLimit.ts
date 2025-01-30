// src/app/lib/rateLimit.ts
interface RateLimitConfig {
    interval: number;
    uniqueTokenPerInterval: number;
  }
  
  interface RateLimitStore {
    tokens: Set<string>;
    lastReset: number;
  }
  
  export function rateLimit(config: RateLimitConfig) {
    const stores = new Map<string, RateLimitStore>();
  
    return {
      check: async (req: Request, limit: number): Promise<void> => {
        const ip = req.headers.get('x-forwarded-for') || 'anonymous';
        const now = Date.now();
        let store = stores.get(ip);
  
        if (!store || now - store.lastReset > config.interval) {
          store = { tokens: new Set(), lastReset: now };
          stores.set(ip, store);
        }
  
        if (store.tokens.size >= limit) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
  
        const token = crypto.randomUUID();
        store.tokens.add(token);
        
        setTimeout(() => {
          store?.tokens.delete(token);
        }, config.interval);
      }
    };
  }