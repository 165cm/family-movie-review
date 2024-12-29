'use client';
// src/app/components/MovieDetail.tsx
import React from 'react';
import YouTubePlayer from './YouTubePlayer';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Clock } from 'lucide-react';
import { Movie } from '@/types/movie';
import { familyColors } from '@/app/lib/theme';
import ShareButton from './ShareButton';
import { Rating } from '@/app/components/ui/rating';

interface MovieDetailProps {
  movie: Movie;
}

const calculateAverageScore = (movieData: Movie): number => {
  const scores = [
    movieData.familyScores.father,
    movieData.familyScores.mother,
    movieData.familyScores.bigSister,
    movieData.familyScores.littleSister
  ].filter((score): score is number => typeof score === 'number' && !isNaN(score));
  
  if (!scores.length) return 0;
  
  // 10点満点から5点満点に変換し、0.5単位で四捨五入
  const rawScore = scores.reduce((a, b) => a + b, 0) / scores.length / 2;
  return Math.round(rawScore * 2) / 2;
};

const getScoreBackgroundColor = (score: number) => {
  if (score >= 4.5) return 'bg-yellow-100';
  if (score >= 3.5) return 'bg-green-100';
  if (score >= 2.5) return 'bg-blue-100';
  if (score >= 1.5) return 'bg-orange-100';
  return 'bg-red-100';
};

export default function MovieDetail({ movie }: MovieDetailProps) {
  const averageScore = calculateAverageScore(movie);
  
  // 各メンバーのスコアを5点満点に変換
  const familyScores = {
    father: movie.familyScores.father / 2,
    mother: movie.familyScores.mother / 2,
    bigSister: movie.familyScores.bigSister / 2,
    littleSister: movie.familyScores.littleSister / 2
  };

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

      {/* YouTube Preview */}
      {movie.viewingUrl && (
        <div className="mb-8">
          <YouTubePlayer url={movie.viewingUrl} />
        </div>
      )}

      {/* Score Overview */}
      <div className={`mb-8 p-6 rounded-lg ${getScoreBackgroundColor(averageScore)}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold mb-2">総合評価</h2>
            <div className="text-4xl font-bold mb-2">{averageScore}</div>
            <Rating score={averageScore} size="lg" />
          </div>
          <div className="col-span-2">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">父</span>
                <Rating score={familyScores.father} size="md" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">母</span>
                <Rating score={familyScores.mother} size="md" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">姉</span>
                <Rating score={familyScores.bigSister} size="md" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">妹</span>
                <Rating score={familyScores.littleSister} size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis and Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>あらすじ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {movie.synopsis ?? 'あらすじはまだ登録されていません。'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>見どころ</CardTitle>
          </CardHeader>
          <CardContent>
              {movie.highlights && movie.highlights.length > 0 ? (
                <ul className="space-y-2">
                  {movie.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                ) : (
                  <p className="text-gray-500">見どころはまだ登録されていません。</p>
                )}
          </CardContent>
        </Card>
      </div>

      {/* Family Reviews */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>家族の感想</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Father's Review */}
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback style={{ backgroundColor: familyColors.father.background, color: familyColors.father.primary }}>
                  父
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">論理派パパ</p>
                <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.father.background }}>
                  <p>{movie.reviews.father || 'レビューはまだありません'}</p>
                </div>
              </div>
            </div>

            {/* Mother's Review */}
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback style={{ backgroundColor: familyColors.mother.background, color: familyColors.mother.primary }}>
                  母
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">共感派ママ</p>
                <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.mother.background }}>
                  <p>{movie.reviews.mother || 'レビューはまだありません'}</p>
                </div>
              </div>
            </div>

            {/* Big Sister's Review */}
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback style={{ backgroundColor: familyColors.bigSister.background, color: familyColors.bigSister.primary }}>
                  姉
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">探究派お姉ちゃん</p>
                <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.bigSister.background }}>
                  <p>{movie.reviews.bigSister || 'レビューはまだありません'}</p>
                </div>
              </div>
            </div>

            {/* Little Sister's Review */}
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback style={{ backgroundColor: familyColors.littleSister.background, color: familyColors.littleSister.primary }}>
                  妹
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">エンターテイメント派妹</p>
                <div className="rounded-lg p-4" style={{ backgroundColor: familyColors.littleSister.background }}>
                <p>{movie.reviews.littleSister || 'レビューはまだありません'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Button */}
      <div className="flex justify-center gap-4 mt-8">
        <ShareButton />
      </div>
    </div>
  );
}