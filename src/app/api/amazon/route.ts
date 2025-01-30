// src/app/api/amazon/route.ts
import { NextResponse } from 'next/server';
import { AmazonApiClient } from '@/app/lib/amazon';
import { ApiError } from '@/types/paapi';
import { rateLimit } from '@/app/lib/rateLimit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1分
  uniqueTokenPerInterval: 500
});

export async function GET(req: Request) {
  try {
    // レート制限のチェック
    await limiter.check(req, 10); // 1分あたり10リクエストまで

    const { searchParams } = new URL(req.url);
    const asin = searchParams.get('asin');

    if (!asin) {
      return NextResponse.json(
        { error: 'ASIN is required' },
        { status: 400 }
      );
    }

    const client = new AmazonApiClient({
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
      secretKey: process.env.AMAZON_SECRET_KEY!,
      associateTag: process.env.AMAZON_ASSOCIATE_TAG!,
      region: 'jp'
    });

    const product = await client.getProductWithCache(asin);
    
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
} catch (error) {
    console.error('Amazon API error:', error);
    
    const apiError = error as ApiError;
    
    if (apiError.code === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: apiError.message || '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
