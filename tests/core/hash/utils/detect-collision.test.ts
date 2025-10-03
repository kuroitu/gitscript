/**
 * src/core/hash/utils/detect-collision.ts のテスト
 */

import { detectHashCollision } from '@/core/hash/utils/detect-collision';
import { describe, expect, it } from 'vitest';

describe('Hash Collision Detection', () => {
  describe('detectHashCollision', () => {
    it('should return null for empty array', () => {
      const hashes: string[] = [];
      const result = detectHashCollision(hashes);

      expect(result).toBeNull();
    });

    it('should return null for single hash', () => {
      const hashes = ['a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'];
      const result = detectHashCollision(hashes);

      expect(result).toBeNull();
    });

    it('should return null for no collisions', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        '7c211433f02071597741e6ff5a8ea34789abbf43',
      ];
      const result = detectHashCollision(hashes);

      expect(result).toBeNull();
    });

    it('should detect collision for identical hashes', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      ];
      const result = detectHashCollision(hashes);

      expect(result).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      ]);
    });

    it('should detect collision for case insensitive duplicates', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'A94A8FE5CCB19BA61C4C0873D391E987982FBBD3',
      ];
      const result = detectHashCollision(hashes);

      expect(result).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'A94A8FE5CCB19BA61C4C0873D391E987982FBBD3',
      ]);
    });

    it('should ignore invalid hashes', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'invalid',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      ];
      const result = detectHashCollision(hashes);

      expect(result).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      ]);
    });

    it('should return first collision found', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const result = detectHashCollision(hashes);

      expect(result).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      ]);
    });

    it('should handle mixed case collision', () => {
      const hashes = [
        'AaF4C61DdCc5E8A2DaBeDe0F3B482Cd9AeA9434D',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const result = detectHashCollision(hashes);

      expect(result).toEqual([
        'AaF4C61DdCc5E8A2DaBeDe0F3B482Cd9AeA9434D',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ]);
    });
  });
});
