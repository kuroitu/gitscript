/**
 * src/types/errors/base.ts のテスト
 */

import { GitScriptError } from '@/types/errors/base';
import { describe, expect, it } from 'vitest';

describe('GitScriptError', () => {
  describe('constructor', () => {
    it('should create GitScriptError with message only', () => {
      const error = new GitScriptError('Something went wrong');

      expect(error).toBeInstanceOf(GitScriptError);
      expect(error.name).toBe('GitScriptError');
      expect(error.message).toBe('Something went wrong');
      expect(error.code).toBeUndefined();
      expect(error.cause).toBeUndefined();
    });

    it('should create GitScriptError with message and code', () => {
      const error = new GitScriptError('Something went wrong', 'CUSTOM_ERROR');

      expect(error).toBeInstanceOf(GitScriptError);
      expect(error.name).toBe('GitScriptError');
      expect(error.message).toBe('Something went wrong');
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.cause).toBeUndefined();
    });

    it('should create GitScriptError with message, code, and cause', () => {
      const cause = new Error('Original error');
      const error = new GitScriptError(
        'Something went wrong',
        'CUSTOM_ERROR',
        cause,
      );

      expect(error).toBeInstanceOf(GitScriptError);
      expect(error.name).toBe('GitScriptError');
      expect(error.message).toBe('Something went wrong');
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.cause).toBe(cause);
    });

    it('should handle empty message', () => {
      const error = new GitScriptError('');

      expect(error.message).toBe('');
      expect(error.code).toBeUndefined();
    });

    it('should handle undefined code', () => {
      const error = new GitScriptError('Test message', undefined);

      expect(error.message).toBe('Test message');
      expect(error.code).toBeUndefined();
    });

    it('should handle null cause', () => {
      const error = new GitScriptError(
        'Test message',
        'TEST_ERROR',
        null as any,
      );

      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.cause).toBeNull();
    });
  });

  describe('inheritance', () => {
    it('should inherit from Error', () => {
      const error = new GitScriptError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error.stack).toBeDefined();
    });
  });

  describe('error properties', () => {
    it('should have correct error properties', () => {
      const cause = new Error('Cause error');
      const error = new GitScriptError('Main error', 'MAIN_ERROR', cause);

      expect(error.name).toBe('GitScriptError');
      expect(error.message).toBe('Main error');
      expect(error.code).toBe('MAIN_ERROR');
      expect(error.cause).toBe(cause);
      expect(typeof error.stack).toBe('string');
    });

    it('should have readonly code property', () => {
      const error = new GitScriptError('Test', 'READONLY_CODE');

      // TypeScriptのreadonlyプロパティは実行時には変更可能だが、
      // 設計上は変更すべきではない
      expect(error.code).toBe('READONLY_CODE');
    });

    it('should have readonly cause property', () => {
      const cause = new Error('Original');
      const error = new GitScriptError('Test', 'TEST_CODE', cause);

      expect(error.cause).toBe(cause);
    });
  });

  describe('error scenarios', () => {
    it('should handle network error scenarios', () => {
      const networkError = new Error('Network timeout');
      const error = new GitScriptError(
        'Failed to fetch data',
        'NETWORK_ERROR',
        networkError,
      );

      expect(error.message).toBe('Failed to fetch data');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.cause).toBe(networkError);
    });

    it('should handle validation error scenarios', () => {
      const error = new GitScriptError(
        'Invalid input provided',
        'VALIDATION_ERROR',
      );

      expect(error.message).toBe('Invalid input provided');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle system error scenarios', () => {
      const systemError = new Error('Permission denied');
      const error = new GitScriptError(
        'System operation failed',
        'SYSTEM_ERROR',
        systemError,
      );

      expect(error.message).toBe('System operation failed');
      expect(error.code).toBe('SYSTEM_ERROR');
      expect(error.cause).toBe(systemError);
    });
  });

  describe('error chaining', () => {
    it('should support error chaining', () => {
      const rootCause = new Error('Root cause');
      const intermediateError = new GitScriptError(
        'Intermediate error',
        'INTERMEDIATE',
        rootCause,
      );
      const topLevelError = new GitScriptError(
        'Top level error',
        'TOP_LEVEL',
        intermediateError,
      );

      expect(topLevelError.cause).toBe(intermediateError);
      expect(intermediateError.cause).toBe(rootCause);
    });
  });
});
