/**
 * src/patch/index.ts のテスト
 */

import * as Patch from '@/patch';
import { describe, expect, it } from 'vitest';

describe('Patch Module', () => {
  describe('exports', () => {
    it('should export apply functions', () => {
      expect(Patch.useApplyPatch).toBeDefined();
      expect(typeof Patch.useApplyPatch).toBe('function');
    });

    it('should export nested accessor functions', () => {
      expect(Patch.getNestedValue).toBeDefined();
      expect(Patch.setNestedValue).toBeDefined();
      expect(Patch.deleteNestedValue).toBeDefined();
      expect(typeof Patch.getNestedValue).toBe('function');
      expect(typeof Patch.setNestedValue).toBe('function');
      expect(typeof Patch.deleteNestedValue).toBe('function');
    });

    it('should export array deletion functions', () => {
      expect(Patch.useArrayDeletion).toBeDefined();
      expect(typeof Patch.useArrayDeletion).toBe('function');
    });

    it('should export convert functions', () => {
      expect(Patch.convertPatchToMicrodiffResult).toBeDefined();
      expect(Patch.convertMicrodiffResultToPatch).toBeDefined();
      expect(typeof Patch.convertPatchToMicrodiffResult).toBe('function');
      expect(typeof Patch.convertMicrodiffResultToPatch).toBe('function');
    });

    it('should export create functions', () => {
      expect(Patch.createPatch).toBeDefined();
      expect(typeof Patch.createPatch).toBe('function');
    });

    it('should export microdiff functions', () => {
      expect(Patch.calculateDiff).toBeDefined();
      expect(typeof Patch.calculateDiff).toBe('function');
    });

    it('should export type guard functions', () => {
      expect(Patch.isMicrodiffChange).toBeDefined();
      expect(Patch.isMicrodiffChangeType).toBeDefined();
      expect(Patch.isMicrodiffOptions).toBeDefined();
      expect(Patch.isMicrodiffPath).toBeDefined();
      expect(Patch.isMicrodiffResult).toBeDefined();
      expect(Patch.isMicrodiffSource).toBeDefined();
      expect(typeof Patch.isMicrodiffChange).toBe('function');
      expect(typeof Patch.isMicrodiffChangeType).toBe('function');
      expect(typeof Patch.isMicrodiffOptions).toBe('function');
      expect(typeof Patch.isMicrodiffPath).toBe('function');
      expect(typeof Patch.isMicrodiffResult).toBe('function');
      expect(typeof Patch.isMicrodiffSource).toBe('function');
    });

    it('should export types and constants', () => {
      expect(Patch.MicrodiffChangeType).toBeDefined();
      expect(Patch.DeltaCalculationError).toBeDefined();
    });
  });

  describe('functionality', () => {
    it('should work with patch creation and application', () => {
      const source = { user: { name: 'Alice', age: 30 } };
      const target = { user: { name: 'Bob', age: 31 } };

      // パッチの作成
      const patch = Patch.createPatch(source, target);
      expect(patch).toBeDefined();
      expect(patch.diff).toBeDefined();

      // パッチの適用
      const applyPatch = Patch.useApplyPatch();
      const result = applyPatch.applyPatch(source, patch);
      expect(result).toEqual(target);
    });

    it('should work with nested value access', () => {
      const obj = { user: { name: 'Alice', age: 30 } };

      // 値の取得
      const name = Patch.getNestedValue(obj, ['user', 'name']);
      expect(name).toBe('Alice');

      // 値の設定
      Patch.setNestedValue(obj, ['user', 'name'], 'Bob');
      expect(obj.user.name).toBe('Bob');

      // 値の削除
      Patch.deleteNestedValue(obj, ['user', 'age']);
      expect(obj.user.age).toBeUndefined();
    });

    it('should work with array deletion', () => {
      const arrayDeletion = Patch.useArrayDeletion();
      expect(arrayDeletion).toBeDefined();
      expect(typeof arrayDeletion.scheduleArrayDeletion).toBe('function');
      expect(typeof arrayDeletion.executeAllDeletions).toBe('function');
    });

    it('should work with microdiff integration', () => {
      const source = { a: 1, b: 2 };
      const target = { a: 1, b: 3, c: 4 };

      const diff = Patch.calculateDiff(source, target);
      expect(Array.isArray(diff)).toBe(true);
      expect(diff.length).toBeGreaterThan(0);
    });

    it('should work with type guards', () => {
      const source = { a: 1 };
      const target = { a: 2 };

      expect(Patch.isMicrodiffSource(source)).toBe(true);
      expect(Patch.isMicrodiffSource('string')).toBe(false);

      const diff = Patch.calculateDiff(source, target);
      expect(Patch.isMicrodiffResult(diff)).toBe(true);
      expect(Patch.isMicrodiffResult('not array')).toBe(false);

      if (diff.length > 0) {
        expect(Patch.isMicrodiffChange(diff[0])).toBe(true);
        expect(Patch.isMicrodiffChangeType(diff[0].type)).toBe(true);
      }
    });
  });
});
