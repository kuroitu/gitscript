/**
 * src/core/hash/validate/verify.ts のテスト
 */

import {
  verifyHashIntegrity,
  verifyObjectHashIntegrity,
} from '@/core/hash/validate/verify';
import { describe, expect, it } from 'vitest';

describe('Hash Verification', () => {
  describe('verifyHashIntegrity', () => {
    it('should return true for valid hash and content', () => {
      const content = 'hello world';
      const hash = '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed';
      const result = verifyHashIntegrity(hash, content);

      expect(result).toBe(true);
    });

    it('should return false for invalid hash', () => {
      const content = 'hello world';
      const hash = 'invalid';
      const result = verifyHashIntegrity(hash, content);

      expect(result).toBe(false);
    });

    it('should return false for mismatched hash', () => {
      const content = 'hello world';
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = verifyHashIntegrity(hash, content);

      expect(result).toBe(false);
    });

    it('should handle case insensitive comparison', () => {
      const content = 'hello world';
      const hash = '2AAE6C35C94FCFB415DBE95F408B9CE91EE846ED';
      const result = verifyHashIntegrity(hash, content);

      expect(result).toBe(true);
    });

    it('should handle empty content', () => {
      const content = '';
      const hash = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
      const result = verifyHashIntegrity(hash, content);

      expect(result).toBe(true);
    });

    it('should handle special characters', () => {
      const content = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = '5d41402abc4b2a76b9719d911017c592';
      const result = verifyHashIntegrity(hash, content);

      expect(result).toBe(false); // This will be false because we're using SHA-1, not MD5
    });
  });

  describe('verifyObjectHashIntegrity', () => {
    it('should return true for valid hash and object', () => {
      const obj = { name: 'Alice', age: 30 };
      const hash = 'd4541e2f3fbb358c731b422625b735e8a8bb2782';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(true);
    });

    it('should return false for invalid hash', () => {
      const obj = { name: 'Alice', age: 30 };
      const hash = 'invalid';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(false);
    });

    it('should return false for non-object content', () => {
      const obj = 'not an object';
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(false);
    });

    it('should return false for null content', () => {
      const obj = null;
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(false);
    });

    it('should return false for undefined content', () => {
      const obj = undefined;
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(false);
    });

    it('should handle case insensitive comparison', () => {
      const obj = { name: 'Alice', age: 30 };
      const hash = 'D4541E2F3FBB358C731B422625B735E8A8BB2782';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(true);
    });

    it('should handle empty object', () => {
      const obj = {};
      const hash = 'bf21a9e8fbc5a3846fb05b4fa0859e0917b2202f';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(true);
    });

    it('should handle nested object', () => {
      const obj = {
        user: {
          name: 'Alice',
          profile: {
            age: 30,
            city: 'Tokyo',
          },
        },
      };
      const hash = '48a93bcda5916837e3dd0b042faa4ad42b99c8c7';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(true);
    });

    it('should handle array in object', () => {
      const obj = {
        name: 'Alice',
        hobbies: ['reading', 'swimming', 'cooking'],
      };
      const hash = '37354bd49c3bda371fdc9cfcbcc9e3afcff72afd';
      const result = verifyObjectHashIntegrity(hash, obj);

      expect(result).toBe(true);
    });
  });
});
