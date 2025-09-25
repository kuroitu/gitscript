/**
 * Errors のテスト
 */

import { CryptoError } from '@/core/crypto/CryptoProvider';
import { SerializationError } from '@/core/serialization/json-provider';
import {
  ArgumentError,
  DataTypeDetectionError,
  GitScriptError,
  ObjectNotFoundError,
  RepositoryNotFoundError,
} from '@/types/errors';
import { describe, expect, it } from 'vitest';

describe('Error Classes', () => {
  describe('GitScriptError', () => {
    it('should create error with message and code', () => {
      const error = new GitScriptError('Test error', 'TEST_ERROR');

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('GitScriptError');
      expect(error instanceof Error).toBe(true);
    });

    it('should create error with cause', () => {
      const originalError = new Error('Original error');
      const error = new GitScriptError(
        'Test error',
        'TEST_ERROR',
        originalError,
      );

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.cause).toBe(originalError);
    });

    it('should create error without cause', () => {
      const error = new GitScriptError('Test error', 'TEST_ERROR');

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.cause).toBeUndefined();
    });
  });

  describe('ArgumentError', () => {
    it('should create argument error with message', () => {
      const error = new ArgumentError('Invalid argument');

      expect(error.message).toContain('Invalid argument');
      expect(error.code).toBe('ARGUMENT_ERROR');
      expect(error.name).toBe('ArgumentError');
      expect(error instanceof GitScriptError).toBe(true);
    });

    it('should create argument error with cause', () => {
      const originalError = new Error('Original error');
      const error = new ArgumentError('Invalid argument', originalError);

      expect(error.message).toContain('Invalid argument');
      expect(error.code).toBe('ARGUMENT_ERROR');
      expect(error.cause).toBe(originalError);
    });

    it('should create argument error without cause', () => {
      const error = new ArgumentError('Invalid argument');

      expect(error.message).toContain('Invalid argument');
      expect(error.code).toBe('ARGUMENT_ERROR');
      expect(error.cause).toBeUndefined();
    });
  });

  describe('CryptoError', () => {
    it('should create crypto error with message', () => {
      const error = new CryptoError('Crypto operation failed');

      expect(error.message).toContain('Crypto operation failed');
      expect(error.code).toBe('CRYPTO_ERROR');
      expect(error.name).toBe('CryptoError');
      expect(error instanceof GitScriptError).toBe(true);
    });

    it('should create crypto error with cause', () => {
      const originalError = new Error('Original error');
      const error = new CryptoError('Crypto operation failed', originalError);

      expect(error.message).toContain('Crypto operation failed');
      expect(error.code).toBe('CRYPTO_ERROR');
      expect(error.cause).toBe(originalError);
    });

    it('should create crypto error without cause', () => {
      const error = new CryptoError('Crypto operation failed');

      expect(error.message).toContain('Crypto operation failed');
      expect(error.code).toBe('CRYPTO_ERROR');
      expect(error.cause).toBeUndefined();
    });
  });

  describe('SerializationError', () => {
    it('should create serialization error with message', () => {
      const error = new SerializationError('Serialization failed');

      expect(error.message).toContain('Serialization failed');
      expect(error.code).toBe('SERIALIZATION_ERROR');
      expect(error.name).toBe('SerializationError');
      expect(error instanceof GitScriptError).toBe(true);
    });

    it('should create serialization error with cause', () => {
      const originalError = new Error('Original error');
      const error = new SerializationError(
        'Serialization failed',
        originalError,
      );

      expect(error.message).toContain('Serialization failed');
      expect(error.code).toBe('SERIALIZATION_ERROR');
      expect(error.cause).toBe(originalError);
    });

    it('should create serialization error without cause', () => {
      const error = new SerializationError('Serialization failed');

      expect(error.message).toContain('Serialization failed');
      expect(error.code).toBe('SERIALIZATION_ERROR');
      expect(error.cause).toBeUndefined();
    });
  });

  describe('DataTypeDetectionError', () => {
    it('should create data type detection error with message', () => {
      const error = new DataTypeDetectionError('Type detection failed');

      expect(error.message).toContain('Type detection failed');
      expect(error.code).toBe('DATA_TYPE_DETECTION_ERROR');
      expect(error.name).toBe('DataTypeDetectionError');
      expect(error instanceof GitScriptError).toBe(true);
    });

    it('should create data type detection error with cause', () => {
      const originalError = new Error('Original error');
      const error = new DataTypeDetectionError(
        'Type detection failed',
        originalError,
      );

      expect(error.message).toContain('Type detection failed');
      expect(error.message).toContain('Original error');
      expect(error.code).toBe('DATA_TYPE_DETECTION_ERROR');
      expect(error.cause).toBe(originalError);
    });

    it('should create data type detection error without cause', () => {
      const error = new DataTypeDetectionError('Type detection failed');

      expect(error.message).toContain('Type detection failed');
      expect(error.code).toBe('DATA_TYPE_DETECTION_ERROR');
      expect(error.cause).toBeUndefined();
    });
  });

  describe('Error inheritance', () => {
    it('should maintain proper inheritance chain', () => {
      const argumentError = new ArgumentError('test');
      const cryptoError = new CryptoError('test');
      const serializationError = new SerializationError('test');
      const dataTypeDetectionError = new DataTypeDetectionError('test');

      expect(argumentError instanceof GitScriptError).toBe(true);
      expect(cryptoError instanceof GitScriptError).toBe(true);
      expect(serializationError instanceof GitScriptError).toBe(true);
      expect(dataTypeDetectionError instanceof GitScriptError).toBe(true);

      expect(argumentError instanceof Error).toBe(true);
      expect(cryptoError instanceof Error).toBe(true);
      expect(serializationError instanceof Error).toBe(true);
      expect(dataTypeDetectionError instanceof Error).toBe(true);
    });
  });

  describe('Error message formatting', () => {
    it('should format error messages correctly', () => {
      const argumentError = new ArgumentError('Invalid input');
      const cryptoError = new CryptoError('Hash calculation failed');
      const serializationError = new SerializationError('JSON parsing failed');
      const dataTypeDetectionError = new DataTypeDetectionError('Unknown type');

      expect(argumentError.message).toBe('Invalid input');
      expect(cryptoError.message).toBe('Crypto error: Hash calculation failed');
      expect(serializationError.message).toBe(
        'Serialization error: JSON parsing failed',
      );
      expect(dataTypeDetectionError.message).toBe(
        'Failed to detect data type: Unknown type',
      );
    });

    it('should format error messages with cause correctly', () => {
      const originalError = new Error('Original error message');

      const argumentError = new ArgumentError('Invalid input', originalError);
      const cryptoError = new CryptoError(
        'Hash calculation failed',
        originalError,
      );
      const serializationError = new SerializationError(
        'JSON parsing failed',
        originalError,
      );
      const dataTypeDetectionError = new DataTypeDetectionError(
        'Unknown type',
        originalError,
      );

      expect(argumentError.message).toBe('Invalid input');
      expect(cryptoError.message).toBe('Crypto error: Hash calculation failed');
      expect(serializationError.message).toBe(
        'Serialization error: JSON parsing failed',
      );
      expect(dataTypeDetectionError.message).toBe(
        'Failed to detect data type: Unknown type (Original error message)',
      );
    });
  });

  describe('RepositoryNotFoundError', () => {
    it('should create repository not found error', () => {
      const error = new RepositoryNotFoundError('/path/to/repo');

      expect(error.message).toBe('Repository not found at: /path/to/repo');
      expect(error.code).toBe('REPOSITORY_NOT_FOUND');
      expect(error.name).toBe('RepositoryNotFoundError');
    });
  });

  describe('ObjectNotFoundError', () => {
    it('should create object not found error', () => {
      const error = new ObjectNotFoundError('abc123');

      expect(error.message).toBe('Object not found: abc123');
      expect(error.code).toBe('OBJECT_NOT_FOUND');
      expect(error.name).toBe('ObjectNotFoundError');
    });
  });
});
