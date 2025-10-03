/**
 * src/core/hash/validate/is-valid.ts のテスト
 */

import { isValidHash, isValidShortHash } from '@/core/hash/validate/is-valid';
import { describe, expect, it } from 'vitest';

describe('Hash Validation', () => {
  describe('isValidHash', () => {
    it('should validate correct SHA-1 hash', () => {
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      expect(isValidHash(hash)).toBe(true);
    });

    it('should validate lowercase hash', () => {
      const hash = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';
      expect(isValidHash(hash)).toBe(true);
    });

    it('should validate uppercase hash', () => {
      const hash = 'AAF4C61DDCC5E8A2DABEDE0F3B482CD9AEA9434D';
      expect(isValidHash(hash)).toBe(true);
    });

    it('should validate mixed case hash', () => {
      const hash = 'AaF4C61DdCc5E8A2DaBeDe0F3B482Cd9AeA9434D';
      expect(isValidHash(hash)).toBe(true);
    });

    it('should reject hash that is too short', () => {
      const hash = 'a1b2c3d4e5f6g7h8i9j0';
      expect(isValidHash(hash)).toBe(false);
    });

    it('should reject hash that is too long', () => {
      const hash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1';
      expect(isValidHash(hash)).toBe(false);
    });

    it('should reject hash with invalid characters', () => {
      const hash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t!';
      expect(isValidHash(hash)).toBe(false);
    });

    it('should reject empty string', () => {
      const hash = '';
      expect(isValidHash(hash)).toBe(false);
    });

    it('should reject non-string input', () => {
      expect(isValidHash(null as any)).toBe(false);
      expect(isValidHash(undefined as any)).toBe(false);
      expect(isValidHash(123 as any)).toBe(false);
      expect(isValidHash({} as any)).toBe(false);
    });
  });

  describe('isValidShortHash', () => {
    it('should validate correct short hash', () => {
      const shortHash = 'a1b2c3d4';
      expect(isValidShortHash(shortHash)).toBe(true);
    });

    it('should validate short hash with default parameters', () => {
      const shortHash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      expect(isValidShortHash(shortHash)).toBe(true);
    });

    it('should validate short hash with custom parameters', () => {
      const shortHash = 'a1b2c3d4e5';
      expect(isValidShortHash(shortHash, 5, 10)).toBe(true);
    });

    it('should validate lowercase short hash', () => {
      const shortHash = 'a1b2c3d4';
      expect(isValidShortHash(shortHash)).toBe(true);
    });

    it('should validate uppercase short hash', () => {
      const shortHash = 'A1B2C3D4';
      expect(isValidShortHash(shortHash)).toBe(true);
    });

    it('should validate mixed case short hash', () => {
      const shortHash = 'A1b2C3d4';
      expect(isValidShortHash(shortHash)).toBe(true);
    });

    it('should reject short hash that is too short', () => {
      const shortHash = 'a1b2';
      expect(isValidShortHash(shortHash, 5, 10)).toBe(false);
    });

    it('should reject short hash that is too long', () => {
      const shortHash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1';
      expect(isValidShortHash(shortHash, 5, 10)).toBe(false);
    });

    it('should reject short hash with invalid characters', () => {
      const shortHash = 'a1b2c3d!';
      expect(isValidShortHash(shortHash)).toBe(false);
    });

    it('should reject empty string', () => {
      const shortHash = '';
      expect(isValidShortHash(shortHash)).toBe(false);
    });

    it('should reject non-string input', () => {
      expect(isValidShortHash(null as any)).toBe(false);
      expect(isValidShortHash(undefined as any)).toBe(false);
      expect(isValidShortHash(123 as any)).toBe(false);
      expect(isValidShortHash({} as any)).toBe(false);
    });

    it('should handle edge case with minLength equal to maxLength', () => {
      const shortHash = 'a1b2c3d4';
      expect(isValidShortHash(shortHash, 8, 8)).toBe(true);
    });

    it('should reject when length equals minLength but contains invalid characters', () => {
      const shortHash = 'a1b2c3d!';
      expect(isValidShortHash(shortHash, 8, 8)).toBe(false);
    });
  });
});
