/**
 * JsonProvider のテスト（最小限版）
 */

import {
  deserialize,
  SerializationError,
  stringifyCompact,
} from '@/core/serialization/json-provider';
import { describe, expect, it } from 'vitest';

describe('JsonProvider (Minimal)', () => {
  describe('stringifyCompact', () => {
    it('should stringify compact JSON', () => {
      const obj = { a: 1, b: 2 };
      const result = stringifyCompact(obj);

      expect(result).toBe('{"a":1,"b":2}');
    });

    it('should handle null and undefined', () => {
      expect(stringifyCompact(null)).toBe('null');
      expect(stringifyCompact(undefined)).toBe(undefined);
    });

    it('should handle symbols', () => {
      expect(stringifyCompact(Symbol('test'))).toBe(undefined);
    });

    it('should handle arrays', () => {
      const arr = [1, 2, 3];
      const result = stringifyCompact(arr);
      expect(result).toBe('[1,2,3]');
    });

    it('should handle nested objects', () => {
      const obj = { a: { b: { c: 1 } } };
      const result = stringifyCompact(obj);
      expect(result).toBe('{"a":{"b":{"c":1}}}');
    });
  });

  describe('deserialize', () => {
    it('should deserialize JSON string', () => {
      const json = '{"a":1,"b":2}';
      const result = deserialize(json);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should deserialize arrays', () => {
      const json = '[1,2,3]';
      const result = deserialize(json);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should deserialize nested objects', () => {
      const json = '{"a":{"b":{"c":1}}}';
      const result = deserialize(json);

      expect(result).toEqual({ a: { b: { c: 1 } } });
    });

    it('should throw error for invalid JSON', () => {
      const invalidJson = '{invalid json}';

      expect(() => deserialize(invalidJson)).toThrow(SerializationError);
    });
  });

  describe('error handling', () => {
    it('should throw SerializationError for circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      expect(() => stringifyCompact(obj)).toThrow(SerializationError);
    });

    it('should throw SerializationError for invalid objects', () => {
      const invalidObj = {
        get value() {
          throw new Error('test');
        },
      };

      expect(() => stringifyCompact(invalidObj)).toThrow(SerializationError);
    });
  });

  describe('integration', () => {
    it('should work for complete serialization workflow', () => {
      const original = { name: 'test', value: 42 };

      // シリアライゼーション
      const serialized = stringifyCompact(original);
      expect(serialized).toBe('{"name":"test","value":42}');

      // デシリアライゼーション
      const deserialized = deserialize(serialized);
      expect(deserialized).toEqual(original);
    });

    it('should handle different data types in workflow', () => {
      const testData = {
        string: 'hello',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
      };

      const serialized = stringifyCompact(testData);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(testData);
    });
  });
});
