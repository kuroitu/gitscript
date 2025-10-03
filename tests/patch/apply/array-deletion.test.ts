/**
 * src/patch/apply/array-deletion.ts のテスト
 */

import { useArrayDeletion } from '@/patch/apply/array-deletion';
import { describe, expect, it } from 'vitest';

describe('Array Deletion', () => {
  describe('useArrayDeletion', () => {
    it('should create array deletion manager', () => {
      const arrayDeletion = useArrayDeletion();
      expect(arrayDeletion).toBeDefined();
      expect(typeof arrayDeletion.scheduleArrayDeletion).toBe('function');
      expect(typeof arrayDeletion.executeAllDeletions).toBe('function');
    });

    it('should schedule array element deletion', () => {
      const arrayDeletion = useArrayDeletion();
      const source = { items: [1, 2, 3, 4, 5] };

      // インデックス2の要素を削除予約
      arrayDeletion.scheduleArrayDeletion(source, ['items', 2]);

      // 削除を実行
      arrayDeletion.executeAllDeletions();

      // 削除後は要素が削除されている
      expect(source.items).toEqual([1, 2, 4, 5]);
    });

    it('should handle multiple array deletions', () => {
      const arrayDeletion = useArrayDeletion();
      const source = { items: [1, 2, 3, 4, 5] };

      // 複数の要素を削除予約
      arrayDeletion.scheduleArrayDeletion(source, ['items', 1]);
      arrayDeletion.scheduleArrayDeletion(source, ['items', 3]);

      // 削除を実行
      arrayDeletion.executeAllDeletions();

      // 削除後は指定された要素が削除されている
      expect(source.items).toEqual([1, 3, 5]);
    });

    it('should handle nested array deletions', () => {
      const arrayDeletion = useArrayDeletion();
      const source = {
        data: {
          items: [
            { id: 1, tags: ['tag1', 'tag2', 'tag3'] },
            { id: 2, tags: ['tag4', 'tag5'] },
          ],
        },
      };

      // ネストした配列の要素を削除予約
      arrayDeletion.scheduleArrayDeletion(source, [
        'data',
        'items',
        0,
        'tags',
        1,
      ]);

      // 削除を実行
      arrayDeletion.executeAllDeletions();

      // 削除後は指定された要素が削除されている
      expect(source.data.items[0].tags).toEqual(['tag1', 'tag3']);
    });

    it('should handle invalid paths gracefully', () => {
      const arrayDeletion = useArrayDeletion();
      const source = { items: [1, 2, 3] };

      // 存在しないパス
      expect(() => {
        arrayDeletion.scheduleArrayDeletion(source, ['nonexistent', 0]);
      }).not.toThrow();

      // 配列ではないオブジェクト
      expect(() => {
        arrayDeletion.scheduleArrayDeletion(source, ['items', 'not_number']);
      }).not.toThrow();

      // 空のパス
      expect(() => {
        arrayDeletion.scheduleArrayDeletion(source, []);
      }).not.toThrow();
    });

    it('should handle non-array targets', () => {
      const arrayDeletion = useArrayDeletion();
      const source = { user: { name: 'Alice' } };

      // 配列ではないオブジェクトを対象とした場合
      expect(() => {
        arrayDeletion.scheduleArrayDeletion(source, ['user', 0]);
      }).not.toThrow();

      // 実行してもエラーにならない
      expect(() => {
        arrayDeletion.executeAllDeletions();
      }).not.toThrow();
    });

    it('should handle out-of-bounds indices', () => {
      const arrayDeletion = useArrayDeletion();
      const source = { items: [1, 2, 3] };

      // 範囲外のインデックス
      expect(() => {
        arrayDeletion.scheduleArrayDeletion(source, ['items', 10]);
      }).not.toThrow();

      // 負のインデックス
      expect(() => {
        arrayDeletion.scheduleArrayDeletion(source, ['items', -1]);
      }).not.toThrow();

      // 実行してもエラーにならない
      expect(() => {
        arrayDeletion.executeAllDeletions();
      }).not.toThrow();
    });

    it('should handle empty arrays', () => {
      const arrayDeletion = useArrayDeletion();
      const source = { items: [] };

      // 空の配列に対する削除
      expect(() => {
        arrayDeletion.scheduleArrayDeletion(source, ['items', 0]);
      }).not.toThrow();

      // 実行してもエラーにならない
      expect(() => {
        arrayDeletion.executeAllDeletions();
      }).not.toThrow();
    });
  });
});
