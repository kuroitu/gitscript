/**
 * Cryptoモジュールのテストヘルパー
 *
 * テストデータとヘルパー関数を提供
 */

import { CryptoError } from '@/core/crypto/errors';
import { expect, it } from 'vitest';

// テスト用の文字列データ
export const TEST_STRINGS = {
  simple: 'hello world',
  empty: '',
  unicode: 'こんにちは世界🌍',
  long: 'a'.repeat(10000),
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  newlines: 'line1\nline2\r\nline3\t',
  nullChar: 'test\0null',
  singleChar: 'a',
  numbers: '1234567890',
  mixed: 'Hello123!@#世界',
} as const;

// テスト用のBufferデータ
export const TEST_BUFFERS = {
  simple: Buffer.from('hello world', 'utf8'),
  empty: Buffer.alloc(0),
  binary: Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]),
  unicode: Buffer.from('こんにちは世界', 'utf8'),
  large: Buffer.alloc(1000, 0x42), // 1000バイトの0x42
  mixed: Buffer.from('Hello123!@#', 'utf8'),
} as const;

// テスト用の配列データ
export const TEST_ARRAYS = {
  simple: ['hello', 'world'],
  empty: [],
  single: ['single'],
  mixed: ['string', Buffer.from('buffer', 'utf8'), 'another'],
  withEmpty: ['', 'non-empty', ''],
  unicode: ['こんにちは', '世界', '🌍'],
  long: Array.from({ length: 100 }, (_, i) => `item${i}`),
};

// 期待されるハッシュ値（既知の入力に対する）
export const EXPECTED_HASHES = {
  emptyString: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
  helloWorld: '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed',
  singleA: '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8',
  unicode: '8b5b9b4b8b5b9b4b8b5b9b4b8b5b9b4b8b5b9b4b', // 仮の値
} as const;

// エラーテスト用のヘルパー関数
export function expectCryptoError(
  fn: () => void,
  expectedMessage?: string,
): void {
  expect(fn).toThrow(CryptoError);
  if (expectedMessage) {
    expect(fn).toThrow(expectedMessage);
  }
}

export function expectValidHash(hash: string): void {
  expect(hash).toBeDefined();
  expect(typeof hash).toBe('string');
  expect(hash).toMatch(/^[a-f0-9]{40}$/); // SHA-1は40文字の16進数
}

// パフォーマンステスト用のヘルパー
export function measureExecutionTime(fn: () => void): number {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  return endTime - startTime;
}

// 大容量データ生成用のヘルパー
export function generateLargeString(size: number): string {
  return 'a'.repeat(size);
}

export function generateLargeBuffer(size: number): Buffer {
  return Buffer.alloc(size, 0x42);
}

export function generateLargeArray(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `item${i}`);
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

// エンコーディングテスト用のデータ
export const ENCODING_TEST_CASES = [
  { name: 'UTF-8', encoding: 'utf8' as BufferEncoding },
  { name: 'ASCII', encoding: 'ascii' as BufferEncoding },
  { name: 'Latin1', encoding: 'latin1' as BufferEncoding },
] as const;

// エンコーディングテスト用のデータ（hexエンコーディング用）
export const HEX_ENCODING_TEST_CASES = [
  { name: 'Base64', encoding: 'base64' as BufferEncoding },
  { name: 'Hex', encoding: 'hex' as BufferEncoding },
] as const;

// 区切り文字テスト用のデータ
export const SEPARATOR_TEST_CASES = [
  { name: 'null character', separator: '\0' },
  { name: 'newline', separator: '\n' },
  { name: 'comma', separator: ',' },
  { name: 'space', separator: ' ' },
  { name: 'empty string', separator: '' },
  { name: 'multiple chars', separator: '|||' },
] as const;

// 既知のハッシュ値のテストケース
export const KNOWN_HASH_TEST_CASES = [
  {
    name: 'empty string',
    input: '',
    expected: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
  },
  {
    name: 'hello world',
    input: 'hello world',
    expected: '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed',
  },
  {
    name: 'single character a',
    input: 'a',
    expected: '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8',
  },
];
