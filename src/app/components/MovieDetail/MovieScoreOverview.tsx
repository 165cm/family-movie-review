'use client';

import { FamilyScores } from '@/types/family';
import { Rating } from '@/app/components/ui/rating';
import { calculateAverageScore, getScoreBackgroundColor } from '@/utils/movieScores';

interface MovieScoreOverviewProps {
  scores: FamilyScores;
}

export function MovieScoreOverview({ scores }: MovieScoreOverviewProps) {
  const averageScore = calculateAverageScore(scores);
  const familyScores = Object.entries(scores).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value / 2
  }), {} as FamilyScores);

  return (
    <div className={`mb-8 p-6 rounded-lg ${getScoreBackgroundColor(averageScore)}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-2xl font-bold mb-2">総合評価</h2>
          <div className="text-4xl font-bold mb-2">{averageScore}</div>
          <Rating score={averageScore} size="lg" />
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(familyScores).map(([member, score]) => (
              <div key={member} className="flex items-center justify-between">
                <span className="font-medium">
                  {member === 'father' ? '父' :
                   member === 'mother' ? '母' :
                   member === 'bigSister' ? '姉' : '妹'}
                </span>
                <Rating score={score} size="md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
