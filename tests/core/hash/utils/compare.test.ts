/**
 * src/core/hash/utils/compare.ts のテスト
 */

import { InvalidHashError } from '@/core/hash/errors';
import { compareHashes } from '@/core/hash/utils/compare';
import { describe, expect, it } from 'vitest';

describe('Hash Comparison', () => {
  describe('compareHashes', () => {
    it('should return true for identical hashes', () => {
      const hash1 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const hash2 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

      expect(compareHashes(hash1, hash2)).toBe(true);
    });

    it('should return true for case insensitive identical hashes', () => {
      const hash1 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const hash2 = 'A94A8FE5CCB19BA61C4C0873D391E987982FBBD3';

      expect(compareHashes(hash1, hash2)).toBe(true);
    });

    it('should return false for different hashes', () => {
      const hash1 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const hash2 = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';

      expect(compareHashes(hash1, hash2)).toBe(false);
    });

    it('should throw error for invalid first hash', () => {
      const hash1 = 'invalid';
      const hash2 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

      expect(() => compareHashes(hash1, hash2)).toThrow(InvalidHashError);
    });

    it('should throw error for invalid second hash', () => {
      const hash1 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const hash2 = 'invalid';

      expect(() => compareHashes(hash1, hash2)).toThrow(InvalidHashError);
    });

    it('should throw error for both invalid hashes', () => {
      const hash1 = 'invalid1';
      const hash2 = 'invalid2';

      expect(() => compareHashes(hash1, hash2)).toThrow(InvalidHashError);
    });

    it('should handle empty strings', () => {
      const hash1 = '';
      const hash2 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

      expect(() => compareHashes(hash1, hash2)).toThrow(InvalidHashError);
    });

    it('should handle mixed case comparison', () => {
      const hash1 = 'AaF4C61DdCc5E8A2DaBeDe0F3B482Cd9AeA9434D';
      const hash2 = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';

      expect(compareHashes(hash1, hash2)).toBe(true);
    });
  });
});
