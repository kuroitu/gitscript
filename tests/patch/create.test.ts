/**
 * src/patch/create.ts のテスト
 */

import { createPatch } from '@/patch/create';
import { MicrodiffChangeType } from '@/patch/microdiff';
import { describe, expect, it } from 'vitest';

describe('Patch Create', () => {
  describe('createPatch', () => {
    it('should create patch for object changes', () => {
      const oldSource = { user: { name: 'Alice', age: 30 } };
      const newSource = { user: { name: 'Bob', age: 31 } };

      const patch = createPatch(oldSource, newSource);
      expect(patch).toBeDefined();
      expect(patch.diff).toBeDefined();
      expect(Array.isArray(patch.diff)).toBe(true);
    });

    it('should create patch for property additions', () => {
      const oldSource = { user: { name: 'Alice' } };
      const newSource = { user: { name: 'Alice', age: 30 } };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);

      // 新しいプロパティの追加を確認
      const createChanges = patch.diff.filter(
        (change) => change.type === MicrodiffChangeType.Create,
      );
      expect(createChanges.length).toBeGreaterThan(0);
    });

    it('should create patch for property removals', () => {
      const oldSource = { user: { name: 'Alice', age: 30 } };
      const newSource = { user: { name: 'Alice' } };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);

      // プロパティの削除を確認
      const removeChanges = patch.diff.filter(
        (change) => change.type === MicrodiffChangeType.Remove,
      );
      expect(removeChanges.length).toBeGreaterThan(0);
    });

    it('should create patch for property modifications', () => {
      const oldSource = { user: { name: 'Alice', age: 30 } };
      const newSource = { user: { name: 'Bob', age: 30 } };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);

      // プロパティの変更を確認
      const changeChanges = patch.diff.filter(
        (change) => change.type === MicrodiffChangeType.Change,
      );
      expect(changeChanges.length).toBeGreaterThan(0);
    });

    it('should create empty patch for identical objects', () => {
      const source = { user: { name: 'Alice', age: 30 } };
      const patch = createPatch(source, source);
      expect(patch.diff).toEqual([]);
    });

    it('should handle array changes', () => {
      const oldSource = { items: [1, 2, 3] };
      const newSource = { items: [1, 3, 4] };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);
    });

    it('should handle nested object changes', () => {
      const oldSource = {
        user: {
          profile: { name: 'Alice', settings: { theme: 'dark' } },
        },
      };
      const newSource = {
        user: {
          profile: { name: 'Bob', settings: { theme: 'light' } },
        },
      };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);
    });

    it('should handle mixed object and array changes', () => {
      const oldSource = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        count: 2,
      };
      const newSource = {
        users: [
          { id: 1, name: 'Alice Updated' },
          { id: 3, name: 'Charlie' },
        ],
        count: 2,
      };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);
    });

    it('should handle primitive value changes', () => {
      const oldSource = { value: 'hello' };
      const newSource = { value: 'world' };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);
    });

    it('should handle null and undefined values', () => {
      const oldSource = { value: null };
      const newSource = { value: undefined };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);
    });

    it('should handle empty objects', () => {
      const oldSource = {};
      const newSource = { newField: 'value' };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);
    });

    it('should handle complex nested structures', () => {
      const oldSource = {
        data: {
          users: [
            { id: 1, profile: { name: 'Alice', tags: ['admin'] } },
            { id: 2, profile: { name: 'Bob', tags: ['user'] } },
          ],
          metadata: { version: 1, lastUpdated: '2023-01-01' },
        },
      };
      const newSource = {
        data: {
          users: [
            {
              id: 1,
              profile: { name: 'Alice Updated', tags: ['admin', 'moderator'] },
            },
            { id: 3, profile: { name: 'Charlie', tags: ['user'] } },
          ],
          metadata: { version: 2, lastUpdated: '2023-01-02' },
        },
      };

      const patch = createPatch(oldSource, newSource);
      expect(patch.diff.length).toBeGreaterThan(0);
    });
  });
});
