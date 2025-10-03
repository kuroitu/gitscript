/**
 * src/core/hash/errors.ts のテスト
 */

import { InvalidHashError } from '@/core/hash/errors';
import { describe, expect, it } from 'vitest';

describe('Hash Errors', () => {
  describe('InvalidHashError', () => {
    it('should create error with hash', () => {
      const hash = 'invalid-hash';
      const error = new InvalidHashError(hash);

      expect(error).toBeInstanceOf(InvalidHashError);
      expect(error.message).toBe(`Invalid hash format: ${hash}`);
      expect(error.code).toBe('INVALID_HASH');
      expect(error.name).toBe('InvalidHashError');
    });

    it('should inherit from GitScriptError', () => {
      const error = new InvalidHashError('test-hash');

      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('InvalidHashError');
    });

    it('should handle empty hash', () => {
      const error = new InvalidHashError('');

      expect(error.message).toBe('Invalid hash format: ');
      expect(error.code).toBe('INVALID_HASH');
    });

    it('should handle special characters in hash', () => {
      const hash = '!@#$%^&*()';
      const error = new InvalidHashError(hash);

      expect(error.message).toBe(`Invalid hash format: ${hash}`);
      expect(error.code).toBe('INVALID_HASH');
    });

    it('should handle long hash', () => {
      const hash = 'a'.repeat(100);
      const error = new InvalidHashError(hash);

      expect(error.message).toBe(`Invalid hash format: ${hash}`);
      expect(error.code).toBe('INVALID_HASH');
    });
  });
});
