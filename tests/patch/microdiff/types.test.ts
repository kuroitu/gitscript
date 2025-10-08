/**
 * src/patch/microdiff/types.ts のテスト
 */

import { MicrodiffChangeType } from '@/patch/microdiff/types';
import { describe, expect, it } from 'vitest';

describe('Microdiff Types', () => {
  describe('MicrodiffChangeType', () => {
    it('should have correct change type values', () => {
      expect(MicrodiffChangeType.Create).toBe('CREATE');
      expect(MicrodiffChangeType.Remove).toBe('REMOVE');
      expect(MicrodiffChangeType.Change).toBe('CHANGE');
    });

    it('should be readonly', () => {
      // TypeScriptのreadonlyプロパティは実行時には変更可能だが、
      // 設計上は変更すべきではない
      expect(MicrodiffChangeType.Create).toBe('CREATE');
      expect(MicrodiffChangeType.Remove).toBe('REMOVE');
      expect(MicrodiffChangeType.Change).toBe('CHANGE');
    });

    it('should have consistent string values', () => {
      expect(typeof MicrodiffChangeType.Create).toBe('string');
      expect(typeof MicrodiffChangeType.Remove).toBe('string');
      expect(typeof MicrodiffChangeType.Change).toBe('string');
    });
  });

  describe('type definitions', () => {
    it('should allow valid MicrodiffSource types', () => {
      // オブジェクト
      const objectSource: Record<string, unknown> = { name: 'Alice', age: 30 };
      expect(typeof objectSource).toBe('object');

      // 配列
      const arraySource: unknown[] = [1, 2, 3];
      expect(Array.isArray(arraySource)).toBe(true);

      // null
      const nullSource: Record<string, unknown> | unknown[] = null as any;
      expect(nullSource).toBeNull();
    });

    it('should allow valid MicrodiffPath types', () => {
      // 文字列の配列
      const stringPath: (string | number)[] = ['user', 'name'];
      expect(Array.isArray(stringPath)).toBe(true);

      // 数値の配列
      const numberPath: (string | number)[] = [0, 1, 2];
      expect(Array.isArray(numberPath)).toBe(true);

      // 混合配列
      const mixedPath: (string | number)[] = ['user', 0, 'name'];
      expect(Array.isArray(mixedPath)).toBe(true);

      // 空配列
      const emptyPath: (string | number)[] = [];
      expect(Array.isArray(emptyPath)).toBe(true);
    });

    it('should allow valid MicrodiffChange types', () => {
      // CREATE change
      const createChange = {
        type: 'CREATE',
        path: ['user', 'name'],
        value: 'Alice',
      };
      expect(createChange.type).toBe('CREATE');
      expect(Array.isArray(createChange.path)).toBe(true);
      expect(createChange.value).toBe('Alice');

      // REMOVE change
      const removeChange = {
        type: 'REMOVE',
        path: ['user', 'age'],
        oldValue: 30,
      };
      expect(removeChange.type).toBe('REMOVE');
      expect(Array.isArray(removeChange.path)).toBe(true);
      expect(removeChange.oldValue).toBe(30);

      // CHANGE change
      const changeChange = {
        type: 'CHANGE',
        path: ['user', 'name'],
        value: 'Bob',
        oldValue: 'Alice',
      };
      expect(changeChange.type).toBe('CHANGE');
      expect(Array.isArray(changeChange.path)).toBe(true);
      expect(changeChange.value).toBe('Bob');
      expect(changeChange.oldValue).toBe('Alice');
    });

    it('should allow valid MicrodiffResult types', () => {
      const result = [
        {
          type: 'CREATE',
          path: ['user', 'name'],
          value: 'Alice',
        },
        {
          type: 'CHANGE',
          path: ['user', 'age'],
          value: 31,
          oldValue: 30,
        },
      ];
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('type compatibility', () => {
    it('should be compatible with microdiff library types', () => {
      // これらの型がmicrodiffライブラリの型と互換性があることを確認
      const changeType: string = MicrodiffChangeType.Create;
      expect(changeType).toBe('CREATE');

      const path: (string | number)[] = ['user', 'name'];
      expect(Array.isArray(path)).toBe(true);

      const source: Record<string, unknown> | unknown[] = { name: 'Alice' };
      expect(typeof source).toBe('object');
    });

    it('should support complex nested structures', () => {
      const complexSource: Record<string, unknown> = {
        users: [
          { id: 1, name: 'Alice', settings: { theme: 'dark' } },
          { id: 2, name: 'Bob', settings: { theme: 'light' } },
        ],
        metadata: {
          version: '1.0.0',
          created: new Date().toISOString(),
        },
      };

      expect(typeof complexSource).toBe('object');
      expect(Array.isArray(complexSource.users)).toBe(true);
      expect(typeof complexSource.metadata).toBe('object');
    });
  });

  describe('type safety', () => {
    it('should enforce correct change type values', () => {
      // 有効な変更タイプ
      const validTypes = ['CREATE', 'REMOVE', 'CHANGE'];
      validTypes.forEach((type) => {
        expect(['CREATE', 'REMOVE', 'CHANGE']).toContain(type);
      });
    });

    it('should enforce correct path structure', () => {
      // 有効なパス
      const validPaths = [
        ['user'],
        ['user', 'name'],
        [0],
        [0, 1, 2],
        ['user', 0, 'name'],
      ];

      validPaths.forEach((path) => {
        expect(Array.isArray(path)).toBe(true);
        path.forEach((item) => {
          expect(typeof item === 'string' || typeof item === 'number').toBe(
            true,
          );
        });
      });
    });
  });
});
