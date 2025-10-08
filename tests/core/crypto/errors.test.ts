/**
 * src/core/crypto/errors.ts のテスト
 */

import { CryptoError } from '@/core/crypto/errors';
import { describe, expect, it } from 'vitest';

describe('Crypto Errors', () => {
  describe('CryptoError', () => {
    it('should create error with message only', () => {
      const error = new CryptoError('Test crypto error');

      expect(error).toBeInstanceOf(CryptoError);
      expect(error.message).toBe('Crypto error: Test crypto error');
      expect(error.code).toBe('CRYPTO_ERROR');
      expect(error.name).toBe('CryptoError');
    });

    it('should create error with message and cause', () => {
      const cause = new Error('Original error');
      const error = new CryptoError('Test crypto error', cause);

      expect(error).toBeInstanceOf(CryptoError);
      expect(error.message).toBe('Crypto error: Test crypto error');
      expect(error.code).toBe('CRYPTO_ERROR');
      expect(error.name).toBe('CryptoError');
      expect(error.cause).toBe(cause);
    });

    it('should inherit from GitScriptError', () => {
      const error = new CryptoError('Test crypto error');

      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('CryptoError');
    });

    it('should handle empty message', () => {
      const error = new CryptoError('');

      expect(error.message).toBe('Crypto error: ');
      expect(error.code).toBe('CRYPTO_ERROR');
    });

    it('should handle undefined cause', () => {
      const error = new CryptoError('Test crypto error', undefined);

      expect(error.message).toBe('Crypto error: Test crypto error');
      expect(error.code).toBe('CRYPTO_ERROR');
    });

    it('should handle null cause', () => {
      const error = new CryptoError('Test crypto error', null as any);

      expect(error.message).toBe('Crypto error: Test crypto error');
      expect(error.code).toBe('CRYPTO_ERROR');
    });
  });
});
