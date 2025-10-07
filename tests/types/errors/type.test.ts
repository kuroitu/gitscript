/**
 * src/types/errors/type.ts のテスト
 */

import { TypeError } from '@/types/errors/type';
import { describe, expect, it } from 'vitest';

describe('TypeError', () => {
  describe('constructor', () => {
    it('should create TypeError with expected type and actual value', () => {
      const error = new TypeError('string', 123);

      expect(error).toBeInstanceOf(TypeError);
      expect(error.name).toBe('TypeError');
      expect(error.message).toBe('Expected string, but got number');
      expect(error.code).toBe('TYPE_ERROR');
    });

    it('should create TypeError with parameter name', () => {
      const error = new TypeError('string', 123, 'username');

      expect(error).toBeInstanceOf(TypeError);
      expect(error.name).toBe('TypeError');
      expect(error.message).toBe(
        "Expected string for parameter 'username', but got number",
      );
      expect(error.code).toBe('TYPE_ERROR');
    });

    it('should handle undefined actual value', () => {
      const error = new TypeError('string', undefined);

      expect(error.message).toBe('Expected string, but got undefined');
    });

    it('should handle null actual value', () => {
      const error = new TypeError('string', null);

      expect(error.message).toBe('Expected string, but got object');
    });

    it('should handle object actual value', () => {
      const error = new TypeError('string', {});

      expect(error.message).toBe('Expected string, but got object');
    });

    it('should handle array actual value', () => {
      const error = new TypeError('string', []);

      expect(error.message).toBe('Expected string, but got object');
    });

    it('should handle function actual value', () => {
      const error = new TypeError('string', () => {});

      expect(error.message).toBe('Expected string, but got function');
    });

    it('should handle boolean actual value', () => {
      const error = new TypeError('string', true);

      expect(error.message).toBe('Expected string, but got boolean');
    });

    it('should handle symbol actual value', () => {
      const error = new TypeError('string', Symbol('test'));

      expect(error.message).toBe('Expected string, but got symbol');
    });

    it('should handle bigint actual value', () => {
      const error = new TypeError('string', BigInt(123));

      expect(error.message).toBe('Expected string, but got bigint');
    });
  });

  describe('inheritance', () => {
    it('should inherit from GitScriptError', () => {
      const error = new TypeError('string', 123);

      expect(error).toBeInstanceOf(Error);
      expect(error.stack).toBeDefined();
    });
  });

  describe('error properties', () => {
    it('should have correct error properties', () => {
      const error = new TypeError('number', 'invalid', 'count');

      expect(error.name).toBe('TypeError');
      expect(error.message).toBe(
        "Expected number for parameter 'count', but got string",
      );
      expect(error.code).toBe('TYPE_ERROR');
      expect(typeof error.stack).toBe('string');
    });
  });
});
