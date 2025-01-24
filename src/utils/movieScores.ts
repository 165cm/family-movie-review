import { FamilyScores } from '@/types/family';

export const calculateAverageScore = (scores: FamilyScores): number => {
  const validScores = Object.values(scores)
    .filter((score): score is number => typeof score === 'number' && !isNaN(score));
  
  if (!validScores.length) return 0;
  
  // 10点満点から5点満点に変換し、0.5単位で四捨五入
  const rawScore = validScores.reduce((a, b) => a + b, 0) / validScores.length / 2;
  return Math.round(rawScore * 2) / 2;
};

export const getScoreBackgroundColor = (score: number): string => {
  if (score >= 4.5) return 'bg-yellow-100';
  if (score >= 3.5) return 'bg-green-100';
  if (score >= 2.5) return 'bg-blue-100';
  if (score >= 1.5) return 'bg-orange-100';
  return 'bg-red-100';
};

export const convertToFivePointScale = (scores: FamilyScores): FamilyScores => {
  return Object.entries(scores).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value / 2
  }), {} as FamilyScores);
};
