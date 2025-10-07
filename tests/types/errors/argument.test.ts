/**
 * src/types/errors/argument.ts のテスト
 */

import { ArgumentError } from '@/types/errors/argument';
import { describe, expect, it } from 'vitest';

describe('ArgumentError', () => {
  describe('constructor', () => {
    it('should create ArgumentError with message only', () => {
      const error = new ArgumentError('Invalid argument provided');

      expect(error).toBeInstanceOf(ArgumentError);
      expect(error.name).toBe('ArgumentError');
      expect(error.message).toBe('Invalid argument provided');
      expect(error.code).toBe('ARGUMENT_ERROR');
    });

    it('should create ArgumentError with message and cause', () => {
      const cause = new Error('Original error');
      const error = new ArgumentError('Invalid argument provided', cause);

      expect(error).toBeInstanceOf(ArgumentError);
      expect(error.name).toBe('ArgumentError');
      expect(error.message).toBe('Invalid argument provided');
      expect(error.code).toBe('ARGUMENT_ERROR');
      expect(error.cause).toBe(cause);
    });

    it('should handle empty message', () => {
      const error = new ArgumentError('');

      expect(error.message).toBe('');
      expect(error.code).toBe('ARGUMENT_ERROR');
    });

    it('should handle undefined cause', () => {
      const error = new ArgumentError('Test message', undefined);

      expect(error.message).toBe('Test message');
      expect(error.cause).toBeUndefined();
    });

    it('should handle null cause', () => {
      const error = new ArgumentError('Test message', null as any);

      expect(error.message).toBe('Test message');
      expect(error.cause).toBeNull();
    });
  });

  describe('inheritance', () => {
    it('should inherit from GitScriptError', () => {
      const error = new ArgumentError('Test message');

      expect(error).toBeInstanceOf(Error);
      expect(error.stack).toBeDefined();
    });
  });

  describe('error properties', () => {
    it('should have correct error properties', () => {
      const cause = new Error('Cause error');
      const error = new ArgumentError('Argument validation failed', cause);

      expect(error.name).toBe('ArgumentError');
      expect(error.message).toBe('Argument validation failed');
      expect(error.code).toBe('ARGUMENT_ERROR');
      expect(error.cause).toBe(cause);
      expect(typeof error.stack).toBe('string');
    });
  });

  describe('error scenarios', () => {
    it('should handle validation error scenarios', () => {
      const error = new ArgumentError('Value must be greater than 0');

      expect(error.message).toBe('Value must be greater than 0');
      expect(error.code).toBe('ARGUMENT_ERROR');
    });

    it('should handle type validation error scenarios', () => {
      const cause = new TypeError('Expected string, but got number');
      const error = new ArgumentError('Invalid parameter type', cause);

      expect(error.message).toBe('Invalid parameter type');
      expect(error.cause).toBe(cause);
    });

    it('should handle range validation error scenarios', () => {
      const error = new ArgumentError('Index out of range');

      expect(error.message).toBe('Index out of range');
      expect(error.code).toBe('ARGUMENT_ERROR');
    });
  });
});
