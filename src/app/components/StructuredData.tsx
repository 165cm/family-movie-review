// src/app/components/StructuredData.tsx
'use client';

import Script from 'next/script';
import type { Movie } from '@/types/movie';

interface StructuredDataProps {
  movie: Movie;
}

export default function StructuredData({ movie }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.name,
    description: movie.synopsis,
    director: {
      '@type': 'Person',
      name: movie.director
    },
    actor: movie.cast.map(actor => ({
      '@type': 'Person',
      name: actor
    })),
    datePublished: movie.watchedDate,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.totalScore / 2,
      bestRating: 5,
      worstRating: 0,
      ratingCount: 4
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: movie.familyScores.father / 2,
          bestRating: 5,
          worstRating: 0
        },
        author: {
          '@type': 'Person',
          name: '父（論理派パパ）'
        },
        reviewBody: movie.reviews.father || ''
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: movie.familyScores.mother / 2,
          bestRating: 5,
          worstRating: 0
        },
        author: {
          '@type': 'Person',
          name: '母（共感派ママ）'
        },
        reviewBody: movie.reviews.mother || ''
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: movie.familyScores.bigSister / 2,
          bestRating: 5,
          worstRating: 0
        },
        author: {
          '@type': 'Person',
          name: '姉（探究派お姉ちゃん）'
        },
        reviewBody: movie.reviews.bigSister || ''
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: movie.familyScores.littleSister / 2,
          bestRating: 5,
          worstRating: 0
        },
        author: {
          '@type': 'Person',
          name: '妹（エンターテイメント派妹）'
        },
        reviewBody: movie.reviews.littleSister || ''
      }
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      strategy="afterInteractive"
    />
  );
}