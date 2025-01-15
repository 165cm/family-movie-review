// src/app/components/BreadcrumbNav/index.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbNavProps {
  genre: string;
  movieName: string;
}

export function BreadcrumbNav({ genre, movieName }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 my-4">
      <Link 
        href="/movies" 
        className="hover:text-gray-900"
      >
        映画一覧
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link 
        href={`/movies?genre=${encodeURIComponent(genre)}`}
        className="hover:text-gray-900"
      >
        {genre}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">
        {movieName}
      </span>
    </nav>
  );
}