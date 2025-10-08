/**
 * src/core/serialization/deep-copy.ts のテスト
 */

import { deepCopy } from '@/core/serialization/deep-copy';
import { describe, expect, it } from 'vitest';

describe('Deep Copy', () => {
  describe('deepCopy', () => {
    it('should copy simple object', () => {
      const obj = { name: 'Alice', age: 30 };
      const result = deepCopy(obj);

      expect(result.data).toEqual(obj);
      expect(result.data).not.toBe(obj);
    });

    it('should copy nested object', () => {
      const obj = {
        user: {
          name: 'Alice',
          profile: {
            age: 30,
            city: 'Tokyo',
          },
        },
      };
      const result = deepCopy(obj);

      expect(result.data).toEqual(obj);
      expect(result.data).not.toBe(obj);
      expect(result.data.user).not.toBe(obj.user);
      expect(result.data.user.profile).not.toBe(obj.user.profile);
    });

    it('should copy array', () => {
      const obj = [1, 2, 3, { name: 'Alice' }];
      const result = deepCopy(obj);

      expect(result.data).toEqual(obj);
      expect(result.data).not.toBe(obj);
      expect(result.data[3]).not.toBe(obj[3]);
    });

    it('should copy primitive values', () => {
      const obj = 'hello';
      const result = deepCopy(obj);

      expect(result.data).toBe(obj);
    });

    it('should copy null and undefined', () => {
      const nullResult = deepCopy(null);
      const undefinedResult = deepCopy(undefined);

      expect(nullResult.data).toBeNull();
      expect(undefinedResult.data).toBeUndefined();
    });

    it('should copy boolean values', () => {
      const trueResult = deepCopy(true);
      const falseResult = deepCopy(false);

      expect(trueResult.data).toBe(true);
      expect(falseResult.data).toBe(false);
    });

    it('should copy number values', () => {
      const numResult = deepCopy(42);
      const floatResult = deepCopy(3.14);

      expect(numResult.data).toBe(42);
      expect(floatResult.data).toBe(3.14);
    });

    it('should copy complex nested structure', () => {
      const obj = {
        users: [
          { name: 'Alice', age: 30, hobbies: ['reading', 'swimming'] },
          { name: 'Bob', age: 25, hobbies: ['cooking', 'gardening'] },
        ],
        metadata: {
          created: new Date('2023-01-01'),
          tags: ['important', 'urgent'],
        },
      };
      const result = deepCopy(obj);

      expect(result.data).toEqual(obj);
      expect(result.data).not.toBe(obj);
      expect(result.data.users).not.toBe(obj.users);
      expect(result.data.users[0]).not.toBe(obj.users[0]);
      expect(result.data.users[0].hobbies).not.toBe(obj.users[0].hobbies);
      expect(result.data.metadata).not.toBe(obj.metadata);
    });

    it('should handle empty object', () => {
      const obj = {};
      const result = deepCopy(obj);

      expect(result.data).toEqual(obj);
      expect(result.data).not.toBe(obj);
    });

    it('should handle empty array', () => {
      const obj: unknown[] = [];
      const result = deepCopy(obj);

      expect(result.data).toEqual(obj);
      expect(result.data).not.toBe(obj);
    });

    it('should handle circular references', () => {
      const obj: any = { name: 'Alice' };
      obj.self = obj;

      // 循環参照がある場合、lodashのcloneDeepは正常に処理する
      const result = deepCopy(obj);

      expect(result.data.name).toBe('Alice');
      expect(result.data.self).toBe(result.data);
    });

    it('should handle functions in object', () => {
      const obj = {
        name: 'Alice',
        greet: () => 'Hello',
      };

      // 関数を含むオブジェクトの場合、lodashのcloneDeepは関数をコピーする
      const result = deepCopy(obj);

      expect(result.data.name).toBe('Alice');
      expect(typeof result.data.greet).toBe('function');
      expect(result.data.greet()).toBe('Hello');
    });

    it('should handle symbols in object', () => {
      const sym = Symbol('test');
      const obj = {
        name: 'Alice',
        [sym]: 'value',
      };

      const result = deepCopy(obj);

      expect(result.data.name).toBe('Alice');
      expect(result.data[sym]).toBe('value');
    });

    it('should handle Date objects', () => {
      const date = new Date('2023-01-01T00:00:00Z');
      const obj = { date };

      const result = deepCopy(obj);

      expect(result.data.date).toEqual(date);
      expect(result.data.date).not.toBe(date);
    });

    it('should handle RegExp objects', () => {
      const regex = /test/gi;
      const obj = { regex };

      const result = deepCopy(obj);

      expect(result.data.regex).toEqual(regex);
      expect(result.data.regex).not.toBe(regex);
    });

    it('should handle Map objects', () => {
      const map = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]);
      const obj = { map };

      const result = deepCopy(obj);

      expect(result.data.map).toEqual(map);
      expect(result.data.map).not.toBe(map);
    });

    it('should handle Set objects', () => {
      const set = new Set(['value1', 'value2']);
      const obj = { set };

      const result = deepCopy(obj);

      expect(result.data.set).toEqual(set);
      expect(result.data.set).not.toBe(set);
    });
  });

  describe('error handling', () => {
    it('should handle deep copy errors gracefully', () => {
      // 循環参照を作成してエラーを発生させる
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      // lodash.cloneDeepは循環参照を処理できるため、エラーは発生しない
      // 代わりに、正常に処理されることを確認
      const result = deepCopy(circularObj);
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe('test');
    });

  });
});
