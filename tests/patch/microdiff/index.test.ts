/**
 * src/patch/microdiff/index.ts のテスト
 */

import * as Microdiff from '@/patch/microdiff';
import { MicrodiffChangeType } from '@/patch/microdiff';
import { describe, expect, it } from 'vitest';

describe('Microdiff Module', () => {
  describe('exports', () => {
    it('should export wrapper functions', () => {
      expect(Microdiff.calculateDiff).toBeDefined();
      expect(typeof Microdiff.calculateDiff).toBe('function');
    });

    it('should export type guard functions', () => {
      expect(Microdiff.isMicrodiffChange).toBeDefined();
      expect(Microdiff.isMicrodiffChangeType).toBeDefined();
      expect(Microdiff.isMicrodiffOptions).toBeDefined();
      expect(Microdiff.isMicrodiffPath).toBeDefined();
      expect(Microdiff.isMicrodiffResult).toBeDefined();
      expect(Microdiff.isMicrodiffSource).toBeDefined();
      expect(typeof Microdiff.isMicrodiffChange).toBe('function');
      expect(typeof Microdiff.isMicrodiffChangeType).toBe('function');
      expect(typeof Microdiff.isMicrodiffOptions).toBe('function');
      expect(typeof Microdiff.isMicrodiffPath).toBe('function');
      expect(typeof Microdiff.isMicrodiffResult).toBe('function');
      expect(typeof Microdiff.isMicrodiffSource).toBe('function');
    });

    it('should export types and constants', () => {
      expect(Microdiff.MicrodiffChangeType).toBeDefined();
      expect(Microdiff.MicrodiffChangeType.Create).toBe('CREATE');
      expect(Microdiff.MicrodiffChangeType.Change).toBe('CHANGE');
      expect(Microdiff.MicrodiffChangeType.Remove).toBe('REMOVE');
    });
  });

  describe('functionality', () => {
    it('should calculate diff between objects', () => {
      const source = { user: { name: 'Alice', age: 30 } };
      const target = { user: { name: 'Bob', age: 31 } };

      const diff = Microdiff.calculateDiff(source, target);
      expect(Array.isArray(diff)).toBe(true);
      expect(diff.length).toBeGreaterThan(0);
    });

    it('should calculate diff between arrays', () => {
      const source = [1, 2, 3];
      const target = [1, 3, 4];

      const diff = Microdiff.calculateDiff(source, target);
      expect(Array.isArray(diff)).toBe(true);
    });

    it('should handle type guards correctly', () => {
      const source = { user: { name: 'Alice' } };
      const target = { user: { name: 'Bob' } };

      // MicrodiffSource
      expect(Microdiff.isMicrodiffSource(source)).toBe(true);
      expect(Microdiff.isMicrodiffSource([1, 2, 3])).toBe(true);
      expect(Microdiff.isMicrodiffSource('string')).toBe(false);

      // MicrodiffResult
      const diff = Microdiff.calculateDiff(source, target);
      expect(Microdiff.isMicrodiffResult(diff)).toBe(true);
      expect(Microdiff.isMicrodiffResult('not array')).toBe(false);

      // MicrodiffChange
      if (diff.length > 0) {
        expect(Microdiff.isMicrodiffChange(diff[0])).toBe(true);
        expect(Microdiff.isMicrodiffChange('not change')).toBe(false);
      }

      // MicrodiffChangeType
      if (diff.length > 0) {
        expect(Microdiff.isMicrodiffChangeType(diff[0].type)).toBe(true);
        expect(Microdiff.isMicrodiffChangeType('INVALID')).toBe(false);
      }

      // MicrodiffPath
      if (diff.length > 0) {
        expect(Microdiff.isMicrodiffPath(diff[0].path)).toBe(true);
        expect(Microdiff.isMicrodiffPath('not path')).toBe(false);
      }

      // MicrodiffOptions
      expect(Microdiff.isMicrodiffOptions({})).toBe(true);
      expect(Microdiff.isMicrodiffOptions({ cyclesFix: true })).toBe(true);
      expect(Microdiff.isMicrodiffOptions('not options')).toBe(false);
    });

    it('should handle empty objects', () => {
      const source = {};
      const target = { newField: 'value' };

      const diff = Microdiff.calculateDiff(source, target);
      expect(Array.isArray(diff)).toBe(true);
    });

    it('should handle identical objects', () => {
      const source = { user: { name: 'Alice' } };
      const target = { user: { name: 'Alice' } };

      const diff = Microdiff.calculateDiff(source, target);
      expect(Array.isArray(diff)).toBe(true);
      // 同一オブジェクトの場合は差分がない可能性がある
    });

    it('should handle primitive values', () => {
      const source = { value: 'hello' };
      const target = { value: 'world' };

      const diff = Microdiff.calculateDiff(source, target);
      expect(Array.isArray(diff)).toBe(true);
    });

    it('should handle nested structures', () => {
      const source = {
        data: {
          users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ],
        },
      };
      const target = {
        data: {
          users: [
            { id: 1, name: 'Alice Updated' },
            { id: 3, name: 'Charlie' },
          ],
        },
      };

      const diff = Microdiff.calculateDiff(source, target);
      expect(Array.isArray(diff)).toBe(true);
    });
  });
});
