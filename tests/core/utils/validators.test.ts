import {
  validateArray,
  validateBuffer,
  validateRange,
  validateString,
} from '@/core/utils';
import {
  RANGE_VALIDATION_TEST_CASES,
  TEST_VALUES,
  VALIDATION_TEST_CASES,
  expectArgumentError,
  expectTypeError,
  runValidationTests,
} from '@tests/core/utils/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Validation Functions', () => {
  const validators = {
    validateString,
    validateArray,
    validateBuffer,
  };

  // パラメータ化テスト
  runValidationTests(VALIDATION_TEST_CASES, validators);

  describe('validateString', () => {
    it('should return string for valid string values', () => {
      expect(validateString(TEST_VALUES.string)).toBe(TEST_VALUES.string);
      expect(validateString(TEST_VALUES.emptyString)).toBe(
        TEST_VALUES.emptyString,
      );
      expect(validateString(TEST_VALUES.unicodeString)).toBe(
        TEST_VALUES.unicodeString,
      );
      expect(validateString(TEST_VALUES.longString)).toBe(
        TEST_VALUES.longString,
      );
    });

    it('should throw TypeError for non-string values', () => {
      expectTypeError(
        () => validateString(TEST_VALUES.number),
        'string',
        'value',
      );
      expectTypeError(
        () => validateString(TEST_VALUES.booleanTrue),
        'string',
        'value',
      );
      expectTypeError(
        () => validateString(TEST_VALUES.null),
        'string',
        'value',
      );
      expectTypeError(
        () => validateString(TEST_VALUES.undefined),
        'string',
        'value',
      );
      expectTypeError(
        () => validateString(TEST_VALUES.array),
        'string',
        'value',
      );
      expectTypeError(
        () => validateString(TEST_VALUES.object),
        'string',
        'value',
      );
      expectTypeError(
        () => validateString(TEST_VALUES.buffer),
        'string',
        'value',
      );
    });

    it('should use custom parameter name in error message', () => {
      expectTypeError(
        () => validateString(TEST_VALUES.number, 'customParam'),
        'string',
        'customParam',
      );
      expectTypeError(
        () => validateString(TEST_VALUES.booleanTrue, 'myParam'),
        'string',
        'myParam',
      );
    });

    it('should work with type narrowing', () => {
      const value: unknown = 'hello world';
      const result = validateString(value);
      // TypeScript should know this is a string
      expect(result.toUpperCase()).toBe('HELLO WORLD');
    });
  });

  describe('validateArray', () => {
    it('should return array for valid array values', () => {
      expect(validateArray(TEST_VALUES.array)).toBe(TEST_VALUES.array);
      expect(validateArray(TEST_VALUES.emptyArray)).toBe(
        TEST_VALUES.emptyArray,
      );
      expect(validateArray(TEST_VALUES.nestedArray)).toBe(
        TEST_VALUES.nestedArray,
      );
      expect(validateArray(TEST_VALUES.mixedArray)).toBe(
        TEST_VALUES.mixedArray,
      );
    });

    it('should throw TypeError for non-array values', () => {
      expectTypeError(
        () => validateArray(TEST_VALUES.string),
        'array',
        'value',
      );
      expectTypeError(
        () => validateArray(TEST_VALUES.number),
        'array',
        'value',
      );
      expectTypeError(
        () => validateArray(TEST_VALUES.booleanTrue),
        'array',
        'value',
      );
      expectTypeError(() => validateArray(TEST_VALUES.null), 'array', 'value');
      expectTypeError(
        () => validateArray(TEST_VALUES.undefined),
        'array',
        'value',
      );
      expectTypeError(
        () => validateArray(TEST_VALUES.object),
        'array',
        'value',
      );
      expectTypeError(
        () => validateArray(TEST_VALUES.buffer),
        'array',
        'value',
      );
    });

    it('should use custom parameter name in error message', () => {
      expectTypeError(
        () => validateArray(TEST_VALUES.string, 'customParam'),
        'array',
        'customParam',
      );
      expectTypeError(
        () => validateArray(TEST_VALUES.number, 'myParam'),
        'array',
        'myParam',
      );
    });

    it('should work with type narrowing', () => {
      const value: unknown = [1, 2, 3];
      const result = validateArray<number>(value);
      // TypeScript should know this is a number array
      expect(result.length).toBe(3);
      expect(result[0]).toBe(1);
    });

    it('should handle typed arrays', () => {
      const stringArray = ['a', 'b', 'c'];
      const numberArray = [1, 2, 3];
      const mixedArray = [1, 'two', true];

      expect(validateArray<string>(stringArray)).toBe(stringArray);
      expect(validateArray<number>(numberArray)).toBe(numberArray);
      expect(validateArray<unknown>(mixedArray)).toBe(mixedArray);
    });
  });

  describe('validateBuffer', () => {
    it('should return Buffer for valid Buffer values', () => {
      expect(validateBuffer(TEST_VALUES.buffer)).toBe(TEST_VALUES.buffer);
      expect(validateBuffer(TEST_VALUES.emptyBuffer)).toBe(
        TEST_VALUES.emptyBuffer,
      );
      expect(validateBuffer(TEST_VALUES.largeBuffer)).toBe(
        TEST_VALUES.largeBuffer,
      );
    });

    it('should throw TypeError for non-Buffer values', () => {
      expectTypeError(
        () => validateBuffer(TEST_VALUES.string),
        'Buffer',
        'value',
      );
      expectTypeError(
        () => validateBuffer(TEST_VALUES.number),
        'Buffer',
        'value',
      );
      expectTypeError(
        () => validateBuffer(TEST_VALUES.booleanTrue),
        'Buffer',
        'value',
      );
      expectTypeError(
        () => validateBuffer(TEST_VALUES.null),
        'Buffer',
        'value',
      );
      expectTypeError(
        () => validateBuffer(TEST_VALUES.undefined),
        'Buffer',
        'value',
      );
      expectTypeError(
        () => validateBuffer(TEST_VALUES.array),
        'Buffer',
        'value',
      );
      expectTypeError(
        () => validateBuffer(TEST_VALUES.object),
        'Buffer',
        'value',
      );
    });

    it('should use custom parameter name in error message', () => {
      expectTypeError(
        () => validateBuffer(TEST_VALUES.string, 'customParam'),
        'Buffer',
        'customParam',
      );
      expectTypeError(
        () => validateBuffer(TEST_VALUES.number, 'myParam'),
        'Buffer',
        'myParam',
      );
    });

    it('should work with type narrowing', () => {
      const value: unknown = Buffer.from('test');
      const result = validateBuffer(value);
      // TypeScript should know this is a Buffer
      expect(result.length).toBe(4);
      expect(result.toString()).toBe('test');
    });

    it('should handle different Buffer encodings', () => {
      const utf8Buffer = Buffer.from('hello', 'utf8');
      const asciiBuffer = Buffer.from('hello', 'ascii');
      const base64Buffer = Buffer.from('aGVsbG8=', 'base64');

      expect(validateBuffer(utf8Buffer)).toBe(utf8Buffer);
      expect(validateBuffer(asciiBuffer)).toBe(asciiBuffer);
      expect(validateBuffer(base64Buffer)).toBe(base64Buffer);
    });
  });

  describe('validateRange', () => {
    it('should return value for valid range values', () => {
      expect(validateRange(5, 0, 10)).toBe(5);
      expect(validateRange(0, 0, 10)).toBe(0);
      expect(validateRange(10, 0, 10)).toBe(10);
      expect(validateRange(-5, -10, -1)).toBe(-5);
      expect(validateRange(3.14, 0, 5)).toBe(3.14);
    });

    it('should throw ArgumentError for out-of-range values', () => {
      expectArgumentError(() => validateRange(-1, 0, 10), 'value');
      expectArgumentError(() => validateRange(11, 0, 10), 'value');
      expectArgumentError(() => validateRange(5.1, 0, 5), 'value');
    });

    it('should use custom parameter name in error message', () => {
      expectArgumentError(
        () => validateRange(-1, 0, 10, 'customParam'),
        'customParam',
      );
      expectArgumentError(() => validateRange(11, 0, 10, 'myParam'), 'myParam');
    });

    it('should include range information in error message', () => {
      expect(() => validateRange(-1, 0, 10)).toThrow(
        'must be between 0 and 10',
      );
      expect(() => validateRange(11, 0, 10)).toThrow(
        'must be between 0 and 10',
      );
      expect(() => validateRange(5.1, 0, 5)).toThrow('must be between 0 and 5');
    });

    // パラメータ化テスト
    RANGE_VALIDATION_TEST_CASES.forEach(
      ({ name, value, min, max, shouldThrow }) => {
        it(`should ${shouldThrow ? 'throw error' : 'not throw error'} for ${name}`, () => {
          if (shouldThrow) {
            expect(() => validateRange(value, min, max)).toThrow();
          } else {
            expect(() => validateRange(value, min, max)).not.toThrow();
            expect(validateRange(value, min, max)).toBe(value);
          }
        });
      },
    );

    it('should handle edge cases', () => {
      expect(validateRange(0, 0, 0)).toBe(0);
      expect(() => validateRange(1, 0, 0)).toThrow();
      expect(() => validateRange(-1, 0, 0)).toThrow();
    });

    it('should handle negative ranges', () => {
      expect(validateRange(-5, -10, -1)).toBe(-5);
      expect(validateRange(-10, -10, -1)).toBe(-10);
      expect(validateRange(-1, -10, -1)).toBe(-1);
      expect(() => validateRange(-11, -10, -1)).toThrow();
      expect(() => validateRange(0, -10, -1)).toThrow();
    });

    it('should handle float ranges', () => {
      expect(validateRange(3.14, 0, 5)).toBe(3.14);
      expect(validateRange(0.0, 0, 5)).toBe(0.0);
      expect(validateRange(5.0, 0, 5)).toBe(5.0);
      expect(() => validateRange(5.1, 0, 5)).toThrow();
      expect(() => validateRange(-0.1, 0, 5)).toThrow();
    });
  });

  describe('Edge cases and special values', () => {
    it('should handle edge cases for validateString', () => {
      expect(validateString('')).toBe('');
      expect(validateString(' ')).toBe(' ');
      expect(validateString('\n')).toBe('\n');
      expect(validateString('\t')).toBe('\t');
      expect(validateString('\0')).toBe('\0');
    });

    it('should handle edge cases for validateArray', () => {
      expect(validateArray([])).toEqual([]);
      expect(validateArray([1])).toEqual([1]);
      expect(validateArray(Array.from([]))).toEqual([]);
      expect(validateArray(Array.from('hello'))).toEqual([
        'h',
        'e',
        'l',
        'l',
        'o',
      ]);
    });

    it('should handle edge cases for validateBuffer', () => {
      expect(validateBuffer(Buffer.alloc(0))).toEqual(Buffer.alloc(0));
      expect(validateBuffer(Buffer.alloc(1))).toEqual(Buffer.alloc(1));
      expect(validateBuffer(Buffer.from([]))).toEqual(Buffer.from([]));
      expect(validateBuffer(Buffer.from(''))).toEqual(Buffer.from(''));
    });

    it('should handle edge cases for validateRange', () => {
      expect(validateRange(0, 0, 0)).toBe(0);
      expect(validateRange(1, 1, 1)).toBe(1);
      expect(validateRange(-1, -1, -1)).toBe(-1);
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const largeBuffer = Buffer.alloc(10000, 0x42);

      const startTime = performance.now();

      // Test multiple validations
      for (let i = 0; i < 1000; i++) {
        validateString(TEST_VALUES.string);
        validateArray(largeArray);
        validateBuffer(largeBuffer);
        validateRange(5, 0, 10);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(200); // 200ms以内
    });
  });
});
