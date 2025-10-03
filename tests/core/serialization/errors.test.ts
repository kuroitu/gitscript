/**
 * src/core/serialization/errors.ts のテスト
 */

import { SerializationError } from '@/core/serialization/errors';
import { describe, expect, it } from 'vitest';

describe('Serialization Errors', () => {
  describe('SerializationError', () => {
    it('should create error with message only', () => {
      const error = new SerializationError('Test serialization error');

      expect(error).toBeInstanceOf(SerializationError);
      expect(error.message).toBe(
        'Serialization error: Test serialization error',
      );
      expect(error.code).toBe('SERIALIZATION_ERROR');
      expect(error.name).toBe('SerializationError');
    });

    it('should create error with message and cause', () => {
      const cause = new Error('Original error');
      const error = new SerializationError('Test serialization error', cause);

      expect(error).toBeInstanceOf(SerializationError);
      expect(error.message).toBe(
        'Serialization error: Test serialization error',
      );
      expect(error.code).toBe('SERIALIZATION_ERROR');
      expect(error.name).toBe('SerializationError');
      expect(error.cause).toBe(cause);
    });

    it('should inherit from GitScriptError', () => {
      const error = new SerializationError('Test serialization error');

      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('SerializationError');
    });

    it('should handle empty message', () => {
      const error = new SerializationError('');

      expect(error.message).toBe('Serialization error: ');
      expect(error.code).toBe('SERIALIZATION_ERROR');
    });

    it('should handle undefined cause', () => {
      const error = new SerializationError(
        'Test serialization error',
        undefined,
      );

      expect(error.message).toBe(
        'Serialization error: Test serialization error',
      );
      expect(error.code).toBe('SERIALIZATION_ERROR');
    });

    it('should handle null cause', () => {
      const error = new SerializationError(
        'Test serialization error',
        null as any,
      );

      expect(error.message).toBe(
        'Serialization error: Test serialization error',
      );
      expect(error.code).toBe('SERIALIZATION_ERROR');
    });
  });
});
