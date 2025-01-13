// src/app/lib/utils/score.test.ts
import { describe, expect, test } from '@jest/globals';
import { calculateTotalScore, formatIndividualScore } from './score';

describe('calculateTotalScore', () => {
  test('通常の評価パターン', () => {
    const scores = {
      father: 8.0,
      mother: 7.5,
      bigSister: 9.0,
      littleSister: 6.5
    };
    const result = calculateTotalScore(scores);
    expect(result.displayScore).toBe(7.8);
    expect(result.starRating).toBe(3.5);
  });

  test('満点評価のケース', () => {
    const scores = {
      father: 10,
      mother: 10,
      bigSister: 10,
      littleSister: 10
    };
    const result = calculateTotalScore(scores);
    expect(result.displayScore).toBe(10.0);
    expect(result.starRating).toBe(5.0);
  });

  test('最低点評価のケース', () => {
    const scores = {
      father: 0,
      mother: 0,
      bigSister: 0,
      littleSister: 0
    };
    const result = calculateTotalScore(scores);
    expect(result.displayScore).toBe(0.0);
    expect(result.starRating).toBe(0.0);
  });

  test('一部が未評価のケース', () => {
    const scores = {
      father: 8,
      mother: NaN,
      bigSister: 7,
      littleSister: undefined as unknown as number
    };
    const result = calculateTotalScore(scores);
    expect(result.displayScore).toBe(7.5);
    expect(result.starRating).toBe(3.5);
  });
});

describe('formatIndividualScore', () => {
  test('通常のスコア変換', () => {
    const result = formatIndividualScore(7.8);
    expect(result.displayScore).toBe(7.8);
    expect(result.starRating).toBe(3.5);
  });

  test('範囲外の値の処理', () => {
    expect(formatIndividualScore(-1).displayScore).toBe(0);
    expect(formatIndividualScore(11).displayScore).toBe(0);
  });

  test('無効な入力の処理', () => {
    expect(formatIndividualScore(NaN).displayScore).toBe(0);
    expect(formatIndividualScore(undefined as unknown as number).displayScore).toBe(0);
  });
  test('無効なスコアの除外', () => {
    const scores = {
      father: 8,
      mother: 11, // 範囲外
      bigSister: -1, // 範囲外
      littleSister: 7
    };
    const result = calculateTotalScore(scores);
    expect(result.displayScore).toBe(7.5); // 有効なスコアの平均
  });
});