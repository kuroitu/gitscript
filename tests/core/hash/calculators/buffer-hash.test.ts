/**
 * src/core/hash/calculators/buffer-hash.ts のテスト
 */

import {
  calculateHashFromBuffer,
  calculateHashFromBuffers,
} from '@/core/hash/calculators/buffer-hash';
import { describe, expect, it } from 'vitest';

describe('Buffer Hash Calculator', () => {
  describe('calculateHashFromBuffer', () => {
    it('should calculate hash for valid buffer', () => {
      const buffer = Buffer.from('hello world', 'utf8');
      const hash = calculateHashFromBuffer(buffer);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
      expect(hash).toMatch(/^[a-f0-9]{40}$/);
    });

    it('should produce consistent results', () => {
      const buffer = Buffer.from('test data', 'utf8');
      const hash1 = calculateHashFromBuffer(buffer);
      const hash2 = calculateHashFromBuffer(buffer);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different buffers', () => {
      const buffer1 = Buffer.from('hello', 'utf8');
      const buffer2 = Buffer.from('world', 'utf8');
      const hash1 = calculateHashFromBuffer(buffer1);
      const hash2 = calculateHashFromBuffer(buffer2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty buffer', () => {
      const buffer = Buffer.alloc(0);
      const hash = calculateHashFromBuffer(buffer);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle binary data', () => {
      const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]);
      const hash = calculateHashFromBuffer(buffer);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle unicode buffer', () => {
      const buffer = Buffer.from('こんにちは世界', 'utf8');
      const hash = calculateHashFromBuffer(buffer);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should throw error for invalid input', () => {
      expect(() => {
        calculateHashFromBuffer(null as any);
      }).toThrow();
    });
  });

  describe('calculateHashFromBuffers', () => {
    it('should calculate hash for array of buffers', () => {
      const buffers = [
        Buffer.from('hello', 'utf8'),
        Buffer.from('world', 'utf8'),
        Buffer.from('test', 'utf8'),
      ];
      const hash = calculateHashFromBuffers(buffers);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
      expect(hash).toMatch(/^[a-f0-9]{40}$/);
    });

    it('should produce consistent results', () => {
      const buffers = [
        Buffer.from('hello', 'utf8'),
        Buffer.from('world', 'utf8'),
      ];
      const hash1 = calculateHashFromBuffers(buffers);
      const hash2 = calculateHashFromBuffers(buffers);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different order', () => {
      const buffers1 = [
        Buffer.from('hello', 'utf8'),
        Buffer.from('world', 'utf8'),
      ];
      const buffers2 = [
        Buffer.from('world', 'utf8'),
        Buffer.from('hello', 'utf8'),
      ];
      const hash1 = calculateHashFromBuffers(buffers1);
      const hash2 = calculateHashFromBuffers(buffers2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty array', () => {
      const buffers: Buffer[] = [];
      const hash = calculateHashFromBuffers(buffers);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle single buffer', () => {
      const buffers = [Buffer.from('single', 'utf8')];
      const hash = calculateHashFromBuffers(buffers);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should handle empty buffers in array', () => {
      const buffers = [
        Buffer.from('hello', 'utf8'),
        Buffer.alloc(0),
        Buffer.from('world', 'utf8'),
      ];
      const hash = calculateHashFromBuffers(buffers);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should throw error for invalid input', () => {
      expect(() => {
        calculateHashFromBuffers(null as any);
      }).toThrow();
    });
  });
});
