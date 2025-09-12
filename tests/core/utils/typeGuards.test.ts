import {
  isArray,
  isBigInt,
  isBoolean,
  isBuffer,
  isDate,
  isFunction,
  isMap,
  isNativeError,
  isNull,
  isNullOrUndefined,
  isNumber,
  isObject,
  isPrimitive,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUndefined,
} from '@/core/utils';
import {
  TEST_VALUES,
  TYPE_GUARD_TEST_CASES,
  runTypeGuardTests,
} from '@tests/core/utils/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Type Guard Functions', () => {
  const typeGuards = {
    isString,
    isNumber,
    isBoolean,
    isBigInt,
    isSymbol,
    isFunction,
    isNull,
    isUndefined,
    isNullOrUndefined,
    isPrimitive,
    isObject,
    isNativeError,
    isDate,
    isMap,
    isSet,
    isRegExp,
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

  describe('isNumber', () => {
    it('should return true for number values', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
      expect(isNumber(NaN)).toBe(true);
    });

    it('should return false for non-number values', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for boolean values', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-boolean values', () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean('false')).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
    });
  });

  describe('isBigInt', () => {
    it('should return true for BigInt values', () => {
      expect(isBigInt(BigInt(0))).toBe(true);
      expect(isBigInt(BigInt(1))).toBe(true);
      expect(isBigInt(BigInt('12345678901234567890'))).toBe(true);
    });

    it('should return false for non-BigInt values', () => {
      expect(isBigInt(0)).toBe(false);
      expect(isBigInt(1)).toBe(false);
      expect(isBigInt('123')).toBe(false);
      expect(isBigInt(null)).toBe(false);
      expect(isBigInt(undefined)).toBe(false);
    });
  });

  describe('isSymbol', () => {
    it('should return true for Symbol values', () => {
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol(Symbol('test'))).toBe(true);
      expect(isSymbol(Symbol.for('test'))).toBe(true);
    });

    it('should return false for non-Symbol values', () => {
      expect(isSymbol('symbol')).toBe(false);
      expect(isSymbol(123)).toBe(false);
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for function values', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
      expect(isFunction(function*() {})).toBe(true);
    });

    it('should return false for non-function values', () => {
      expect(isFunction('function')).toBe(false);
      expect(isFunction(123)).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(false)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for non-undefined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined(false)).toBe(false);
    });
  });

  describe('isPrimitive', () => {
    it('should return true for primitive values', () => {
      expect(isPrimitive('string')).toBe(true);
      expect(isPrimitive(123)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(null)).toBe(true);
      expect(isPrimitive(undefined)).toBe(true);
      expect(isPrimitive(BigInt(123))).toBe(true);
      expect(isPrimitive(Symbol('test'))).toBe(true);
    });

    it('should return false for non-primitive values', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive(() => {})).toBe(false);
      expect(isPrimitive(new Date())).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for object values', () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(true);
      expect(isObject(new Date())).toBe(true);
      expect(isObject(/regex/)).toBe(true);
    });

    it('should return false for non-object values', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

  describe('isNativeError', () => {
    it('should return true for Error instances', () => {
      expect(isNativeError(new Error())).toBe(true);
      expect(isNativeError(new TypeError())).toBe(true);
      expect(isNativeError(new ReferenceError())).toBe(true);
    });

    it('should return false for non-Error values', () => {
      expect(isNativeError('error')).toBe(false);
      expect(isNativeError({})).toBe(false);
      expect(isNativeError(null)).toBe(false);
      expect(isNativeError(undefined)).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for Date instances', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2023-01-01'))).toBe(true);
    });

    it('should return false for non-Date values', () => {
      expect(isDate('2023-01-01')).toBe(false);
      expect(isDate(1672531200000)).toBe(false);
      expect(isDate({})).toBe(false);
      expect(isDate(null)).toBe(false);
    });
  });

  describe('isMap', () => {
    it('should return true for Map instances', () => {
      expect(isMap(new Map())).toBe(true);
      expect(isMap(new Map([['key', 'value']]))).toBe(true);
    });

    it('should return false for non-Map values', () => {
      expect(isMap({})).toBe(false);
      expect(isMap(new Set())).toBe(false);
      expect(isMap('map')).toBe(false);
      expect(isMap(null)).toBe(false);
    });
  });

  describe('isSet', () => {
    it('should return true for Set instances', () => {
      expect(isSet(new Set())).toBe(true);
      expect(isSet(new Set([1, 2, 3]))).toBe(true);
    });

    it('should return false for non-Set values', () => {
      expect(isSet([])).toBe(false);
      expect(isSet(new Map())).toBe(false);
      expect(isSet('set')).toBe(false);
      expect(isSet(null)).toBe(false);
    });
  });

  describe('isRegExp', () => {
    it('should return true for RegExp instances', () => {
      expect(isRegExp(/regex/)).toBe(true);
      expect(isRegExp(new RegExp('test'))).toBe(true);
    });

    it('should return false for non-RegExp values', () => {
      expect(isRegExp('regex')).toBe(false);
      expect(isRegExp({})).toBe(false);
      expect(isRegExp(null)).toBe(false);
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
        isNumber(123);
        isBoolean(true);
        isBigInt(BigInt(123));
        isSymbol(Symbol('test'));
        isFunction(() => {});
        isNull(null);
        isUndefined(undefined);
        isNullOrUndefined(TEST_VALUES.null);
        isPrimitive('test');
        isObject({});
        isNativeError(new Error());
        isDate(new Date());
        isMap(new Map());
        isSet(new Set());
        isRegExp(/test/);
        isArray(largeArray);
        isBuffer(largeBuffer);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(200); // 200ms以内（テスト数が増えたため）
    });
  });
});
