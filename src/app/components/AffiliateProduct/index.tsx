// src/app/components/AffiliateProduct/index.tsx
'use client';

import { useState } from 'react';
import { AmazonProduct } from '@/types/amazon';
import { Card, CardContent } from '@/app/components/ui/card';
import { familyColors } from '@/app/lib/theme';

interface Props {
  product: AmazonProduct;
}

export function AffiliateProduct({ product }: Props) {
  const [variant] = useState<'a' | 'b'>(
    Math.random() < 0.5 ? 'a' : 'b'
  );

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
    <div className="mt-12 max-w-5xl mx-auto px-4">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4" style={{ marginTop: "20px" }}>
          【PR】より多くの映画を観て、正直にレビューするための資金調達コーナーです
          </h3>
          <div className="space-y-4">
            {/* 姉のレビュー */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">探究派お姉ちゃん</p>
              <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.bigSister.background }}>
                <p>{product.reviews.bigSister}</p>
              </div>
            </div>

            {/* 妹のレビュー */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">エンターテイメント派妹</p>
              <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.littleSister.background }}>
                <p>{product.reviews.littleSister}</p>
              </div>
            </div>

            {/* 父のレビュー */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">論理派パパ</p>
              <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.father.background }}>
                <p>{product.reviews.father}</p>
              </div>
            </div>

            {/* 母のレビュー */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">共感派ママ</p>
              <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.mother.background }}>
                <p>{product.reviews.mother}</p>
              </div>
            </div>

            {/* 商品情報 */}
            <div className="mt-6 border-t pt-4">
              <h4 className="text-base font-medium text-gray-800 mb-2">
                {copy.heading}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {copy.subheading}
              </p>
              <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-900">
                      ¥{product.price.toLocaleString()}
                    </span>
                    <a
                      href={product.affiliateUrl}
                      onClick={handleClick}
                      target="_blank"
                      rel="nofollow noopener"
                      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      詳しく見てみる
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
              <div className="text-xs text-gray-500 mt-2 text-right">
                <span className="mr-2">PR</span>
                ※価格は変更される場合があります
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}