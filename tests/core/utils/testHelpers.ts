/**
 * Utilsモジュールのテストヘルパー
 *
 * テストデータとヘルパー関数を提供
 */

import { ArgumentError, TypeError } from '@/types/Errors';
import { expect, it } from 'vitest';

// テスト用のデータ
export const TEST_VALUES = {
  // 文字列
  string: 'hello world',
  emptyString: '',
  unicodeString: 'こんにちは世界🌍',
  longString: 'a'.repeat(1000),

  // 数値
  number: 42,
  zero: 0,
  negative: -100,
  float: 3.14159,
  largeNumber: 999999999999999,

  // 真偽値
  booleanTrue: true,
  booleanFalse: false,

  // null/undefined
  null: null,
  undefined: undefined,

  // 配列
  array: [1, 2, 3, 'test'],
  emptyArray: [],
  nestedArray: [
    [1, 2],
    [3, 4],
  ],
  mixedArray: [1, 'two', true, null],

  // オブジェクト
  object: { name: 'test', value: 123 },
  emptyObject: {},
  nestedObject: { level1: { level2: { value: 'deep' } } },

  // Buffer
  buffer: Buffer.from('hello world', 'utf8'),
  emptyBuffer: Buffer.alloc(0),
  largeBuffer: Buffer.alloc(1000, 0x42),

  // 関数
  function: () => 'hello',
  arrowFunction: (x: number) => x * 2,

  // その他
  date: new Date('2023-01-01T00:00:00Z'),
  regex: /test/gi,
  symbol: Symbol('test'),
  bigInt: BigInt(123456789),
} as const;

// 型ガードテスト用のデータセット
export const TYPE_GUARD_TEST_CASES = [
  // isString
  {
    name: 'string value',
    value: TEST_VALUES.string,
    typeGuard: 'isString',
    expected: true,
  },
  {
    name: 'empty string',
    value: TEST_VALUES.emptyString,
    typeGuard: 'isString',
    expected: true,
  },
  {
    name: 'unicode string',
    value: TEST_VALUES.unicodeString,
    typeGuard: 'isString',
    expected: true,
  },
  {
    name: 'number value',
    value: TEST_VALUES.number,
    typeGuard: 'isString',
    expected: false,
  },
  {
    name: 'boolean value',
    value: TEST_VALUES.booleanTrue,
    typeGuard: 'isString',
    expected: false,
  },
  {
    name: 'null value',
    value: TEST_VALUES.null,
    typeGuard: 'isString',
    expected: false,
  },
  {
    name: 'undefined value',
    value: TEST_VALUES.undefined,
    typeGuard: 'isString',
    expected: false,
  },
  {
    name: 'array value',
    value: TEST_VALUES.array,
    typeGuard: 'isString',
    expected: false,
  },
  {
    name: 'object value',
    value: TEST_VALUES.object,
    typeGuard: 'isString',
    expected: false,
  },
  {
    name: 'buffer value',
    value: TEST_VALUES.buffer,
    typeGuard: 'isString',
    expected: false,
  },

  // isNullOrUndefined
  {
    name: 'null value',
    value: TEST_VALUES.null,
    typeGuard: 'isNullOrUndefined',
    expected: true,
  },
  {
    name: 'undefined value',
    value: TEST_VALUES.undefined,
    typeGuard: 'isNullOrUndefined',
    expected: true,
  },
  {
    name: 'string value',
    value: TEST_VALUES.string,
    typeGuard: 'isNullOrUndefined',
    expected: false,
  },
  {
    name: 'number value',
    value: TEST_VALUES.number,
    typeGuard: 'isNullOrUndefined',
    expected: false,
  },
  {
    name: 'boolean value',
    value: TEST_VALUES.booleanTrue,
    typeGuard: 'isNullOrUndefined',
    expected: false,
  },
  {
    name: 'array value',
    value: TEST_VALUES.array,
    typeGuard: 'isNullOrUndefined',
    expected: false,
  },
  {
    name: 'object value',
    value: TEST_VALUES.object,
    typeGuard: 'isNullOrUndefined',
    expected: false,
  },
  {
    name: 'buffer value',
    value: TEST_VALUES.buffer,
    typeGuard: 'isNullOrUndefined',
    expected: false,
  },

  // isArray
  {
    name: 'array value',
    value: TEST_VALUES.array,
    typeGuard: 'isArray',
    expected: true,
  },
  {
    name: 'empty array',
    value: TEST_VALUES.emptyArray,
    typeGuard: 'isArray',
    expected: true,
  },
  {
    name: 'nested array',
    value: TEST_VALUES.nestedArray,
    typeGuard: 'isArray',
    expected: true,
  },
  {
    name: 'string value',
    value: TEST_VALUES.string,
    typeGuard: 'isArray',
    expected: false,
  },
  {
    name: 'number value',
    value: TEST_VALUES.number,
    typeGuard: 'isArray',
    expected: false,
  },
  {
    name: 'boolean value',
    value: TEST_VALUES.booleanTrue,
    typeGuard: 'isArray',
    expected: false,
  },
  {
    name: 'null value',
    value: TEST_VALUES.null,
    typeGuard: 'isArray',
    expected: false,
  },
  {
    name: 'undefined value',
    value: TEST_VALUES.undefined,
    typeGuard: 'isArray',
    expected: false,
  },
  {
    name: 'object value',
    value: TEST_VALUES.object,
    typeGuard: 'isArray',
    expected: false,
  },
  {
    name: 'buffer value',
    value: TEST_VALUES.buffer,
    typeGuard: 'isArray',
    expected: false,
  },

  // isBuffer
  {
    name: 'buffer value',
    value: TEST_VALUES.buffer,
    typeGuard: 'isBuffer',
    expected: true,
  },
  {
    name: 'empty buffer',
    value: TEST_VALUES.emptyBuffer,
    typeGuard: 'isBuffer',
    expected: true,
  },
  {
    name: 'large buffer',
    value: TEST_VALUES.largeBuffer,
    typeGuard: 'isBuffer',
    expected: true,
  },
  {
    name: 'string value',
    value: TEST_VALUES.string,
    typeGuard: 'isBuffer',
    expected: false,
  },
  {
    name: 'number value',
    value: TEST_VALUES.number,
    typeGuard: 'isBuffer',
    expected: false,
  },
  {
    name: 'boolean value',
    value: TEST_VALUES.booleanTrue,
    typeGuard: 'isBuffer',
    expected: false,
  },
  {
    name: 'null value',
    value: TEST_VALUES.null,
    typeGuard: 'isBuffer',
    expected: false,
  },
  {
    name: 'undefined value',
    value: TEST_VALUES.undefined,
    typeGuard: 'isBuffer',
    expected: false,
  },
  {
    name: 'array value',
    value: TEST_VALUES.array,
    typeGuard: 'isBuffer',
    expected: false,
  },
  {
    name: 'object value',
    value: TEST_VALUES.object,
    typeGuard: 'isBuffer',
    expected: false,
  },
];

// バリデーション関数テスト用のデータセット
export const VALIDATION_TEST_CASES = [
  // validateString
  {
    name: 'valid string',
    value: TEST_VALUES.string,
    validator: 'validateString',
    shouldThrow: false,
  },
  {
    name: 'empty string',
    value: TEST_VALUES.emptyString,
    validator: 'validateString',
    shouldThrow: false,
  },
  {
    name: 'unicode string',
    value: TEST_VALUES.unicodeString,
    validator: 'validateString',
    shouldThrow: false,
  },
  {
    name: 'number value',
    value: TEST_VALUES.number,
    validator: 'validateString',
    shouldThrow: true,
  },
  {
    name: 'boolean value',
    value: TEST_VALUES.booleanTrue,
    validator: 'validateString',
    shouldThrow: true,
  },
  {
    name: 'null value',
    value: TEST_VALUES.null,
    validator: 'validateString',
    shouldThrow: true,
  },
  {
    name: 'undefined value',
    value: TEST_VALUES.undefined,
    validator: 'validateString',
    shouldThrow: true,
  },
  {
    name: 'array value',
    value: TEST_VALUES.array,
    validator: 'validateString',
    shouldThrow: true,
  },
  {
    name: 'object value',
    value: TEST_VALUES.object,
    validator: 'validateString',
    shouldThrow: true,
  },
  {
    name: 'buffer value',
    value: TEST_VALUES.buffer,
    validator: 'validateString',
    shouldThrow: true,
  },

  // validateArray
  {
    name: 'valid array',
    value: TEST_VALUES.array,
    validator: 'validateArray',
    shouldThrow: false,
  },
  {
    name: 'empty array',
    value: TEST_VALUES.emptyArray,
    validator: 'validateArray',
    shouldThrow: false,
  },
  {
    name: 'nested array',
    value: TEST_VALUES.nestedArray,
    validator: 'validateArray',
    shouldThrow: false,
  },
  {
    name: 'string value',
    value: TEST_VALUES.string,
    validator: 'validateArray',
    shouldThrow: true,
  },
  {
    name: 'number value',
    value: TEST_VALUES.number,
    validator: 'validateArray',
    shouldThrow: true,
  },
  {
    name: 'boolean value',
    value: TEST_VALUES.booleanTrue,
    validator: 'validateArray',
    shouldThrow: true,
  },
  {
    name: 'null value',
    value: TEST_VALUES.null,
    validator: 'validateArray',
    shouldThrow: true,
  },
  {
    name: 'undefined value',
    value: TEST_VALUES.undefined,
    validator: 'validateArray',
    shouldThrow: true,
  },
  {
    name: 'object value',
    value: TEST_VALUES.object,
    validator: 'validateArray',
    shouldThrow: true,
  },
  {
    name: 'buffer value',
    value: TEST_VALUES.buffer,
    validator: 'validateArray',
    shouldThrow: true,
  },

  // validateBuffer
  {
    name: 'valid buffer',
    value: TEST_VALUES.buffer,
    validator: 'validateBuffer',
    shouldThrow: false,
  },
  {
    name: 'empty buffer',
    value: TEST_VALUES.emptyBuffer,
    validator: 'validateBuffer',
    shouldThrow: false,
  },
  {
    name: 'large buffer',
    value: TEST_VALUES.largeBuffer,
    validator: 'validateBuffer',
    shouldThrow: false,
  },
  {
    name: 'string value',
    value: TEST_VALUES.string,
    validator: 'validateBuffer',
    shouldThrow: true,
  },
  {
    name: 'number value',
    value: TEST_VALUES.number,
    validator: 'validateBuffer',
    shouldThrow: true,
  },
  {
    name: 'boolean value',
    value: TEST_VALUES.booleanTrue,
    validator: 'validateBuffer',
    shouldThrow: true,
  },
  {
    name: 'null value',
    value: TEST_VALUES.null,
    validator: 'validateBuffer',
    shouldThrow: true,
  },
  {
    name: 'undefined value',
    value: TEST_VALUES.undefined,
    validator: 'validateBuffer',
    shouldThrow: true,
  },
  {
    name: 'array value',
    value: TEST_VALUES.array,
    validator: 'validateBuffer',
    shouldThrow: true,
  },
  {
    name: 'object value',
    value: TEST_VALUES.object,
    validator: 'validateBuffer',
    shouldThrow: true,
  },
];

// 範囲検証テスト用のデータセット
export const RANGE_VALIDATION_TEST_CASES = [
  { name: 'value in range', value: 5, min: 0, max: 10, shouldThrow: false },
  { name: 'value at minimum', value: 0, min: 0, max: 10, shouldThrow: false },
  { name: 'value at maximum', value: 10, min: 0, max: 10, shouldThrow: false },
  {
    name: 'value below minimum',
    value: -1,
    min: 0,
    max: 10,
    shouldThrow: true,
  },
  {
    name: 'value above maximum',
    value: 11,
    min: 0,
    max: 10,
    shouldThrow: true,
  },
  { name: 'negative range', value: -5, min: -10, max: -1, shouldThrow: false },
  {
    name: 'float value in range',
    value: 3.14,
    min: 0,
    max: 5,
    shouldThrow: false,
  },
  {
    name: 'float value out of range',
    value: 5.1,
    min: 0,
    max: 5,
    shouldThrow: true,
  },
];

// エラーテスト用のヘルパー関数
export function expectTypeError(
  fn: () => void,
  expectedType?: string,
  parameterName?: string,
): void {
  expect(fn).toThrow(TypeError);
  if (expectedType) {
    expect(fn).toThrow(expectedType);
  }
  if (parameterName) {
    expect(fn).toThrow(parameterName);
  }
}

export function expectArgumentError(
  fn: () => void,
  parameterName?: string,
): void {
  expect(fn).toThrow(ArgumentError);
  if (parameterName) {
    expect(fn).toThrow(parameterName);
  }
}

// パラメータ化テスト用のヘルパー
export function runParameterizedTests<T, R>(
  testCases: { name: string; input: T; expected?: R }[],
  testFn: (input: T) => R,
  assertionFn: (result: R, expected?: R) => void,
): void {
  testCases.forEach(({ name, input, expected }) => {
    it(`should handle ${name}`, () => {
      const result = testFn(input);
      assertionFn(result, expected);
    });
  });
}

// 型ガードテスト用のヘルパー
export function runTypeGuardTests(
  testCases: {
    name: string;
    value: unknown;
    typeGuard: string;
    expected: boolean;
  }[],
  typeGuards: Record<string, (value: unknown) => boolean>,
): void {
  testCases.forEach(({ name, value, typeGuard, expected }) => {
    it(`should ${expected ? 'return true' : 'return false'} for ${name}`, () => {
      const guard = typeGuards[typeGuard];
      expect(guard(value)).toBe(expected);
    });
  });
}

// バリデーションテスト用のヘルパー
export function runValidationTests(
  testCases: {
    name: string;
    value: unknown;
    validator: string;
    shouldThrow: boolean;
  }[],
  validators: Record<
    string,
    (value: unknown, parameterName?: string) => unknown
  >,
): void {
  testCases.forEach(({ name, value, validator, shouldThrow }) => {
    it(`should ${shouldThrow ? 'throw error' : 'not throw error'} for ${name}`, () => {
      const validate = validators[validator];
      if (shouldThrow) {
        expect(() => validate(value, 'testParam')).toThrow();
      } else {
        expect(() => validate(value, 'testParam')).not.toThrow();
      }
    });
  });
}
