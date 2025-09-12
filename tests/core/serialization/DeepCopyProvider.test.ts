/**
 * DeepCopyProvider のテスト
 */

import { deepCopy } from '@/core/serialization/DeepCopyProvider';
import { SerializationError } from '@/core/serialization/JsonProvider';
import type { DeepCopyOptions } from '@/core/serialization/types';
import { describe, expect, it } from 'vitest';

describe('DeepCopyProvider', () => {
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
      const original = { a: { b: { c: 1 } } };
      const result = deepCopy(original);
      expect(result.data).toEqual({ a: { b: { c: 1 } } });
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
      expect(result.data).toEqual(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      );
      expect(result.data).not.toBe(original);
    });

    it('should copy dates', () => {
      const original = new Date('2023-01-01');
      const result = deepCopy(original);
      expect(result.data).toEqual(original);
      expect(result.data).not.toBe(original);
      expect(result.data.getTime()).toBe(original.getTime());
    });

    it('should copy regexp', () => {
      const original = /test/gi;
      const result = deepCopy(original);
      expect(result.data.source).toBe(original.source);
      expect(result.data.flags).toBe(original.flags);
      expect(result.data).not.toBe(original);
    });

    it('should copy buffers', () => {
      const original = Buffer.from('hello');
      const result = deepCopy(original);
      expect(result.data).toEqual(original);
      expect(result.data).not.toBe(original);
    });

    it('should handle complex nested structures', () => {
      const original = {
        array: [1, { nested: 'value' }],
        set: new Set([1, 2, 3]),
        map: new Map([['key', { value: 42 }]]),
        date: new Date('2023-01-01'),
      };
      const result = deepCopy(original);
      expect(result.data).toEqual(original);
      expect(result.data).not.toBe(original);
      expect(result.data.array[1]).not.toBe(original.array[1]);
      expect(result.data.map.get('key')).not.toBe(original.map.get('key'));
    });
  });

  describe('circular reference handling', () => {
    it('should handle circular references with ignore option', () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      const options: DeepCopyOptions = {
        circularReferenceHandling: 'ignore',
      };

      const result = deepCopy(obj, options);
      expect(result.data.a).toBe(1);
      expect(result.data.self).toStrictEqual(obj.self);
    });

    it('should handle circular references with replace option', () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      const options: DeepCopyOptions = {
        circularReferenceHandling: 'replace',
      };

      const result = deepCopy(obj, options);
      expect(result.data.a).toBe(1);
      expect(result.data.self).toBe('[Circular Reference]');
    });

    it('should throw error for circular references with error option', () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      const options: DeepCopyOptions = {
        circularReferenceHandling: 'error',
      };

      expect(() => deepCopy(obj, options)).toThrow(SerializationError);
    });
  });

  describe('function handling', () => {
    it('should handle functions with ignore option', () => {
      const func = () => 'test';
      const obj = { func };

      const options: DeepCopyOptions = {
        functionHandling: 'ignore',
      };

      const result = deepCopy(obj, options);
      expect(result.data.func).toBe(func);
    });

    it('should handle functions with replace option', () => {
      const func = () => 'test';
      const obj = { func };

      const options: DeepCopyOptions = {
        functionHandling: 'replace',
      };

      const result = deepCopy(obj, options);
      expect(result.data.func).toBe('[Function]');
    });

    it('should throw error for functions with error option', () => {
      const func = () => 'test';
      const obj = { func };

      const options: DeepCopyOptions = {
        functionHandling: 'error',
      };

      expect(() => deepCopy(obj, options)).toThrow(SerializationError);
    });
  });

  describe('symbol handling', () => {
    it('should handle symbols with ignore option', () => {
      const sym = Symbol('test');
      const obj = { sym };

      const options: DeepCopyOptions = {
        symbolHandling: 'ignore',
      };

      const result = deepCopy(obj, options);
      expect(result.data.sym).toBe(sym);
    });

    it('should handle symbols with replace option', () => {
      const sym = Symbol('test');
      const obj = { sym };

      const options: DeepCopyOptions = {
        symbolHandling: 'replace',
      };

      const result = deepCopy(obj, options);
      expect(result.data.sym).toBe('[Symbol]');
    });

    it('should throw error for symbols with error option', () => {
      const sym = Symbol('test');
      const obj = { sym };

      const options: DeepCopyOptions = {
        symbolHandling: 'error',
      };

      expect(() => deepCopy(obj, options)).toThrow(SerializationError);
    });
  });

  describe('performance', () => {
    it('should measure copy duration', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = deepCopy(obj);
      expect(result.duration).toBeGreaterThan(0);
      expect(typeof result.duration).toBe('number');
    });
  });
});
