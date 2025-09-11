import {
  calculateHash,
  calculateHashFromBuffer,
  calculateHashFromMultiple,
  calculateHashFromObject,
} from '@/core/hash/HashCalculator';
import {
  TEST_ARRAYS,
  TEST_BUFFERS,
  TEST_OBJECTS,
  TEST_STRINGS,
  expectSerializationError,
  expectTypeError,
  expectValidHash,
  runHashTests,
} from '@tests/core/hash/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Hash Calculator Functions', () => {
  describe('calculateHash', () => {
    it('should calculate SHA-1 hash for a string', () => {
      const hash = calculateHash(TEST_STRINGS.simple);
      expectValidHash(hash);
      expect(hash).toBe('0a0a9f2a6772942557ab5355d76af442f8f65e01');
    });

    it('should throw error for non-string input', () => {
      expectTypeError(() => calculateHash(123 as any), 'string', 'content');
    });

    it('should handle empty string', () => {
      const hash = calculateHash(TEST_STRINGS.empty);
      expectValidHash(hash);
      expect(hash).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    });

    it('should produce consistent hashes for same input', () => {
      const content = 'test content';
      const hash1 = calculateHash(content);
      const hash2 = calculateHash(content);
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = calculateHash('content1');
      const hash2 = calculateHash('content2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('calculateHashFromObject', () => {
    it('should calculate hash from simple object', () => {
      const hash = calculateHashFromObject(TEST_OBJECTS.simple);
      expectValidHash(hash);
    });

    it('should handle null and undefined', () => {
      const hashNull = calculateHashFromObject(null);
      const hashUndefined = calculateHashFromObject(undefined);

      expectValidHash(hashNull);
      expectValidHash(hashUndefined);
      expect(hashNull).not.toBe(hashUndefined);
    });

    it('should handle arrays', () => {
      const hash = calculateHashFromObject([1, 2, 3, 'test']);
      expectValidHash(hash);
    });

    it('should produce consistent hashes for same object', () => {
      const obj = { a: 1, b: 2 };
      const hash1 = calculateHashFromObject(obj);
      const hash2 = calculateHashFromObject(obj);
      expect(hash1).toBe(hash2);
    });
  });

  describe('calculateHashFromBuffer', () => {
    it('should calculate hash from Buffer', () => {
      const hash = calculateHashFromBuffer(TEST_BUFFERS.simple);
      expectValidHash(hash);
    });

    it('should throw error for non-Buffer input', () => {
      expectTypeError(
        () => calculateHashFromBuffer('not a buffer' as any),
        'Buffer',
        'buffer',
      );
    });

    it('should handle empty buffer', () => {
      const hash = calculateHashFromBuffer(TEST_BUFFERS.empty);
      expectValidHash(hash);
    });
  });

  describe('calculateHashFromMultiple', () => {
    it('should calculate hash from multiple strings', () => {
      const hash = calculateHashFromMultiple(TEST_ARRAYS.simple);
      expectValidHash(hash);
    });

    it('should throw error for non-array input', () => {
      expectTypeError(
        () => calculateHashFromMultiple('not an array' as any),
        'array',
        'contents',
      );
    });

    it('should handle empty array', () => {
      const hash = calculateHashFromMultiple(TEST_ARRAYS.empty);
      expectValidHash(hash);
    });

    it('should produce different hashes for different order', () => {
      const hash1 = calculateHashFromMultiple(TEST_ARRAYS.mixed);
      const hash2 = calculateHashFromMultiple(TEST_ARRAYS.reversed);
      expect(hash1).not.toBe(hash2);
    });

    it('should handle single element array', () => {
      const hash = calculateHashFromMultiple(TEST_ARRAYS.single);
      expectValidHash(hash);
    });

    it('should handle array with empty strings', () => {
      const hash = calculateHashFromMultiple(TEST_ARRAYS.withEmpty);
      expectValidHash(hash);
    });
  });

  describe('Edge cases and special characters', () => {
    // パラメータ化テストの例
    it('should handle various string types', () => {
      const testCases = [
        { name: 'unicode characters', input: TEST_STRINGS.unicode },
        { name: 'very long strings', input: TEST_STRINGS.long },
        { name: 'special characters', input: TEST_STRINGS.specialChars },
        { name: 'newlines and tabs', input: TEST_STRINGS.newlines },
      ];

      runHashTests(testCases, calculateHash);
    });

    it('should handle objects with special values', () => {
      const hash = calculateHashFromObject(TEST_OBJECTS.complex);
      expectValidHash(hash);
    });

    it('should handle circular reference objects gracefully', () => {
      expectSerializationError(() => {
        calculateHashFromObject(TEST_OBJECTS.circular);
      });
    });

    it('should handle functions in objects', () => {
      const hash = calculateHashFromObject(TEST_OBJECTS.withFunction);
      expectValidHash(hash);
    });

    it('should handle very large objects without memory issues', () => {
      const largeObject = {
        data: 'x'.repeat(1000000), // 1MB文字列
        array: Array.from({ length: 10000 }, (_, i) => i),
        nested: {
          deep: {
            value: 'test',
          },
        },
      };

      const startTime = performance.now();
      const hash = calculateHashFromObject(largeObject);
      const endTime = performance.now();

      expectValidHash(hash);
      expect(endTime - startTime).toBeLessThan(1000); // 1秒以内
    });
  });
});
