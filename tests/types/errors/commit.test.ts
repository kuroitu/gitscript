/**
 * src/types/errors/commit.ts のテスト
 */

import { CommitNotFoundError } from '@/types/errors/commit';
import { describe, expect, it } from 'vitest';

describe('Commit Error', () => {
  describe('CommitNotFoundError', () => {
    it('should create error with hash', () => {
      const hash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';
      const error = new CommitNotFoundError(hash);

      expect(error).toBeInstanceOf(CommitNotFoundError);
      expect(error.message).toBe(`Commit not found: ${hash}`);
      expect(error.code).toBe('COMMIT_NOT_FOUND');
      expect(error.name).toBe('CommitNotFoundError');
    });

    it('should inherit from GitScriptError', () => {
      const error = new CommitNotFoundError('test-hash');

      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('CommitNotFoundError');
    });

    it('should handle empty hash', () => {
      const error = new CommitNotFoundError('');

      expect(error.message).toBe('Commit not found: ');
      expect(error.code).toBe('COMMIT_NOT_FOUND');
    });

    it('should handle short hash', () => {
      const hash = 'a1b2c3d4';
      const error = new CommitNotFoundError(hash);

      expect(error.message).toBe(`Commit not found: ${hash}`);
      expect(error.code).toBe('COMMIT_NOT_FOUND');
    });

    it('should handle long hash', () => {
      const hash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6';
      const error = new CommitNotFoundError(hash);

      expect(error.message).toBe(`Commit not found: ${hash}`);
      expect(error.code).toBe('COMMIT_NOT_FOUND');
    });
  });
});
