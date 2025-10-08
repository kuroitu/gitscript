/**
 * src/core/hash/utils/index.ts のテスト
 */

import * as HashUtils from '@/core/hash/utils';
import { describe, expect, it } from 'vitest';

describe('Hash Utils Module', () => {
  describe('exports', () => {
    it('should export array utility functions', () => {
      expect(HashUtils.sortHashes).toBeDefined();
      expect(HashUtils.removeDuplicateHashes).toBeDefined();
      expect(HashUtils.findHashIndex).toBeDefined();
      expect(typeof HashUtils.sortHashes).toBe('function');
      expect(typeof HashUtils.removeDuplicateHashes).toBe('function');
      expect(typeof HashUtils.findHashIndex).toBe('function');
    });

    it('should export compare functions', () => {
      expect(HashUtils.compareHashes).toBeDefined();
      expect(typeof HashUtils.compareHashes).toBe('function');
    });

    it('should export collision detection functions', () => {
      expect(HashUtils.detectHashCollision).toBeDefined();
      expect(typeof HashUtils.detectHashCollision).toBe('function');
    });

    it('should export expand functions', () => {
      expect(HashUtils.expandShortHash).toBeDefined();
      expect(typeof HashUtils.expandShortHash).toBe('function');
    });

    it('should export shorten functions', () => {
      expect(HashUtils.shortenHash).toBeDefined();
      expect(typeof HashUtils.shortenHash).toBe('function');
    });
  });

  describe('functionality', () => {
    it('should work with array utility functions', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const sorted = HashUtils.sortHashes(hashes);
      expect(Array.isArray(sorted)).toBe(true);
      expect(sorted.length).toBe(2);
    });

    it('should work with compare functions', () => {
      const hash1 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const hash2 = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = HashUtils.compareHashes(hash1, hash2);
      expect(typeof result).toBe('boolean');
    });

    it('should work with collision detection functions', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const result = HashUtils.detectHashCollision(hashes);
      expect(result === null || Array.isArray(result)).toBe(true);
    });

    it('should work with expand functions', () => {
      const shortHash = 'a94a8fe';
      const candidates = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const result = HashUtils.expandShortHash(shortHash, candidates);
      expect(typeof result).toBe('string');
    });

    it('should work with shorten functions', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = HashUtils.shortenHash(hash);
      expect(typeof result).toBe('string');
      expect(result.length).toBeLessThanOrEqual(hash.length);
    });
  });
});
