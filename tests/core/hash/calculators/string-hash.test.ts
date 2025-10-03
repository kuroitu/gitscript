/**
 * src/core/hash/calculators/string-hash.ts のテスト
 */

import {
  calculateHashFromString,
  calculateHashFromStrings,
} from '@/core/hash/calculators/string-hash';
import { describe, expect, it } from 'vitest';

describe('String Hash Calculator', () => {
  describe('calculateHashFromString', () => {
    it('should calculate hash for valid string', () => {
      const content = 'hello world';
      const hash = calculateHashFromString(content);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
      expect(hash).toMatch(/^[a-f0-9]{40}$/);
    });

    it('should produce consistent results', () => {
      const content = 'test data';
      const hash1 = calculateHashFromString(content);
      const hash2 = calculateHashFromString(content);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different strings', () => {
      const content1 = 'hello';
      const content2 = 'world';
      const hash1 = calculateHashFromString(content1);
      const hash2 = calculateHashFromString(content2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = calculateHashFromString('');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle special characters', () => {
      const content = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = calculateHashFromString(content);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle unicode characters', () => {
      const content = 'こんにちは世界';
      const hash = calculateHashFromString(content);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should throw error for invalid input', () => {
      expect(() => {
        calculateHashFromString(null as any);
      }).toThrow();
    });
  });

  describe('calculateHashFromStrings', () => {
    it('should calculate hash for array of strings', () => {
      const contents = ['hello', 'world', 'test'];
      const hash = calculateHashFromStrings(contents);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
      expect(hash).toMatch(/^[a-f0-9]{40}$/);
    });

    it('should produce consistent results', () => {
      const contents = ['hello', 'world'];
      const hash1 = calculateHashFromStrings(contents);
      const hash2 = calculateHashFromStrings(contents);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different order', () => {
      const contents1 = ['hello', 'world'];
      const contents2 = ['world', 'hello'];
      const hash1 = calculateHashFromStrings(contents1);
      const hash2 = calculateHashFromStrings(contents2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty array', () => {
      const contents: string[] = [];
      const hash = calculateHashFromStrings(contents);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle single string', () => {
      const contents = ['single'];
      const hash = calculateHashFromStrings(contents);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle empty strings in array', () => {
      const contents = ['hello', '', 'world'];
      const hash = calculateHashFromStrings(contents);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should throw error for invalid input', () => {
      expect(() => {
        calculateHashFromStrings(null as any);
      }).toThrow();
    });
  });
});
