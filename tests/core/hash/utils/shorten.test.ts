/**
 * src/core/hash/utils/shorten.ts のテスト
 */

import { InvalidHashError } from '@/core/hash/errors';
import { shortenHash } from '@/core/hash/utils/shorten';
import { describe, expect, it } from 'vitest';

describe('Hash Shortening', () => {
  describe('shortenHash', () => {
    it('should shorten hash to default length', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = shortenHash(hash);

      expect(result).toBe('a94a8fe');
    });

    it('should shorten hash to custom length', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = shortenHash(hash, 10);

      expect(result).toBe('a94a8fe5cc');
    });

    it('should shorten hash to minimum length', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = shortenHash(hash, 4);

      expect(result).toBe('a94a');
    });

    it('should shorten hash to maximum length', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = shortenHash(hash, 40);

      expect(result).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
    });

    it('should handle uppercase hash', () => {
      const hash = 'A94A8FE5CCB19BA61C4C0873D391E987982FBBD3';
      const result = shortenHash(hash, 8);

      expect(result).toBe('A94A8FE5');
    });

    it('should handle mixed case hash', () => {
      const hash = 'AaF4C61DdCc5E8A2DaBeDe0F3B482Cd9AeA9434D';
      const result = shortenHash(hash, 8);

      expect(result).toBe('AaF4C61D');
    });

    it('should throw error for invalid hash', () => {
      const hash = 'invalid';

      expect(() => shortenHash(hash)).toThrow(InvalidHashError);
    });

    it('should throw error for empty hash', () => {
      const hash = '';

      expect(() => shortenHash(hash)).toThrow(InvalidHashError);
    });

    it('should throw error for too short length', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

      expect(() => shortenHash(hash, 3)).toThrow();
    });

    it('should throw error for too long length', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

      expect(() => shortenHash(hash, 41)).toThrow();
    });

    it('should handle edge case length 4', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = shortenHash(hash, 4);

      expect(result).toBe('a94a');
    });

    it('should handle edge case length 40', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = shortenHash(hash, 40);

      expect(result).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
    });
  });
});
