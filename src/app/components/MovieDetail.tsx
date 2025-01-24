'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Movie } from '@/types/movie';
import YouTubePlayer from './YouTubePlayer';
import { MovieScoreOverview } from './MovieDetail/MovieScoreOverview';
import { MovieSynopsisAndHighlights } from './MovieDetail/MovieSynopsisAndHighlights';
import { FamilyReviews } from './MovieDetail/FamilyReviews';

interface MovieDetailProps {
  movie: Movie;
}

export default function MovieDetail({ movie }: MovieDetailProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          『{movie.name}』こどもに見せても大丈夫?
        </h1>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {new Date(movie.watchedDate).toLocaleDateString('ja-JP')}
          </span>
          {movie.director && (
            <span className="inline-flex items-center">
              監督: {movie.director}
            </span>
          )}
        </div>
      </div>

      {movie.viewingUrl && (
        <div className="mb-8">
          <YouTubePlayer url={movie.viewingUrl} />
        </div>
      )}

      <MovieScoreOverview scores={movie.familyScores} />
      
      <MovieSynopsisAndHighlights 
        synopsis={movie.synopsis} 
        highlights={movie.highlights} 
      />
      
      <FamilyReviews reviews={movie.reviews} />
    </div>
  );
}