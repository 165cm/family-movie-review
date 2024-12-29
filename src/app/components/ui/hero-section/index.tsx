// src/components/ui/hero-section/index.tsx
import React from 'react';
import { MovieListItem } from '@/types/movie';
import Link from 'next/link';

export interface HeroSectionProps {
  featuredMovie?: MovieListItem;
  className?: string;
}

export function HeroSection({ featuredMovie, className = '' }: HeroSectionProps) {
  return (
    <div className={`relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            家族で観る映画レビュー
          </h1>
          <p className="text-lg mb-8">
            中学生の子どもと一緒に観られる映画を家族全員でレビュー
          </p>
          
          {featuredMovie && (
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
              <span className="text-sm font-semibold text-yellow-300">
                今週のおすすめ
              </span>
              <h2 className="text-2xl font-bold mt-2">
                {featuredMovie.name}
              </h2>
              <p className="mt-2 line-clamp-2">
                {featuredMovie.synopsis}
              </p>
              <Link 
                href={`/movies/${featuredMovie.slug}`}
                className="inline-block mt-4 px-6 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
              >
                詳しく見る
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}