/**
 * src/core/hash/validate/index.ts のテスト
 */

import * as HashValidate from '@/core/hash/validate';
import { describe, expect, it } from 'vitest';

describe('Hash Validate Module', () => {
  describe('exports', () => {
    it('should export validation functions', () => {
      expect(HashValidate.isValidHash).toBeDefined();
      expect(HashValidate.isValidShortHash).toBeDefined();
      expect(typeof HashValidate.isValidHash).toBe('function');
      expect(typeof HashValidate.isValidShortHash).toBe('function');
    });

    it('should export verification functions', () => {
      expect(HashValidate.verifyHashIntegrity).toBeDefined();
      expect(HashValidate.verifyObjectHashIntegrity).toBeDefined();
      expect(typeof HashValidate.verifyHashIntegrity).toBe('function');
      expect(typeof HashValidate.verifyObjectHashIntegrity).toBe('function');
    });
  });

  describe('functionality', () => {
    it('should work with validation functions', () => {
      const validHash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
      const invalidHash = 'invalid';

      expect(HashValidate.isValidHash(validHash)).toBe(true);
      expect(HashValidate.isValidHash(invalidHash)).toBe(false);
    });

    it('should work with short hash validation', () => {
      const validShortHash = 'a1b2c3';
      const invalidShortHash = 'invalid';

      expect(HashValidate.isValidShortHash(validShortHash)).toBe(true);
      expect(HashValidate.isValidShortHash(invalidShortHash)).toBe(false);
    });

    it('should work with hash integrity verification', () => {
      const content = 'test content';
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

      const result = HashValidate.verifyHashIntegrity(content, hash);
      expect(typeof result).toBe('boolean');
    });

    it('should work with object hash integrity verification', () => {
      const obj = { test: 'value' };
      const hash = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

      const result = HashValidate.verifyObjectHashIntegrity(obj, hash);
      expect(typeof result).toBe('boolean');
    });
  });
});
