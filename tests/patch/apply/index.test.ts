/**
 * src/patch/apply/index.ts のテスト
 */

import * as Apply from '@/patch/apply';
import { describe, expect, it } from 'vitest';

describe('Patch Apply Module', () => {
  describe('exports', () => {
    it('should export apply functions', () => {
      expect(Apply.useApplyPatch).toBeDefined();
      expect(Apply.handleRemoveOperation).toBeDefined();
      expect(typeof Apply.useApplyPatch).toBe('function');
      expect(typeof Apply.handleRemoveOperation).toBe('function');
    });

    it('should export nested accessor functions', () => {
      expect(Apply.getNestedValue).toBeDefined();
      expect(Apply.setNestedValue).toBeDefined();
      expect(Apply.deleteNestedValue).toBeDefined();
      expect(typeof Apply.getNestedValue).toBe('function');
      expect(typeof Apply.setNestedValue).toBe('function');
      expect(typeof Apply.deleteNestedValue).toBe('function');
    });

    it('should export array deletion functions', () => {
      expect(Apply.useArrayDeletion).toBeDefined();
      expect(typeof Apply.useArrayDeletion).toBe('function');
    });
  });

  describe('functionality', () => {
    it('should work with patch application', () => {
      const source = { user: { name: 'Alice', age: 30 } };
      const target = { user: { name: 'Bob', age: 31 } };

      // パッチの適用
      const applyPatch = Apply.useApplyPatch();
      const patch = { diff: [] }; // 簡略化されたパッチ
      const result = applyPatch.applyPatch(source, patch);
      expect(result).toBeDefined();
    });

    it('should work with nested value operations', () => {
      const obj = { user: { name: 'Alice', age: 30 } };

      // 値の取得
      const name = Apply.getNestedValue(obj, ['user', 'name']);
      expect(name).toBe('Alice');

      // 値の設定
      Apply.setNestedValue(obj, ['user', 'name'], 'Bob');
      expect(obj.user.name).toBe('Bob');

      // 値の削除
      Apply.deleteNestedValue(obj, ['user', 'age']);
      expect(obj.user.age).toBeUndefined();
    });

    it('should work with array deletion', () => {
      const arrayDeletion = Apply.useArrayDeletion();
      expect(arrayDeletion).toBeDefined();
      expect(typeof arrayDeletion.scheduleArrayDeletion).toBe('function');
      expect(typeof arrayDeletion.executeAllDeletions).toBe('function');
    });
  });
});
