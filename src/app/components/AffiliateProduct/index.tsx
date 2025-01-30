// src/app/components/AffiliateProduct/index.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/app/components/ui/card';
import { AmazonProduct } from '@/types/amazon';
import { familyColors } from '@/app/lib/theme';

// 画像コンポーネントを動的インポート
const Image = dynamic(() => import('next/image'), { 
  ssr: false,
  loading: () => (
    <div className="w-32 h-32 bg-gray-100 rounded-md animate-pulse" />
  )
});

interface Props {
  product: AmazonProduct;
}

// 型安全なマッピングオブジェクトの定義
const roleColorMap = {
  '探究派お姉ちゃん': 'bigSister',
  'エンターテイメント派妹': 'littleSister',
  '論理派パパ': 'father',
  '共感派ママ': 'mother'
} as const;

export function AffiliateProduct({ product }: Props) {
  const [variant, setVariant] = useState<'a' | 'b'>('a');
  
  useEffect(() => {
    setVariant(Math.random() < 0.5 ? 'a' : 'b');
  }, []);

  const copy = product.copies[variant];

  const handleClick = () => {
    try {
      fetch('/api/affiliate-click', {
        method: 'POST',
        body: JSON.stringify({
          asin: product.asin,
          variant,
        }),
      });
    } catch (error) {
      console.error('クリック計測エラー:', error);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 mt-12 mb-8">
      <CardContent className="p-6">
        {/* PRヘッダー */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded" style={{ marginTop: "10px" }}>PR</span>
          <p className="text-sm text-gray-600" style={{ marginTop: "10px" }}>
            より多くの映画を観て、正直にレビューするための資金調達コーナーです
          </p>
        </div>

        {/* 商品情報セクション */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-xl p-6 mb-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 商品画像 */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src="/images/fallback/no-image.png"
                alt={product.title}
                fill
                className="object-contain rounded-md hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100px, 150px"
                priority={false}
                loading="lazy"
              />
            </div>

            {/* 商品詳細 */}
            <div className="flex-1">
              <div className="mb-4">
                {/* キャッチコピー */}
                <p className="text-lg font-bold text-gray-800 mb-2">
                  {copy.heading}
                </p>
                {/* クリッカブルな商品名 */}
                <a 
                  href={product.detailPageUrl}
                  onClick={handleClick}
                  target="_blank"
                  rel="nofollow noopener"
                  className="group inline-block mb-2"
                >
                  <span className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors border-b-2 border-gray-200 group-hover:border-gray-400">
                    {product.title}
                  </span>
                  <svg 
                    className="inline-block w-4 h-4 ml-1 text-gray-400 group-hover:text-gray-600 translate-y-[-2px]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-sm text-gray-600">
                  {copy.subheading}
                </p>
              </div>

              {/* アクションエリア */}
              <div className="flex items-center gap-4">
                <a 
                  href={product.detailPageUrl}
                  onClick={handleClick}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Amazonで見る
                </a>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ¥{product.price.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">※価格は変更される場合があります</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* レビューセクション */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm font-medium text-gray-500">家族の感想</span>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(roleColorMap).map(([role, colorKey]) => (
            <div key={role} className="space-y-1">
              <p className="text-sm text-gray-500">{role}</p>
              <div 
                className="rounded-lg p-4" 
                style={{ backgroundColor: familyColors[colorKey].background }}
              >
                <p>{product.reviews[colorKey]}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}