/**
 * DeltaCalculator のテスト
 */

import {
  calculateDelta,
  calculateArrayDeltaSafe,
  calculateMapDeltaSafe,
  calculateObjectDeltaSafe,
  calculatePrimitiveDeltaSafe,
  calculateSetDeltaSafe,
} from '@/delta/DeltaCalculator';
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
      const result = calculateDelta(
        { name: 'John' },
        { name: 'Jane' },
      );
      expect(result.delta.changeCount).toBe(1);
    });

    it('Setの差分を計算する', () => {
      const oldSet = new Set([1, 2, 3]);
      const newSet = new Set([1, 2, 4]);
      const result = calculateDelta(oldSet, newSet);
      expect(result.delta.changeCount).toBeGreaterThan(0);
    });

    it('Mapの差分を計算する', () => {
      const oldMap = new Map([['a', 1], ['b', 2]]);
      const newMap = new Map([['a', 1], ['b', 3]]);
      const result = calculateDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
    });

    it('型が異なる場合はプリミティブとして扱う', () => {
      const result = calculateDelta('hello', 123);
      expect(result.delta.changeCount).toBe(2); // 型変更と値変更
    });
  });

  describe('calculatePrimitiveDeltaSafe', () => {
    it('プリミティブ値の差分を計算する', () => {
      const result = calculatePrimitiveDeltaSafe('hello', 'world');
      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.changes['__value__'].type).toBe('modified');
    });

    it('同じ値の場合は変更なし', () => {
      const result = calculatePrimitiveDeltaSafe('hello', 'hello');
      expect(result.delta.changeCount).toBe(0);
    });

    it('型が異なる場合は型変更も記録', () => {
      const result = calculatePrimitiveDeltaSafe('hello', 123);
      expect(result.delta.changeCount).toBe(2);
      expect(result.delta.changes['__type__']).toBeDefined();
      expect(result.delta.changes['__value__']).toBeDefined();
    });
  });

  describe('calculateArrayDeltaSafe', () => {
    it('配列の差分を計算する', () => {
      const result = calculateArrayDeltaSafe([1, 2, 3], [1, 4, 3]);
      expect(result.delta.changeCount).toBe(1);
    });
  });

  describe('calculateObjectDeltaSafe', () => {
    it('オブジェクトの差分を計算する', () => {
      const result = calculateObjectDeltaSafe(
        { name: 'John' },
        { name: 'Jane' },
      );
      expect(result.delta.changeCount).toBe(1);
    });
  });

  describe('calculateSetDeltaSafe', () => {
    it('Setの差分を計算する', () => {
      const oldSet = new Set([1, 2, 3]);
      const newSet = new Set([1, 2, 4]);
      const result = calculateSetDeltaSafe(oldSet, newSet);
      expect(result.delta.changeCount).toBeGreaterThan(0);
    });
  });

  describe('calculateMapDeltaSafe', () => {
    it('Mapの差分を計算する', () => {
      const oldMap = new Map([['a', 1], ['b', 2]]);
      const newMap = new Map([['a', 1], ['b', 3]]);
      const result = calculateMapDeltaSafe(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
    });
  });
});
