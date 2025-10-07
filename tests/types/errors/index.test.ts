/**
 * src/types/errors/index.ts のテスト
 */

import * as Errors from '@/types/errors';
import { describe, expect, it } from 'vitest';

describe('Types Errors Module', () => {
  describe('exports', () => {
    it('should export ArgumentError', () => {
      expect(Errors.ArgumentError).toBeDefined();
      expect(typeof Errors.ArgumentError).toBe('function');
    });

    it('should export GitScriptError', () => {
      expect(Errors.GitScriptError).toBeDefined();
      expect(typeof Errors.GitScriptError).toBe('function');
    });

    it('should export CommitNotFoundError', () => {
      expect(Errors.CommitNotFoundError).toBeDefined();
      expect(typeof Errors.CommitNotFoundError).toBe('function');
    });

    it('should export ObjectNotFoundError', () => {
      expect(Errors.ObjectNotFoundError).toBeDefined();
      expect(typeof Errors.ObjectNotFoundError).toBe('function');
    });

    it('should export RepositoryNotFoundError', () => {
      expect(Errors.RepositoryNotFoundError).toBeDefined();
      expect(typeof Errors.RepositoryNotFoundError).toBe('function');
    });

    it('should export StagingAreaError', () => {
      expect(Errors.StagingAreaError).toBeDefined();
      expect(typeof Errors.StagingAreaError).toBe('function');
    });

    it('should export TypeError', () => {
      expect(Errors.TypeError).toBeDefined();
      expect(typeof Errors.TypeError).toBe('function');
    });
  });

  describe('error class instantiation', () => {
    it('should create ArgumentError instance', () => {
      const error = new Errors.ArgumentError('Test argument error');
      expect(error).toBeInstanceOf(Errors.ArgumentError);
      expect(error.message).toBe('Test argument error');
      expect(error.code).toBe('ARGUMENT_ERROR');
    });

    it('should create GitScriptError instance', () => {
      const error = new Errors.GitScriptError('Test base error', 'TEST_CODE');
      expect(error).toBeInstanceOf(Errors.GitScriptError);
      expect(error.message).toBe('Test base error');
      expect(error.code).toBe('TEST_CODE');
    });

    it('should create CommitNotFoundError instance', () => {
      const error = new Errors.CommitNotFoundError('abc123');
      expect(error).toBeInstanceOf(Errors.CommitNotFoundError);
      expect(error.message).toBe('Commit not found: abc123');
    });

    it('should create ObjectNotFoundError instance', () => {
      const error = new Errors.ObjectNotFoundError('def456');
      expect(error).toBeInstanceOf(Errors.ObjectNotFoundError);
      expect(error.message).toBe('Object not found: def456');
    });

    it('should create RepositoryNotFoundError instance', () => {
      const error = new Errors.RepositoryNotFoundError('/path/to/repo');
      expect(error).toBeInstanceOf(Errors.RepositoryNotFoundError);
      expect(error.message).toBe('Repository not found at: /path/to/repo');
    });

    it('should create StagingAreaError instance', () => {
      const error = new Errors.StagingAreaError('Staging area is corrupted');
      expect(error).toBeInstanceOf(Errors.StagingAreaError);
      expect(error.message).toBe('Staging area is corrupted');
    });

    it('should create TypeError instance', () => {
      const error = new Errors.TypeError('string', 123, 'param');
      expect(error).toBeInstanceOf(Errors.TypeError);
      expect(error.message).toBe(
        "Expected string for parameter 'param', but got number",
      );
    });
  });

  describe('error inheritance', () => {
    it('should have correct inheritance chain', () => {
      const argumentError = new Errors.ArgumentError('Test');
      const commitError = new Errors.CommitNotFoundError('abc123');
      const objectError = new Errors.ObjectNotFoundError('def456');
      const repoError = new Errors.RepositoryNotFoundError('/path');
      const stagingError = new Errors.StagingAreaError('Test');
      const typeError = new Errors.TypeError('string', 123);

      // All should inherit from GitScriptError
      expect(argumentError).toBeInstanceOf(Errors.GitScriptError);
      expect(commitError).toBeInstanceOf(Errors.GitScriptError);
      expect(objectError).toBeInstanceOf(Errors.GitScriptError);
      expect(repoError).toBeInstanceOf(Errors.GitScriptError);
      expect(stagingError).toBeInstanceOf(Errors.GitScriptError);
      expect(typeError).toBeInstanceOf(Errors.GitScriptError);

      // All should inherit from Error
      expect(argumentError).toBeInstanceOf(Error);
      expect(commitError).toBeInstanceOf(Error);
      expect(objectError).toBeInstanceOf(Error);
      expect(repoError).toBeInstanceOf(Error);
      expect(stagingError).toBeInstanceOf(Error);
      expect(typeError).toBeInstanceOf(Error);
    });
  });
});
