/**
 * src/patch/microdiff/wrapper.ts のテスト
 */

import { DeltaCalculationError } from '@/patch/errors';
import { calculateDiff } from '@/patch/microdiff/wrapper';
import { describe, expect, it } from 'vitest';

describe('Microdiff Wrapper', () => {
  describe('calculateDiff', () => {
    it('should calculate diff between two objects', () => {
      const oldSource = { name: 'Alice', age: 30 };
      const newSource = { name: 'Bob', age: 31 };

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should calculate diff for nested objects', () => {
      const oldSource = { user: { name: 'Alice', profile: { age: 30 } } };
      const newSource = { user: { name: 'Bob', profile: { age: 31 } } };

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should calculate diff for arrays', () => {
      const oldSource = { items: [1, 2, 3] };
      const newSource = { items: [1, 2, 4] };

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty objects', () => {
      const oldSource = {};
      const newSource = {};

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle identical objects', () => {
      const oldSource = { name: 'Alice', age: 30 };
      const newSource = { name: 'Alice', age: 30 };

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle object to null changes', () => {
      const oldSource = { name: 'Alice' };
      const newSource = null;

      expect(() => calculateDiff(oldSource, newSource as any)).toThrow();
    });

    it('should handle null to object changes', () => {
      const oldSource = null;
      const newSource = { name: 'Alice' };

      expect(() => calculateDiff(oldSource as any, newSource)).toThrow();
    });

    it('should handle undefined values', () => {
      const oldSource = { name: 'Alice', age: undefined };
      const newSource = { name: 'Alice', age: 30 };

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should accept options parameter', () => {
      const oldSource = { name: 'Alice' };
      const newSource = { name: 'Bob' };
      const options = { cyclesFix: true };

      const result = calculateDiff(oldSource, newSource, options);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle default options', () => {
      const oldSource = { name: 'Alice' };
      const newSource = { name: 'Bob' };

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw DeltaCalculationError on microdiff failure', () => {
      // nullとの比較でmicrodiffを失敗させる
      expect(() => {
        calculateDiff({ name: 'Alice' }, null as any);
      }).toThrow(DeltaCalculationError);
    });

    it('should include original error in DeltaCalculationError', () => {
      const circularObj: any = { name: 'Alice' };
      circularObj.self = circularObj;

      try {
        calculateDiff(circularObj, { name: 'Bob' });
      } catch (error) {
        expect(error).toBeInstanceOf(DeltaCalculationError);
        expect((error as DeltaCalculationError).message).toBe(
          'Failed to calculate diff using microdiff',
        );
        expect((error as DeltaCalculationError).cause).toBeDefined();
      }
    });

  });

  describe('result structure', () => {
    it('should return array of diff objects', () => {
      const oldSource = { name: 'Alice' };
      const newSource = { name: 'Bob' };

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        const diff = result[0];
        expect(diff).toHaveProperty('type');
        expect(diff).toHaveProperty('path');
        expect(Array.isArray(diff.path)).toBe(true);
      }
    });

    it('should handle complex nested structures', () => {
      const oldSource = {
        users: [
          { id: 1, name: 'Alice', settings: { theme: 'dark' } },
          { id: 2, name: 'Bob', settings: { theme: 'light' } },
        ],
      };
      const newSource = {
        users: [
          { id: 1, name: 'Alice Updated', settings: { theme: 'dark' } },
          { id: 2, name: 'Bob', settings: { theme: 'light' } },
        ],
      };

      const result = calculateDiff(oldSource, newSource);

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
