/**
 * DeltaCalculator のテスト
 */

import { calculateDelta } from '@/delta/DeltaCalculator';
import { describe, expect, it } from 'vitest';

describe('DeltaCalculator', () => {
  describe('calculateDelta', () => {
    it('プリミティブ値の差分を計算する', () => {
      const result = calculateDelta('hello', 'world');
      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.changes['__value__'].type).toBe('modified');
    });

    it('配列の差分を計算する', () => {
      const result = calculateDelta([1, 2, 3], [1, 4, 3]);
      expect(result.delta.changeCount).toBe(1);
    });

    it('オブジェクトの差分を計算する', () => {
      const result = calculateDelta({ name: 'John' }, { name: 'Jane' });
      expect(result.delta.changeCount).toBe(1);
    });

    it('Setの差分を計算する', () => {
      const oldSet = new Set([1, 2, 3]);
      const newSet = new Set([1, 2, 4]);
      const result = calculateDelta(oldSet, newSet);
      expect(result.delta.changeCount).toBeGreaterThan(0);
    });

    it('Mapの差分を計算する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const newMap = new Map([
        ['a', 1],
        ['b', 3],
      ]);
      const result = calculateDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
    });

    it('型が異なる場合はプリミティブとして扱う', () => {
      const result = calculateDelta('hello', 123);
      expect(result.delta.changeCount).toBe(2); // 型変更と値変更
    });
  });
});
