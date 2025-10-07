/**
 * src/core/serialization/json-provider.ts のテスト
 */

import { SerializationError } from '@/core/serialization/errors';
import {
  deserialize,
  stringifyCompact,
} from '@/core/serialization/json-provider';
import { describe, expect, it } from 'vitest';

describe('JSON Provider', () => {
  describe('stringifyCompact', () => {
    it('should stringify simple objects', () => {
      const obj = { name: 'Alice', age: 30 };
      const result = stringifyCompact(obj);
      expect(result).toBe('{"name":"Alice","age":30}');
    });

    it('should stringify arrays', () => {
      const arr = [1, 2, 3];
      const result = stringifyCompact(arr);
      expect(result).toBe('[1,2,3]');
    });

    it('should stringify nested objects', () => {
      const obj = { user: { name: 'Alice', profile: { age: 30 } } };
      const result = stringifyCompact(obj);
      expect(result).toBe('{"user":{"name":"Alice","profile":{"age":30}}}');
    });

    it('should stringify null and undefined', () => {
      expect(stringifyCompact(null)).toBe('null');
      expect(stringifyCompact(undefined)).toBe(undefined);
    });

    it('should stringify primitive values', () => {
      expect(stringifyCompact('string')).toBe('"string"');
      expect(stringifyCompact(123)).toBe('123');
      expect(stringifyCompact(true)).toBe('true');
      expect(stringifyCompact(false)).toBe('false');
    });

    it('should handle empty objects and arrays', () => {
      expect(stringifyCompact({})).toBe('{}');
      expect(stringifyCompact([])).toBe('[]');
    });

    it('should handle special characters', () => {
      const obj = { message: 'Hello "World"', path: 'C:\\Users\\Test' };
      const result = stringifyCompact(obj);
      expect(result).toContain('Hello \\"World\\"');
      expect(result).toContain('C:\\\\Users\\\\Test');
    });

    it('should handle unicode characters', () => {
      const obj = { message: 'こんにちは世界🌍' };
      const result = stringifyCompact(obj);
      expect(result).toContain('こんにちは世界🌍');
    });
  });

  describe('deserialize', () => {
    it('should deserialize simple objects', () => {
      const json = '{"name":"Alice","age":30}';
      const result = deserialize(json);
      expect(result).toEqual({ name: 'Alice', age: 30 });
    });

    it('should deserialize arrays', () => {
      const json = '[1,2,3]';
      const result = deserialize(json);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should deserialize nested objects', () => {
      const json = '{"user":{"name":"Alice","profile":{"age":30}}}';
      const result = deserialize(json);
      expect(result).toEqual({ user: { name: 'Alice', profile: { age: 30 } } });
    });

    it('should deserialize null and undefined', () => {
      expect(deserialize('null')).toBe(null);
      // undefinedは有効なJSONではないため、エラーが発生する
      expect(() => deserialize('undefined')).toThrow();
    });

    it('should deserialize primitive values', () => {
      expect(deserialize('"string"')).toBe('string');
      expect(deserialize('123')).toBe(123);
      expect(deserialize('true')).toBe(true);
      expect(deserialize('false')).toBe(false);
    });

    it('should handle empty objects and arrays', () => {
      expect(deserialize('{}')).toEqual({});
      expect(deserialize('[]')).toEqual([]);
    });

    it('should handle special characters', () => {
      const json =
        '{"message":"Hello \\"World\\"","path":"C:\\\\Users\\\\Test"}';
      const result = deserialize(json);
      expect(result).toEqual({
        message: 'Hello "World"',
        path: 'C:\\Users\\Test',
      });
    });

    it('should handle unicode characters', () => {
      const json = '{"message":"こんにちは世界🌍"}';
      const result = deserialize(json);
      expect(result).toEqual({ message: 'こんにちは世界🌍' });
    });
  });

  describe('error handling', () => {
    it('should throw SerializationError for invalid JSON in stringifyCompact', () => {
      // 循環参照を作成してJSON.stringifyを失敗させる
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      expect(() => stringifyCompact(circularObj)).toThrow(SerializationError);
    });

    it('should throw SerializationError for invalid JSON in deserialize', () => {
      const invalidJson = '{"name":"Alice",}'; // 不正なJSON

      expect(() => deserialize(invalidJson)).toThrow(SerializationError);
    });

    it('should include original error in SerializationError for stringifyCompact', () => {
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      try {
        stringifyCompact(circularObj);
      } catch (error) {
        expect(error).toBeInstanceOf(SerializationError);
        expect((error as SerializationError).message).toContain(
          'Failed to stringify object',
        );
        expect((error as SerializationError).cause).toBeDefined();
      }
    });

    it('should include original error in SerializationError for deserialize', () => {
      const invalidJson = '{"name":"Alice",}';

      try {
        deserialize(invalidJson);
      } catch (error) {
        expect(error).toBeInstanceOf(SerializationError);
        expect((error as SerializationError).message).toContain(
          'Failed to deserialize',
        );
        expect((error as SerializationError).cause).toBeDefined();
      }
    });

    it('should handle non-Error exceptions in stringifyCompact', () => {
      // モックして文字列をthrowさせる
      const originalStringify = JSON.stringify;
      JSON.stringify = () => {
        throw 'String error';
      };

      try {
        stringifyCompact({ test: 'value' });
      } catch (error) {
        expect(error).toBeInstanceOf(SerializationError);
        expect((error as SerializationError).message).toContain(
          'Failed to stringify object',
        );
        expect((error as SerializationError).cause).toBeUndefined();
      } finally {
        JSON.stringify = originalStringify;
      }
    });

    it('should handle non-Error exceptions in deserialize', () => {
      // モックして文字列をthrowさせる
      const originalParse = JSON.parse;
      JSON.parse = () => {
        throw 'String error';
      };

      try {
        deserialize('{"test":"value"}');
      } catch (error) {
        expect(error).toBeInstanceOf(SerializationError);
        expect((error as SerializationError).message).toContain(
          'Failed to deserialize',
        );
        expect((error as SerializationError).cause).toBeUndefined();
      } finally {
        JSON.parse = originalParse;
      }
    });
  });
});
