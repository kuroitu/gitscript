/**
 * Serializationモジュールのテストヘルパー
 *
 * テストデータとヘルパー関数を提供
 */

import { SerializationError } from '@/core/serialization/json-provider';
import { expect, it } from 'vitest';

// テスト用のオブジェクトデータ
export const TEST_OBJECTS = {
  simple: { name: 'test', value: 123 },
  empty: {},
  nested: {
    level1: {
      level2: {
        value: 'deep',
      },
    },
  },
  array: [1, 2, 3, 'test'],
  mixed: {
    string: 'hello',
    number: 42,
    boolean: true,
    null: null,
    array: [1, 2, 3],
    object: { nested: true },
  },
  withSpecialChars: {
    'key with spaces': 'value',
    'key-with-dashes': 'value',
    key_with_underscores: 'value',
    'key.with.dots': 'value',
  },
  withUnicode: {
    japanese: 'こんにちは世界',
    emoji: '🌍🚀💻',
    chinese: '你好世界',
    korean: '안녕하세요',
  },
  withNumbers: {
    integer: 42,
    float: 3.14159,
    negative: -100,
    zero: 0,
    large: 999999999999999,
  },
  withBooleans: {
    true: true,
    false: false,
  },
  withNulls: {
    nullValue: null,
    undefinedValue: undefined,
  },
  withArrays: {
    empty: [],
    numbers: [1, 2, 3, 4, 5],
    strings: ['a', 'b', 'c'],
    mixed: [1, 'two', true, null],
    nested: [
      [1, 2],
      [3, 4],
    ],
  },
};

// テスト用のプリミティブデータ
export const TEST_PRIMITIVES = {
  string: 'hello world',
  emptyString: '',
  number: 42,
  zero: 0,
  negative: -100,
  float: 3.14159,
  booleanTrue: true,
  booleanFalse: false,
  null: null,
  undefined: undefined,
};

// テスト用の配列データ
export const TEST_ARRAYS = {
  empty: [],
  numbers: [1, 2, 3, 4, 5],
  strings: ['hello', 'world', 'test'],
  mixed: [1, 'two', true, null, { key: 'value' }],
  nested: [
    [1, 2],
    [3, 4],
    [5, 6],
  ],
  withEmpty: ['', 'non-empty', ''],
  withNulls: [null, 'value', null],
  withUndefined: [undefined, 'value', undefined],
};

// 循環参照オブジェクト（エラーテスト用）
export function createCircularReference(): unknown {
  const obj: { name: string; self: unknown } = { name: 'test', self: null };
  obj.self = obj;
  return obj;
}

// 関数を含むオブジェクト（エラーテスト用）
export const OBJECT_WITH_FUNCTION = {
  name: 'test',
  func: () => 'hello',
  method: function () {
    return 'world';
  },
};

// シンボルを含むオブジェクト（エラーテスト用）
export const OBJECT_WITH_SYMBOL = {
  name: 'test',
  symbol: Symbol('test'),
};

// 期待されるJSON文字列（既知の入力に対する）
export const EXPECTED_JSON = {
  simple: '{"name":"test","value":123}',
  empty: '{}',
  string: '"hello world"',
  number: '42',
  boolean: 'true',
  null: 'null',
  array: '[1,2,3,"test"]',
  nested: '{"level1":{"level2":{"value":"deep"}}}',
};

// エラーテスト用のヘルパー関数
export function expectSerializationError(
  fn: () => void,
  expectedMessage?: string,
): void {
  expect(fn).toThrow(SerializationError);
  if (expectedMessage) {
    expect(fn).toThrow(expectedMessage);
  }
}

// JSON文字列の検証用ヘルパー
export function expectValidJson(jsonString: string): void {
  expect(jsonString).toBeDefined();
  expect(typeof jsonString).toBe('string');
  expect(() => JSON.parse(jsonString)).not.toThrow();
}

// パフォーマンステスト用のヘルパー
export function measureExecutionTime(fn: () => void): number {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  return endTime - startTime;
}

// 大容量オブジェクト生成用のヘルパー
export function generateLargeObject(size: number): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < size; i++) {
    obj[`key${i}`] = `value${i}`;
  }
  return obj;
}

// 深いネストオブジェクト生成用のヘルパー
export function generateDeepNestedObject(depth: number): unknown {
  if (depth === 0) {
    return { value: 'leaf' };
  }
  return {
    level: depth,
    nested: generateDeepNestedObject(depth - 1),
  };
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

// 既知のJSON文字列のテストケース
export const KNOWN_JSON_TEST_CASES = [
  {
    name: 'simple object',
    input: TEST_OBJECTS.simple,
    expected: EXPECTED_JSON.simple,
  },
  {
    name: 'empty object',
    input: TEST_OBJECTS.empty,
    expected: EXPECTED_JSON.empty,
  },
  {
    name: 'string primitive',
    input: TEST_PRIMITIVES.string,
    expected: EXPECTED_JSON.string,
  },
  {
    name: 'number primitive',
    input: TEST_PRIMITIVES.number,
    expected: EXPECTED_JSON.number,
  },
  {
    name: 'boolean primitive',
    input: TEST_PRIMITIVES.booleanTrue,
    expected: EXPECTED_JSON.boolean,
  },
  {
    name: 'null primitive',
    input: TEST_PRIMITIVES.null,
    expected: EXPECTED_JSON.null,
  },
];

// エラーケースのテストデータ
export const ERROR_TEST_CASES = [
  {
    name: 'circular reference',
    input: createCircularReference(),
    shouldThrow: true,
  },
  {
    name: 'object with function',
    input: OBJECT_WITH_FUNCTION,
    shouldThrow: false, // 関数はundefinedに変換される
  },
  {
    name: 'object with symbol',
    input: OBJECT_WITH_SYMBOL,
    shouldThrow: false, // シンボルはundefinedに変換される
  },
];
