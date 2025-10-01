/**
 * src/types/errors/object.ts のテスト
 */

import { ObjectNotFoundError } from '@/types/errors/object';
import { describe, expect, it } from 'vitest';

describe('Object Error', () => {
  describe('ObjectNotFoundError', () => {
    it('should create error with hash', () => {
      const hash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';
      const error = new ObjectNotFoundError(hash);

      expect(error).toBeInstanceOf(ObjectNotFoundError);
      expect(error.message).toBe(`Object not found: ${hash}`);
      expect(error.code).toBe('OBJECT_NOT_FOUND');
      expect(error.name).toBe('ObjectNotFoundError');
    });

    it('should inherit from GitScriptError', () => {
      const error = new ObjectNotFoundError('test-hash');

      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('ObjectNotFoundError');
    });

    it('should handle empty hash', () => {
      const error = new ObjectNotFoundError('');

      expect(error.message).toBe('Object not found: ');
      expect(error.code).toBe('OBJECT_NOT_FOUND');
    });
  });
});
