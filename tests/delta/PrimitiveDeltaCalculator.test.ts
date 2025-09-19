/**
 * PrimitiveDeltaCalculator のテスト
 */

import { calculatePrimitiveDelta } from '@/delta/PrimitiveDeltaCalculator';
import { describe, expect, it } from 'vitest';

describe('PrimitiveDeltaCalculator', () => {
  describe('calculatePrimitiveDelta', () => {
    it('同じプリミティブ値の場合は変更なし', () => {
      const result = calculatePrimitiveDelta('hello', 'hello');
      expect(result.delta.changeCount).toBe(0);
      expect(result.delta.changes['__value__'].type).toBe('unchanged');
    });

    it('異なるプリミティブ値の場合は変更あり', () => {
      const result = calculatePrimitiveDelta('hello', 'world');
      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.changes['__value__'].type).toBe('modified');
      expect(result.delta.changes['__value__'].oldValue).toBe('hello');
      expect(result.delta.changes['__value__'].newValue).toBe('world');
    });

    it('型が異なる場合は型変更も記録', () => {
      const result = calculatePrimitiveDelta('hello', 123);
      expect(result.delta.changeCount).toBe(2);
      expect(result.delta.changes['__type__']).toBeDefined();
      expect(result.delta.changes['__type__'].type).toBe('modified');
      expect(result.delta.changes['__type__'].oldValue).toBe('string');
      expect(result.delta.changes['__type__'].newValue).toBe('number');
      expect(result.delta.changes['__value__']).toBeDefined();
      expect(result.delta.changes['__value__'].type).toBe('modified');
    });

    it('数値の差分を計算する', () => {
      const result = calculatePrimitiveDelta(42, 100);
      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.changes['__value__'].oldValue).toBe(42);
      expect(result.delta.changes['__value__'].newValue).toBe(100);
    });

    it('真偽値の差分を計算する', () => {
      const result = calculatePrimitiveDelta(true, false);
      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.changes['__value__'].oldValue).toBe(true);
      expect(result.delta.changes['__value__'].newValue).toBe(false);
    });

    it('nullとundefinedの差分を計算する', () => {
      const result = calculatePrimitiveDelta(null, undefined);
      expect(result.delta.changeCount).toBe(2);
      expect(result.delta.changes['__type__'].oldValue).toBe('object');
      expect(result.delta.changes['__type__'].newValue).toBe('undefined');
    });

    it('プリミティブでない値の場合はエラー', () => {
      expect(() => {
        calculatePrimitiveDelta({}, 'hello');
      }).toThrow('Both values must be primitive');
    });

    it('計算時間とプロパティ数を記録する', () => {
      const result = calculatePrimitiveDelta('hello', 'world');
      expect(result.duration).toBeGreaterThan(0);
      expect(result.totalProperties).toBe(1);
    });
  });
});
