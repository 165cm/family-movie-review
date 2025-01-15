// src/app/components/FamilyScore/index.tsx
import React from 'react';
import { FamilyScores } from '@/types/movie';
import { Rating } from '@/app/components/ui/rating';
import { formatIndividualScore } from '@/app/lib/utils/score';

type FamilyScoreVariant = 'default' | 'compact';

interface FamilyScoreProps {
  scores: FamilyScores;
  variant?: FamilyScoreVariant;
  className?: string;
}

interface ScoreItemProps {
  label: string;
  score: number;
  variant: FamilyScoreVariant;
}

const FAMILY_LABELS = {
  father: '父',
  mother: '母',
  bigSister: '姉',
  littleSister: '妹'
} as const;

function ScoreItem({ label, score, variant }: ScoreItemProps) {
  const { displayScore, starRating } = formatIndividualScore(score);

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1 text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">{displayScore}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm">{displayScore}</span>
        <Rating score={starRating} size="sm" />
      </div>
    </div>
  );
}

export function FamilyScore({ 
  scores, 
  variant = 'default',
  className = '' 
}: FamilyScoreProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {(Object.entries(scores) as [keyof FamilyScores, number][]).map(([key, score]) => (
          <ScoreItem
            key={key}
            label={FAMILY_LABELS[key]}
            score={score}
            variant="compact"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {(Object.entries(scores) as [keyof FamilyScores, number][]).map(([key, score]) => (
        <ScoreItem
          key={key}
          label={FAMILY_LABELS[key]}
          score={score}
          variant="default"
        />
      ))}
    </div>
  );
}