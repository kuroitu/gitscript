/**
 * DeepCopyProvider のテスト（純粋なオブジェクト版）
 */

import { deepCopy } from '@/core/serialization/DeepCopyProvider';
import { SerializationError } from '@/core/serialization/errors';
import { describe, expect, it } from 'vitest';

describe('DeepCopyProvider (Pure Objects)', () => {
  describe('deepCopy', () => {
    it('should copy primitive values', () => {
      expect(deepCopy('hello').data).toBe('hello');
      expect(deepCopy(42).data).toBe(42);
      expect(deepCopy(true).data).toBe(true);
      expect(deepCopy(null).data).toBe(null);
      expect(deepCopy(undefined).data).toBe(undefined);
    });

    it('should copy bigint values', () => {
      const value = BigInt(123);
      const result = deepCopy(value);
      expect(result.data).toBe(value);
    });

    it('should copy arrays', () => {
      const original = [1, 2, 3];
      const result = deepCopy(original);
      expect(result.data).toEqual([1, 2, 3]);
      expect(result.data).not.toBe(original);
    });

    it('should copy nested arrays', () => {
      const original = [
        [1, 2],
        [3, 4],
      ];
      const result = deepCopy(original);
      expect(result.data).toEqual([
        [1, 2],
        [3, 4],
      ]);
      expect(result.data).not.toBe(original);
      expect(result.data[0]).not.toBe(original[0]);
    });

    it('should copy objects', () => {
      const original = { a: 1, b: 2 };
      const result = deepCopy(original);
      expect(result.data).toEqual({ a: 1, b: 2 });
      expect(result.data).not.toBe(original);
    });

    it('should copy nested objects', () => {
      const original = {
        a: { b: { c: 1 } },
        d: [1, 2, 3],
      };
      const result = deepCopy(original);
      expect(result.data).toEqual({
        a: { b: { c: 1 } },
        d: [1, 2, 3],
      });
      expect(result.data).not.toBe(original);
      expect(result.data.a).not.toBe(original.a);
      expect(result.data.a.b).not.toBe(original.a.b);
    });

    it('should copy sets', () => {
      const original = new Set([1, 2, 3]);
      const result = deepCopy(original);
      expect(result.data).toEqual(new Set([1, 2, 3]));
      expect(result.data).not.toBe(original);
    });

    it('should copy maps', () => {
      const original = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const result = deepCopy(original);
      expect(result.data).toEqual(new Map([
        ['a', 1],
        ['b', 2],
      ]));
      expect(result.data).not.toBe(original);
    });

    it('should copy dates', () => {
      const original = new Date('2023-01-01');
      const result = deepCopy(original);
      expect(result.data).toEqual(new Date('2023-01-01'));
      expect(result.data).not.toBe(original);
    });

    it('should copy regexp', () => {
      const original = /test/gi;
      const result = deepCopy(original);
      expect(result.data).toEqual(/test/gi);
      expect(result.data).not.toBe(original);
    });

    it('should copy buffers', () => {
      const original = Buffer.from('hello');
      const result = deepCopy(original);
      expect(result.data).toEqual(Buffer.from('hello'));
      expect(result.data).not.toBe(original);
    });

    it('should handle complex nested structures', () => {
      const original = {
        array: [1, { nested: true }, [2, 3]],
        set: new Set(['a', 'b']),
        map: new Map([['key', { value: 42 }]]),
        date: new Date('2023-01-01'),
        regexp: /test/,
        buffer: Buffer.from('data'),
      };
      const result = deepCopy(original);
      expect(result.data).toEqual(original);
      expect(result.data).not.toBe(original);
    });
  });

  describe('special types handling', () => {
    it('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      const result = deepCopy(obj);
      expect(result.data.a).toBe(1);
      expect(result.data.self).toBe(result.data); // 循環参照が保持される
    });

    it('should handle functions', () => {
      const obj = { func: () => 'test' };

      const result = deepCopy(obj);
      expect(typeof result.data.func).toBe('function');
      expect(result.data.func()).toBe('test');
    });

    it('should handle symbols', () => {
      const sym = Symbol('test');
      const obj = { sym };

      const result = deepCopy(obj);
      expect(result.data.sym).toBe(sym);
    });
  });

  describe('integration', () => {
    it('should work with serialization workflow', () => {
      const original = {
        data: { value: 42 },
        array: [1, 2, { nested: true }],
      };

      // 深いコピー
      const copied = deepCopy(original);
      expect(copied.data).toEqual(original);
      expect(copied.data).not.toBe(original);

      // コピーしたオブジェクトを変更しても元のオブジェクトに影響しない
      (copied.data as any).data.value = 100;
      expect(original.data.value).toBe(42);
    });
  });
});