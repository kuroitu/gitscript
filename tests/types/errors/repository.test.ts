/**
 * src/types/errors/repository.ts のテスト
 */

import { RepositoryNotFoundError } from '@/types/errors/repository';
import { describe, expect, it } from 'vitest';

describe('Repository Error', () => {
  describe('RepositoryNotFoundError', () => {
    it('should create error with path', () => {
      const path = '/path/to/repository';
      const error = new RepositoryNotFoundError(path);

      expect(error).toBeInstanceOf(RepositoryNotFoundError);
      expect(error.message).toBe(`Repository not found at: ${path}`);
      expect(error.code).toBe('REPOSITORY_NOT_FOUND');
      expect(error.name).toBe('RepositoryNotFoundError');
    });

    it('should inherit from GitScriptError', () => {
      const error = new RepositoryNotFoundError('/test/path');

      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('RepositoryNotFoundError');
    });

    it('should handle empty path', () => {
      const error = new RepositoryNotFoundError('');

      expect(error.message).toBe('Repository not found at: ');
      expect(error.code).toBe('REPOSITORY_NOT_FOUND');
    });
  });
});
