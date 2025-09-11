import {
  compareHashes,
  detectHashCollision,
  expandShortHash,
  findHashIndex,
  removeDuplicateHashes,
  shortenHash,
  sortHashes,
} from '@/core/hash/HashUtils';
import {
  INVALID_HASHES,
  VALID_HASHES,
  expectArgumentError,
  expectInvalidHashError,
  generateHashArrayWithDuplicates,
  generateLargeHashArray,
} from '@tests/core/hash/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Hash Utils Functions', () => {
  describe('compareHashes', () => {
    it('should return true for identical hashes', () => {
      expect(compareHashes(VALID_HASHES.sha1_1, VALID_HASHES.sha1_1)).toBe(
        true,
      );
    });

    it('should return true for case insensitive comparison', () => {
      expect(
        compareHashes(VALID_HASHES.lowercase, VALID_HASHES.uppercase),
      ).toBe(true);
    });

    it('should return false for different hashes', () => {
      expect(compareHashes(VALID_HASHES.sha1_1, VALID_HASHES.sha1_2)).toBe(
        false,
      );
    });

    it('should throw error for invalid hash format', () => {
      expectInvalidHashError(
        () => compareHashes(VALID_HASHES.sha1_1, INVALID_HASHES.invalidChar),
        INVALID_HASHES.invalidChar,
      );
    });
  });

  describe('shortenHash', () => {
    it('should shorten hash to specified length', () => {
      const shortened = shortenHash(VALID_HASHES.sha1_1, 7);
      expect(shortened).toBe('a1b2c3d');
      expect(shortened).toHaveLength(7);
    });

    it('should use default length of 7', () => {
      const shortened = shortenHash(VALID_HASHES.sha1_1);
      expect(shortened).toBe('a1b2c3d');
      expect(shortened).toHaveLength(7);
    });

    it('should throw error for invalid hash format', () => {
      expectInvalidHashError(
        () => shortenHash(INVALID_HASHES.invalidChar),
        INVALID_HASHES.invalidChar,
      );
    });

    it('should throw error for length less than 4', () => {
      expectArgumentError(() => shortenHash(VALID_HASHES.sha1_1, 3), 'length');
    });

    it('should throw error for length greater than 40', () => {
      expectArgumentError(() => shortenHash(VALID_HASHES.sha1_1, 41), 'length');
    });
  });

  describe('expandShortHash', () => {
    it('should expand short hash to full hash', () => {
      const candidates = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
        'c3d4e5f6789012345678901234567890abcdef12',
      ];
      const shortHash = 'a1b2c3d';

      const result = expandShortHash(shortHash, candidates);
      expect(result).toBe('a1b2c3d4e5f6789012345678901234567890abcd');
    });

    it('should return null for no match', () => {
      const candidates = [
        'b2c3d4e5f6789012345678901234567890abcde1',
        'c3d4e5f6789012345678901234567890abcdef12',
      ];
      const shortHash = 'a1b2c3d';

      const result = expandShortHash(shortHash, candidates);
      expect(result).toBeNull();
    });

    it('should handle case insensitive matching', () => {
      const candidates = ['A1B2C3D4E5F6789012345678901234567890ABCD'];
      const shortHash = 'a1b2c3d';

      const result = expandShortHash(shortHash, candidates);
      expect(result).toBe('A1B2C3D4E5F6789012345678901234567890ABCD');
    });

    it('should return null for invalid short hash', () => {
      const candidates = ['a1b2c3d4e5f6789012345678901234567890abcd'];
      const shortHash = 'abc'; // too short

      const result = expandShortHash(shortHash, candidates);
      expect(result).toBeNull();
    });

    it('should return null for empty candidates', () => {
      const shortHash = 'a1b2c3d';
      const result = expandShortHash(shortHash, []);
      expect(result).toBeNull();
    });
  });

  describe('detectHashCollision', () => {
    it('should detect hash collision', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
        'a1b2c3d4e5f6789012345678901234567890abcd', // duplicate
      ];

      const collision = detectHashCollision(hashes);
      expect(collision).toEqual([
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'a1b2c3d4e5f6789012345678901234567890abcd',
      ]);
    });

    it('should return null for no collision', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
        'c3d4e5f6789012345678901234567890abcdef12',
      ];

      const collision = detectHashCollision(hashes);
      expect(collision).toBeNull();
    });

    it('should handle case insensitive collision detection', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'A1B2C3D4E5F6789012345678901234567890ABCD',
      ];

      const collision = detectHashCollision(hashes);
      expect(collision).not.toBeNull();
    });

    it('should ignore invalid hashes', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'invalid',
        'a1b2c3d4e5f6789012345678901234567890abcd',
      ];

      const collision = detectHashCollision(hashes);
      expect(collision).toEqual([
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'a1b2c3d4e5f6789012345678901234567890abcd',
      ]);
    });
  });

  describe('sortHashes', () => {
    it('should sort hashes alphabetically', () => {
      const hashes = [
        'c3d4e5f6789012345678901234567890abcdef12',
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
      ];

      const sorted = sortHashes(hashes);
      expect(sorted).toEqual([
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
        'c3d4e5f6789012345678901234567890abcdef12',
      ]);
    });

    it('should filter out invalid hashes', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'invalid',
        'b2c3d4e5f6789012345678901234567890abcde1',
      ];

      const sorted = sortHashes(hashes);
      expect(sorted).toEqual([
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
      ]);
    });

    it('should handle empty array', () => {
      const sorted = sortHashes([]);
      expect(sorted).toEqual([]);
    });
  });

  describe('removeDuplicateHashes', () => {
    it('should remove duplicate hashes', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
        'a1b2c3d4e5f6789012345678901234567890abcd',
      ];

      const unique = removeDuplicateHashes(hashes);
      expect(unique).toEqual([
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
      ]);
    });

    it('should handle case insensitive duplicates', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'A1B2C3D4E5F6789012345678901234567890ABCD',
      ];

      const unique = removeDuplicateHashes(hashes);
      expect(unique).toEqual(['a1b2c3d4e5f6789012345678901234567890abcd']);
    });

    it('should filter out invalid hashes', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'invalid',
        'b2c3d4e5f6789012345678901234567890abcde1',
      ];

      const unique = removeDuplicateHashes(hashes);
      expect(unique).toEqual([
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
      ]);
    });
  });

  describe('findHashIndex', () => {
    it('should find index of hash in array', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
        'c3d4e5f6789012345678901234567890abcdef12',
      ];
      const target = 'b2c3d4e5f6789012345678901234567890abcde1';

      const index = findHashIndex(hashes, target);
      expect(index).toBe(1);
    });

    it('should return -1 for hash not found', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'b2c3d4e5f6789012345678901234567890abcde1',
      ];
      const target = 'c3d4e5f6789012345678901234567890abcdef12';

      const index = findHashIndex(hashes, target);
      expect(index).toBe(-1);
    });

    it('should handle case insensitive search', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'B2C3D4E5F6789012345678901234567890ABCDE1',
      ];
      const target = 'b2c3d4e5f6789012345678901234567890abcde1';

      const index = findHashIndex(hashes, target);
      expect(index).toBe(1);
    });

    it('should return -1 for invalid target hash', () => {
      const hashes = ['a1b2c3d4e5f6789012345678901234567890abcd'];
      const target = 'invalid';

      const index = findHashIndex(hashes, target);
      expect(index).toBe(-1);
    });
  });

  describe('Edge cases and performance', () => {
    it('should handle large arrays efficiently', () => {
      const hashes = generateLargeHashArray(1000);
      const target = 'a000000000000000000000000000000000000000';

      const startTime = performance.now();
      const index = findHashIndex(hashes, target);
      const endTime = performance.now();

      expect(index).toBe(0);
      expect(endTime - startTime).toBeLessThan(100); // 100ms以内
    });

    it('should handle very large arrays for collision detection', () => {
      const hashes = generateLargeHashArray(10000);
      // 重複を追加
      hashes[5000] = hashes[0];

      const startTime = performance.now();
      const collision = detectHashCollision(hashes);
      const endTime = performance.now();

      expect(collision).not.toBeNull();
      expect(endTime - startTime).toBeLessThan(500); // 500ms以内
    });

    it('should handle empty arrays', () => {
      expect(
        compareHashes(
          'a1b2c3d4e5f6789012345678901234567890abcd',
          'a1b2c3d4e5f6789012345678901234567890abcd',
        ),
      ).toBe(true);
    });

    it('should handle boundary length values for shortenHash', () => {
      const hash = 'a1b2c3d4e5f6789012345678901234567890abcd';

      const minLength = shortenHash(hash, 4);
      const maxLength = shortenHash(hash, 40);

      expect(minLength).toHaveLength(4);
      expect(maxLength).toHaveLength(40);
      expect(minLength).toBe('a1b2');
      expect(maxLength).toBe(hash);
    });

    it('should handle expandShortHash with multiple matches', () => {
      const candidates = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'a1b2c3d4e5f6789012345678901234567890abce',
        'a1b2c3d4e5f6789012345678901234567890abcf',
      ];
      const shortHash = 'a1b2c3d';

      // 最初にマッチしたものを返す
      const result = expandShortHash(shortHash, candidates);
      expect(result).toBe('a1b2c3d4e5f6789012345678901234567890abcd');
    });

    it('should handle expandShortHash with invalid candidates', () => {
      const candidates = [
        'invalid1',
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'invalid2',
      ];
      const shortHash = 'a1b2c3d';

      const result = expandShortHash(shortHash, candidates);
      expect(result).toBe('a1b2c3d4e5f6789012345678901234567890abcd');
    });

    it('should handle detectHashCollision with multiple duplicates', () => {
      const hashes = generateHashArrayWithDuplicates();
      const collision = detectHashCollision(hashes);
      expect(collision).toEqual([VALID_HASHES.sha1_1, VALID_HASHES.sha1_1]);
    });

    it('should handle removeDuplicateHashes with all duplicates', () => {
      const hashes = [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'a1b2c3d4e5f6789012345678901234567890abcd',
      ];

      const unique = removeDuplicateHashes(hashes);
      expect(unique).toEqual(['a1b2c3d4e5f6789012345678901234567890abcd']);
    });

    it('should handle sortHashes with mixed case', () => {
      const hashes = [
        'C3D4E5F6789012345678901234567890ABCDEF12',
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'B2C3D4E5F6789012345678901234567890ABCDE1',
      ];

      const sorted = sortHashes(hashes);
      expect(sorted).toEqual([
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'B2C3D4E5F6789012345678901234567890ABCDE1',
        'C3D4E5F6789012345678901234567890ABCDEF12',
      ]);
    });
  });
});
