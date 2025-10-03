/**
 * src/patch/apply/apply.ts のテスト
 */

import { handleRemoveOperation, useApplyPatch } from '@/patch/apply/apply';
import { useArrayDeletion } from '@/patch/apply/array-deletion';
import { MicrodiffChangeType } from '@/patch/microdiff';
import { describe, expect, it } from 'vitest';

describe('Patch Apply', () => {
  describe('useApplyPatch', () => {
    it('should create apply patch function', () => {
      const applyPatch = useApplyPatch();
      expect(applyPatch).toBeDefined();
      expect(typeof applyPatch.applyPatch).toBe('function');
    });

    it('should apply patch to object', () => {
      const source: any = { user: { name: 'Alice', age: 30 } };
      const patch = {
        diff: [
          {
            type: MicrodiffChangeType.Change,
            path: ['user', 'name'],
            value: 'Bob',
            oldValue: 'Alice',
          },
        ],
      };

      const applyPatch = useApplyPatch();
      const result = applyPatch.applyPatch(source, patch);
      expect(result).toBeDefined();
    });

    it('should handle create operations', () => {
      const source: any = { user: { name: 'Alice' } };
      const patch = {
        diff: [
          {
            type: MicrodiffChangeType.Create,
            path: ['user', 'age'],
            value: 30,
          },
        ],
      };

      const applyPatch = useApplyPatch();
      const result = applyPatch.applyPatch(source, patch);
      expect(result).toHaveProperty('user.age', 30);
    });

    it('should handle remove operations', () => {
      const source: any = { user: { name: 'Alice', age: 30 } };
      const patch = {
        diff: [
          {
            type: MicrodiffChangeType.Remove,
            path: ['user', 'age'],
            oldValue: 30,
          },
        ],
      };

      const applyPatch = useApplyPatch();
      const result = applyPatch.applyPatch(source, patch);
      expect(result).toHaveProperty('user');
      expect(result).not.toHaveProperty('user.age');
    });

    it('should handle array operations', () => {
      const source: any = { items: [1, 2, 3] };
      const patch = {
        diff: [
          {
            type: MicrodiffChangeType.Remove,
            path: ['items', 1],
            oldValue: 2,
          },
        ],
      };

      const applyPatch = useApplyPatch();
      const result = applyPatch.applyPatch(source, patch);
      // 配列削除は遅延実行されるため、削除マーカーが残る
      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe('handleRemoveOperation', () => {
    it('should handle object property removal', () => {
      const source = { user: { name: 'Alice', age: 30 } };
      const path = ['user', 'age'];

      handleRemoveOperation(source, path, useArrayDeletion());
      expect(source.user.age).toBeUndefined();
    });

    it('should handle array element removal', () => {
      const source = { items: [1, 2, 3] };
      const path = ['items', 1];

      handleRemoveOperation(source, path, useArrayDeletion());
      // 配列の削除は遅延実行されるため、即座には反映されない
      expect(source.items).toBeDefined();
    });
  });
});
