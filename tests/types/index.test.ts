/**
 * src/types/index.ts のテスト
 */

import * as Types from '@/types';
import { describe, expect, it } from 'vitest';

describe('Types Module', () => {
  describe('exports', () => {
    it('should export all error classes', () => {
      expect(Types.ArgumentError).toBeDefined();
      expect(Types.GitScriptError).toBeDefined();
      expect(Types.CommitNotFoundError).toBeDefined();
      expect(Types.ObjectNotFoundError).toBeDefined();
      expect(Types.RepositoryNotFoundError).toBeDefined();
      expect(Types.StagingAreaError).toBeDefined();
      expect(Types.TypeError).toBeDefined();
    });

    it('should export error classes as functions', () => {
      expect(typeof Types.ArgumentError).toBe('function');
      expect(typeof Types.GitScriptError).toBe('function');
      expect(typeof Types.CommitNotFoundError).toBe('function');
      expect(typeof Types.ObjectNotFoundError).toBe('function');
      expect(typeof Types.RepositoryNotFoundError).toBe('function');
      expect(typeof Types.StagingAreaError).toBe('function');
      expect(typeof Types.TypeError).toBe('function');
    });
  });

  describe('error class functionality', () => {
    it('should create and use ArgumentError', () => {
      const error = new Types.ArgumentError('Invalid parameter');
      expect(error.message).toBe('Invalid parameter');
      expect(error.code).toBe('ARGUMENT_ERROR');
      expect(error.name).toBe('ArgumentError');
    });

    it('should create and use GitScriptError', () => {
      const error = new Types.GitScriptError('Base error', 'BASE_ERROR');
      expect(error.message).toBe('Base error');
      expect(error.code).toBe('BASE_ERROR');
      expect(error.name).toBe('GitScriptError');
    });

    it('should create and use CommitNotFoundError', () => {
      const error = new Types.CommitNotFoundError('commit123');
      expect(error.message).toBe('Commit not found: commit123');
      expect(error.name).toBe('CommitNotFoundError');
    });

    it('should create and use ObjectNotFoundError', () => {
      const error = new Types.ObjectNotFoundError('object456');
      expect(error.message).toBe('Object not found: object456');
      expect(error.name).toBe('ObjectNotFoundError');
    });

    it('should create and use RepositoryNotFoundError', () => {
      const error = new Types.RepositoryNotFoundError('/repo/path');
      expect(error.message).toBe('Repository not found at: /repo/path');
      expect(error.name).toBe('RepositoryNotFoundError');
    });

    it('should create and use StagingAreaError', () => {
      const error = new Types.StagingAreaError('Staging issue');
      expect(error.message).toBe('Staging issue');
      expect(error.name).toBe('StagingAreaError');
    });

    it('should create and use TypeError', () => {
      const error = new Types.TypeError('string', 123, 'value');
      expect(error.message).toBe(
        "Expected string for parameter 'value', but got number",
      );
      expect(error.name).toBe('TypeError');
      expect(error.code).toBe('TYPE_ERROR');
    });
  });

  describe('module structure', () => {
    it('should have consistent error class structure', () => {
      const errors = [
        new Types.ArgumentError('Test'),
        new Types.GitScriptError('Test', 'TEST'),
        new Types.CommitNotFoundError('test'),
        new Types.ObjectNotFoundError('test'),
        new Types.RepositoryNotFoundError('test'),
        new Types.StagingAreaError('Test'),
        new Types.TypeError('string', 123),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(Types.GitScriptError);
        expect(typeof error.message).toBe('string');
        expect(typeof error.name).toBe('string');
        expect(error.stack).toBeDefined();
      });
    });
  });
});
