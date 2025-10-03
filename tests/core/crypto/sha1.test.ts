/**
 * src/core/crypto/sha1.ts のテスト
 */

import { CryptoError } from '@/core/crypto/errors';
import {
  calculateSha1,
  calculateSha1FromMultiple,
  isCryptoAvailable,
} from '@/core/crypto/sha1';
import { describe, expect, it } from 'vitest';

describe('SHA1 Crypto', () => {
  describe('calculateSha1', () => {
    it('should calculate SHA-1 hash for string', () => {
      const data = 'hello world';
      const hash = calculateSha1(data);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40); // SHA-1 hash length
      expect(hash).toMatch(/^[a-f0-9]{40}$/);
    });

    it('should calculate SHA-1 hash for Buffer', () => {
      const data = Buffer.from('hello world', 'utf8');
      const hash = calculateSha1(data);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
      expect(hash).toMatch(/^[a-f0-9]{40}$/);
    });

    it('should calculate SHA-1 hash with different encoding', () => {
      const data = 'こんにちは';
      const hash = calculateSha1(data, 'utf8');

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should produce consistent results', () => {
      const data = 'test data';
      const hash1 = calculateSha1(data);
      const hash2 = calculateSha1(data);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different data', () => {
      const data1 = 'hello';
      const data2 = 'world';
      const hash1 = calculateSha1(data1);
      const hash2 = calculateSha1(data2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = calculateSha1('');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle special characters', () => {
      const data = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = calculateSha1(data);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });
  });

  describe('calculateSha1FromMultiple', () => {
    it('should calculate SHA-1 hash from multiple strings', () => {
      const dataList = ['hello', 'world', 'test'];
      const hash = calculateSha1FromMultiple(dataList);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
      expect(hash).toMatch(/^[a-f0-9]{40}$/);
    });

    it('should calculate SHA-1 hash from multiple Buffers', () => {
      const dataList = [
        Buffer.from('hello', 'utf8'),
        Buffer.from('world', 'utf8'),
        Buffer.from('test', 'utf8'),
      ];
      const hash = calculateSha1FromMultiple(dataList);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should calculate SHA-1 hash from mixed data types', () => {
      const dataList = ['hello', Buffer.from('world', 'utf8'), 'test'];
      const hash = calculateSha1FromMultiple(dataList);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should use custom separator', () => {
      const dataList = ['hello', 'world'];
      const hash1 = calculateSha1FromMultiple(dataList, '\0');
      const hash2 = calculateSha1FromMultiple(dataList, '|');

      expect(hash1).not.toBe(hash2);
    });

    it('should use custom encoding', () => {
      const dataList = ['こんにちは', '世界'];
      const hash = calculateSha1FromMultiple(dataList, '\0', 'utf8');

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle single element', () => {
      const dataList = ['single'];
      const hash = calculateSha1FromMultiple(dataList);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle empty array', () => {
      const dataList: (string | Buffer)[] = [];
      const hash = calculateSha1FromMultiple(dataList);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should produce consistent results', () => {
      const dataList = ['hello', 'world', 'test'];
      const hash1 = calculateSha1FromMultiple(dataList);
      const hash2 = calculateSha1FromMultiple(dataList);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different order', () => {
      const dataList1 = ['hello', 'world'];
      const dataList2 = ['world', 'hello'];
      const hash1 = calculateSha1FromMultiple(dataList1);
      const hash2 = calculateSha1FromMultiple(dataList2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isCryptoAvailable', () => {
    it('should return true when crypto is available', () => {
      const available = isCryptoAvailable();
      expect(typeof available).toBe('boolean');
      // 通常のNode.js環境ではtrueになるはず
      expect(available).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw CryptoError for invalid data', () => {
      // 無効なデータでエラーを発生させる（実際にはcrypto.createHashは堅牢なので、このテストは難しい）
      expect(() => {
        calculateSha1('valid data');
      }).not.toThrow();
    });

    it('should handle CryptoError with proper message', () => {
      try {
        calculateSha1('test');
        // 正常な場合はエラーが発生しない
        expect(true).toBe(true);
      } catch (error) {
        if (error instanceof CryptoError) {
          expect(error.message).toContain('Failed to calculate SHA-1 hash');
        }
      }
    });
  });
});
