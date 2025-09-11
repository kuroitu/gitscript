import {
  calculateHash,
  calculateHashFromObject,
} from '@/core/hash/HashCalculator';
import {
  isValidHash,
  isValidShortHash,
  verifyHashIntegrity,
  verifyObjectHashIntegrity,
} from '@/core/hash/HashValidator';
import {
  expectValidHash,
  INVALID_HASHES,
  runValidationTests,
  VALID_HASHES,
  VALIDATION_TEST_CASES,
} from '@tests/core/hash/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Hash Validator Functions', () => {
  describe('isValidHash', () => {
    // パラメータ化テストの例
    it('should validate valid hashes correctly', () => {
      runValidationTests(VALIDATION_TEST_CASES.validHashes, isValidHash);
    });

    it('should reject invalid hashes correctly', () => {
      runValidationTests(VALIDATION_TEST_CASES.invalidHashes, isValidHash);
    });

    it('should return false for string with invalid characters', () => {
      expect(isValidHash('a1b2c3d4e5f6789012345678901234567890abcz')).toBe(
        false,
      );
    });
  });

  describe('isValidShortHash', () => {
    // パラメータ化テストの例
    it('should validate short hashes correctly', () => {
      runValidationTests(VALIDATION_TEST_CASES.shortHashes, isValidShortHash);
    });

    it('should return true for maximum length', () => {
      expect(isValidShortHash(VALID_HASHES.sha1_1, 4, 40)).toBe(true);
    });

    it('should return false for non-string input', () => {
      expect(isValidShortHash(INVALID_HASHES.nonString as any)).toBe(false);
      expect(isValidShortHash(INVALID_HASHES.null as any)).toBe(false);
      expect(isValidShortHash(INVALID_HASHES.undefined as any)).toBe(false);
    });

    it('should handle custom min and max lengths', () => {
      expect(isValidShortHash('abc', 3, 5)).toBe(true);
      expect(isValidShortHash('ab', 3, 5)).toBe(false);
      expect(isValidShortHash('abcdef', 3, 5)).toBe(false);
    });
  });

  describe('verifyHashIntegrity', () => {
    it('should return true for matching hash and content', () => {
      const content = 'test content';
      const hash = calculateHash(content);

      expect(verifyHashIntegrity(hash, content)).toBe(true);
    });

    it('should return false for non-matching hash and content', () => {
      const content = 'test content';
      const wrongHash = 'a1b2c3d4e5f6789012345678901234567890abcd';

      expect(verifyHashIntegrity(wrongHash, content)).toBe(false);
    });

    it('should return false for invalid hash', () => {
      const content = 'test content';
      const invalidHash = 'invalid';

      expect(verifyHashIntegrity(invalidHash, content)).toBe(false);
    });

    it('should handle case insensitive comparison', () => {
      const content = 'test content';
      const hash = calculateHash(content);
      const upperHash = hash.toUpperCase();

      expect(verifyHashIntegrity(upperHash, content)).toBe(true);
    });
  });

  describe('verifyObjectHashIntegrity', () => {
    it('should return true for matching hash and object', () => {
      const obj = { name: 'test', value: 123 };
      const hash = calculateHashFromObject(obj);

      expect(verifyObjectHashIntegrity(hash, obj)).toBe(true);
    });

    it('should return false for non-matching hash and object', () => {
      const obj = { name: 'test', value: 123 };
      const wrongHash = 'a1b2c3d4e5f6789012345678901234567890abcd';

      expect(verifyObjectHashIntegrity(wrongHash, obj)).toBe(false);
    });

    it('should return false for invalid hash', () => {
      const obj = { name: 'test', value: 123 };
      const invalidHash = 'invalid';

      expect(verifyObjectHashIntegrity(invalidHash, obj)).toBe(false);
    });

    it('should handle different object properties order', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 2, a: 1 };

      const hash1 = calculateHashFromObject(obj1);
      const hash2 = calculateHashFromObject(obj2);

      // JSON.stringifyの順序依存性により異なるハッシュになる
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Security and edge cases', () => {
    it('should handle potential hash collision attempts', () => {
      // 異なる入力が同じハッシュになることを防ぐ
      const inputs = [
        'test1',
        'test2',
        'test3',
        'a'.repeat(1000),
        'b'.repeat(1000),
        'c'.repeat(1000),
      ];

      const hashes = inputs.map((input) => calculateHash(input));
      const uniqueHashes = new Set(hashes);

      // すべて異なるハッシュであることを確認
      expect(uniqueHashes.size).toBe(hashes.length);
    });

    it('should handle malicious input safely', () => {
      // calculateHashFromObjectは任意のオブジェクトを受け入れる
      expect(() => calculateHashFromObject(null)).not.toThrow();
      expect(() => calculateHashFromObject(undefined)).not.toThrow();
      expect(() => calculateHashFromObject({})).not.toThrow();
      expect(() => calculateHashFromObject([])).not.toThrow();
      expect(() => calculateHashFromObject(() => {})).not.toThrow();
      expect(() => calculateHashFromObject(new Date())).not.toThrow();
      expect(() => calculateHashFromObject(/regex/)).not.toThrow();
      expect(() => calculateHashFromObject(new Error('test'))).not.toThrow();

      // calculateHashは文字列のみを受け入れるため、エラーが投げられることを確認
      expect(() => calculateHash(undefined as any)).toThrow();
      expect(() => calculateHash(null as any)).toThrow();
    });

    it('should handle extremely long strings', () => {
      const longString = 'a'.repeat(10000000); // 10MB文字列

      const startTime = performance.now();
      const hash = calculateHash(longString);
      const endTime = performance.now();

      expectValidHash(hash);
      expect(endTime - startTime).toBeLessThan(2000); // 2秒以内
    });
  });
});
