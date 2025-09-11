import {
  isArray,
  isBuffer,
  isNullOrUndefined,
  isString,
} from '@/core/utils/typeGuards';
import {
  TEST_VALUES,
  TYPE_GUARD_TEST_CASES,
  runTypeGuardTests,
} from '@tests/core/utils/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Type Guard Functions', () => {
  const typeGuards = {
    isString,
    isNullOrUndefined,
    isArray,
    isBuffer,
  };

  // パラメータ化テスト
  runTypeGuardTests(TYPE_GUARD_TEST_CASES, typeGuards);

  describe('isString', () => {
    it('should return true for string values', () => {
      expect(isString(TEST_VALUES.string)).toBe(true);
      expect(isString(TEST_VALUES.emptyString)).toBe(true);
      expect(isString(TEST_VALUES.unicodeString)).toBe(true);
      expect(isString(TEST_VALUES.longString)).toBe(true);
    });

    it('should return false for non-string values', () => {
      expect(isString(TEST_VALUES.number)).toBe(false);
      expect(isString(TEST_VALUES.booleanTrue)).toBe(false);
      expect(isString(TEST_VALUES.null)).toBe(false);
      expect(isString(TEST_VALUES.undefined)).toBe(false);
      expect(isString(TEST_VALUES.array)).toBe(false);
      expect(isString(TEST_VALUES.object)).toBe(false);
      expect(isString(TEST_VALUES.buffer)).toBe(false);
      expect(isString(TEST_VALUES.function)).toBe(false);
      expect(isString(TEST_VALUES.date)).toBe(false);
      expect(isString(TEST_VALUES.regex)).toBe(false);
      expect(isString(TEST_VALUES.symbol)).toBe(false);
      expect(isString(TEST_VALUES.bigInt)).toBe(false);
    });

    it('should work with type narrowing', () => {
      const value: unknown = 'hello world';
      if (isString(value)) {
        // TypeScript should know this is a string
        expect(value.toUpperCase()).toBe('HELLO WORLD');
      }
    });
  });

  describe('isNullOrUndefined', () => {
    it('should return true for null and undefined', () => {
      expect(isNullOrUndefined(TEST_VALUES.null)).toBe(true);
      expect(isNullOrUndefined(TEST_VALUES.undefined)).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isNullOrUndefined(TEST_VALUES.string)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.number)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.booleanTrue)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.array)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.object)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.buffer)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.function)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.date)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.regex)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.symbol)).toBe(false);
      expect(isNullOrUndefined(TEST_VALUES.bigInt)).toBe(false);
    });

    it('should work with type narrowing', () => {
      const value: unknown = null;
      if (isNullOrUndefined(value)) {
        // TypeScript should know this is null | undefined
        expect(value === null || value === undefined).toBe(true);
      }
    });
  });

  describe('isArray', () => {
    it('should return true for array values', () => {
      expect(isArray(TEST_VALUES.array)).toBe(true);
      expect(isArray(TEST_VALUES.emptyArray)).toBe(true);
      expect(isArray(TEST_VALUES.nestedArray)).toBe(true);
      expect(isArray(TEST_VALUES.mixedArray)).toBe(true);
    });

    it('should return false for non-array values', () => {
      expect(isArray(TEST_VALUES.string)).toBe(false);
      expect(isArray(TEST_VALUES.number)).toBe(false);
      expect(isArray(TEST_VALUES.booleanTrue)).toBe(false);
      expect(isArray(TEST_VALUES.null)).toBe(false);
      expect(isArray(TEST_VALUES.undefined)).toBe(false);
      expect(isArray(TEST_VALUES.object)).toBe(false);
      expect(isArray(TEST_VALUES.buffer)).toBe(false);
      expect(isArray(TEST_VALUES.function)).toBe(false);
      expect(isArray(TEST_VALUES.date)).toBe(false);
      expect(isArray(TEST_VALUES.regex)).toBe(false);
      expect(isArray(TEST_VALUES.symbol)).toBe(false);
      expect(isArray(TEST_VALUES.bigInt)).toBe(false);
    });

    it('should work with type narrowing', () => {
      const value: unknown = [1, 2, 3];
      if (isArray(value)) {
        // TypeScript should know this is an array
        expect(value.length).toBe(3);
        expect(value[0]).toBe(1);
      }
    });

    it('should handle array-like objects', () => {
      const arrayLike = { 0: 'a', 1: 'b', length: 2 };
      expect(isArray(arrayLike)).toBe(false);
    });
  });

  describe('isBuffer', () => {
    it('should return true for Buffer values', () => {
      expect(isBuffer(TEST_VALUES.buffer)).toBe(true);
      expect(isBuffer(TEST_VALUES.emptyBuffer)).toBe(true);
      expect(isBuffer(TEST_VALUES.largeBuffer)).toBe(true);
    });

    it('should return false for non-Buffer values', () => {
      expect(isBuffer(TEST_VALUES.string)).toBe(false);
      expect(isBuffer(TEST_VALUES.number)).toBe(false);
      expect(isBuffer(TEST_VALUES.booleanTrue)).toBe(false);
      expect(isBuffer(TEST_VALUES.null)).toBe(false);
      expect(isBuffer(TEST_VALUES.undefined)).toBe(false);
      expect(isBuffer(TEST_VALUES.array)).toBe(false);
      expect(isBuffer(TEST_VALUES.object)).toBe(false);
      expect(isBuffer(TEST_VALUES.function)).toBe(false);
      expect(isBuffer(TEST_VALUES.date)).toBe(false);
      expect(isBuffer(TEST_VALUES.regex)).toBe(false);
      expect(isBuffer(TEST_VALUES.symbol)).toBe(false);
      expect(isBuffer(TEST_VALUES.bigInt)).toBe(false);
    });

    it('should work with type narrowing', () => {
      const value: unknown = Buffer.from('test');
      if (isBuffer(value)) {
        // TypeScript should know this is a Buffer
        expect(value.length).toBe(4);
        expect(value.toString()).toBe('test');
      }
    });

    it('should handle different Buffer encodings', () => {
      const utf8Buffer = Buffer.from('hello', 'utf8');
      const asciiBuffer = Buffer.from('hello', 'ascii');
      const base64Buffer = Buffer.from('aGVsbG8=', 'base64');

      expect(isBuffer(utf8Buffer)).toBe(true);
      expect(isBuffer(asciiBuffer)).toBe(true);
      expect(isBuffer(base64Buffer)).toBe(true);
    });
  });

  describe('Edge cases and special values', () => {
    it('should handle edge cases for isString', () => {
      expect(isString('')).toBe(true);
      expect(isString(' ')).toBe(true);
      expect(isString('\n')).toBe(true);
      expect(isString('\t')).toBe(true);
      expect(isString('\0')).toBe(true);
    });

    it('should handle edge cases for isNullOrUndefined', () => {
      expect(isNullOrUndefined(null)).toBe(true);
      expect(isNullOrUndefined(undefined)).toBe(true);
      expect(isNullOrUndefined(0)).toBe(false);
      expect(isNullOrUndefined(false)).toBe(false);
      expect(isNullOrUndefined('')).toBe(false);
    });

    it('should handle edge cases for isArray', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1])).toBe(true);
      expect(isArray(Array.from([]))).toBe(true);
      expect(isArray(Array.from('hello'))).toBe(true);
    });

    it('should handle edge cases for isBuffer', () => {
      expect(isBuffer(Buffer.alloc(0))).toBe(true);
      expect(isBuffer(Buffer.alloc(1))).toBe(true);
      expect(isBuffer(Buffer.from([]))).toBe(true);
      expect(isBuffer(Buffer.from(''))).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const largeBuffer = Buffer.alloc(10000, 0x42);

      const startTime = performance.now();

      // Test multiple type guards
      for (let i = 0; i < 1000; i++) {
        isString(TEST_VALUES.string);
        isNullOrUndefined(TEST_VALUES.null);
        isArray(largeArray);
        isBuffer(largeBuffer);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(100); // 100ms以内
    });
  });
});
