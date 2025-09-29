/**
 * src/patch/apply/nested-accessor.ts のテスト
 */

import {
  getNestedValue,
  setNestedValue,
  deleteNestedValue,
} from '@/patch/apply/nested-accessor';
import { describe, expect, it } from 'vitest';

describe('Nested Accessor', () => {
  describe('getNestedValue', () => {
    it('should get nested object values', () => {
      const obj = { user: { name: 'Alice', age: 30 } };

      expect(getNestedValue(obj, ['user', 'name'])).toBe('Alice');
      expect(getNestedValue(obj, ['user', 'age'])).toBe(30);
    });

    it('should get nested array values', () => {
      const obj = { items: [{ id: 1, name: 'item1' }, { id: 2, name: 'item2' }] };

      expect(getNestedValue(obj, ['items', 0, 'name'])).toBe('item1');
      expect(getNestedValue(obj, ['items', 1, 'id'])).toBe(2);
    });

    it('should return undefined for non-existent paths', () => {
      const obj = { user: { name: 'Alice' } };

      expect(getNestedValue(obj, ['user', 'age'])).toBeUndefined();
      expect(getNestedValue(obj, ['nonexistent'])).toBeUndefined();
      expect(getNestedValue(obj, ['user', 'nonexistent'])).toBeUndefined();
    });

    it('should handle empty path', () => {
      const obj = { user: { name: 'Alice' } };

      expect(getNestedValue(obj, [])).toBe(obj);
    });
  });

  describe('setNestedValue', () => {
    it('should set nested object values', () => {
      const obj = { user: { name: 'Alice' } };

      setNestedValue(obj, ['user', 'age'], 30);
      expect(obj.user.age).toBe(30);

      setNestedValue(obj, ['user', 'name'], 'Bob');
      expect(obj.user.name).toBe('Bob');
    });

    it('should set nested array values', () => {
      const obj = { items: [1, 2, 3] };

      setNestedValue(obj, ['items', 1], 99);
      expect(obj.items[1]).toBe(99);
    });

    it('should create nested objects if they do not exist', () => {
      const obj = {};

      setNestedValue(obj, ['user', 'name'], 'Alice');
      expect(obj.user.name).toBe('Alice');
    });

    it('should handle empty path', () => {
      const obj = { user: { name: 'Alice' } };

      setNestedValue(obj, [], { new: 'value' });
      // 空のパスの場合は何もしない
      expect(obj.user.name).toBe('Alice');
    });
  });

  describe('deleteNestedValue', () => {
    it('should delete nested object values', () => {
      const obj = { user: { name: 'Alice', age: 30 } };

      deleteNestedValue(obj, ['user', 'age']);
      expect(obj.user.age).toBeUndefined();
      expect('age' in obj.user).toBe(false);
    });

    it('should delete nested array values', () => {
      const obj = { items: [1, 2, 3] };

      deleteNestedValue(obj, ['items', 1]);
      expect(obj.items[1]).toBeUndefined();
    });

    it('should handle non-existent paths gracefully', () => {
      const obj = { user: { name: 'Alice' } };

      expect(() => {
        deleteNestedValue(obj, ['user', 'nonexistent']);
      }).not.toThrow();

      expect(() => {
        deleteNestedValue(obj, ['nonexistent']);
      }).not.toThrow();
    });

    it('should handle empty path', () => {
      const obj = { user: { name: 'Alice' } };

      deleteNestedValue(obj, []);
      // 空のパスの場合は何もしない
      expect(obj.user.name).toBe('Alice');
    });
  });

  describe('integration', () => {
    it('should work with complex nested structures', () => {
      const obj = {
        users: [
          { id: 1, profile: { name: 'Alice', settings: { theme: 'dark' } } },
          { id: 2, profile: { name: 'Bob', settings: { theme: 'light' } } },
        ],
      };

      // 値の取得
      expect(getNestedValue(obj, ['users', 0, 'profile', 'name'])).toBe('Alice');
      expect(getNestedValue(obj, ['users', 1, 'profile', 'settings', 'theme'])).toBe('light');

      // 値の設定
      setNestedValue(obj, ['users', 0, 'profile', 'name'], 'Alice Updated');
      expect(obj.users[0].profile.name).toBe('Alice Updated');

      // 値の削除
      deleteNestedValue(obj, ['users', 1, 'profile', 'settings', 'theme']);
      expect(obj.users[1].profile.settings.theme).toBeUndefined();
    });

    it('should handle mixed object and array paths', () => {
      const obj = {
        data: {
          items: [
            { id: 1, tags: ['tag1', 'tag2'] },
            { id: 2, tags: ['tag3'] },
          ],
        },
      };

      // 配列内の配列要素へのアクセス
      expect(getNestedValue(obj, ['data', 'items', 0, 'tags', 0])).toBe('tag1');

      // 配列内の配列要素の設定
      setNestedValue(obj, ['data', 'items', 0, 'tags', 1], 'tag2_updated');
      expect(obj.data.items[0].tags[1]).toBe('tag2_updated');

      // 配列内の配列要素の削除
      deleteNestedValue(obj, ['data', 'items', 1, 'tags', 0]);
      expect(obj.data.items[1].tags[0]).toBeUndefined();
    });
  });
});
