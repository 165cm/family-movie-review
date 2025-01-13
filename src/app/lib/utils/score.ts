// src/lib/score.ts
import { FamilyScores } from '@/types/movie';

export interface ScoreResult {
  totalScore: number;    // データベース用の生スコア（10点満点）
  displayScore: number;  // 表示用スコア（10点満点、小数点第1位）
  starRating: number;    // 星表示用（5点満点、0.5単位）
}

export const calculateTotalScore = (familyScores: FamilyScores): ScoreResult => {
  const validScores = Object.entries(familyScores).filter(
    (entry): entry is [keyof typeof familyScores, number] => {
      const [, score] = entry;
      return typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 10;
    }
  );
  
  if (!validScores.length) {
    return { totalScore: 0, displayScore: 0, starRating: 0 };
  }

  // 10点満点のスコア計算
  const totalScore = validScores.reduce((sum, [, score]) => sum + score, 0) / validScores.length;
  
  return {
    totalScore,
    displayScore: Number(totalScore.toFixed(1)),
    starRating: Math.floor((totalScore / 2) * 2) / 2
  };
};

export const formatIndividualScore = (score: number): {
  displayScore: number;
  starRating: number;
} => {
  if (typeof score !== 'number' || isNaN(score) || score < 0 || score > 10) {
    return { displayScore: 0, starRating: 0 };
  }

  return {
    displayScore: Number(score.toFixed(1)),
    starRating: score / 2 // 10点満点を5点満点に変換
  };
};