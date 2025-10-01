/**
 * src/core/hash/utils/expand.ts のテスト
 */

import { expandShortHash } from '@/core/hash/utils/expand';
import { describe, expect, it } from 'vitest';

describe('Hash Expansion', () => {
  describe('expandShortHash', () => {
    it('should return null for invalid short hash', () => {
      const shortHash = 'invalid';
      const candidates = ['a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBeNull();
    });

    it('should return null for empty short hash', () => {
      const shortHash = '';
      const candidates = ['a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBeNull();
    });

    it('should return null for empty candidates', () => {
      const shortHash = 'a94a8fe5';
      const candidates: string[] = [];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBeNull();
    });

    it('should expand valid short hash', () => {
      const shortHash = 'a94a8fe5';
      const candidates = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
    });

    it('should handle case insensitive matching', () => {
      const shortHash = 'A94A8FE5';
      const candidates = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
    });

    it('should return first match', () => {
      const shortHash = 'a94a8fe5';
      const candidates = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
    });

    it('should ignore invalid candidates', () => {
      const shortHash = 'a94a8fe5';
      const candidates = [
        'invalid',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'short',
      ];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
    });

    it('should return null when no match found', () => {
      const shortHash = 'a94a8fe5';
      const candidates = [
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        '7c211433f02071597741e6ff5a8ea34789abbf43',
      ];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBeNull();
    });

    it('should handle partial matches', () => {
      const shortHash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const candidates = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
    });

    it('should handle mixed case short hash', () => {
      const shortHash = 'AaF4C61D';
      const candidates = [
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      ];
      const result = expandShortHash(shortHash, candidates);

      expect(result).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    });
  });
});
