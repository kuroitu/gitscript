/**
 * src/core/hash/calculators/index.ts のテスト
 */

import * as HashCalculators from '@/core/hash/calculators';
import { describe, expect, it } from 'vitest';

describe('Hash Calculators Module', () => {
  describe('exports', () => {
    it('should export string hash functions', () => {
      expect(HashCalculators.calculateHashFromString).toBeDefined();
      expect(HashCalculators.calculateHashFromStrings).toBeDefined();
      expect(typeof HashCalculators.calculateHashFromString).toBe('function');
      expect(typeof HashCalculators.calculateHashFromStrings).toBe('function');
    });

    it('should export buffer hash functions', () => {
      expect(HashCalculators.calculateHashFromBuffer).toBeDefined();
      expect(HashCalculators.calculateHashFromBuffers).toBeDefined();
      expect(typeof HashCalculators.calculateHashFromBuffer).toBe('function');
      expect(typeof HashCalculators.calculateHashFromBuffers).toBe('function');
    });

    it('should export object hash functions', () => {
      expect(HashCalculators.calculateHashFromObject).toBeDefined();
      expect(HashCalculators.calculateHashFromObjects).toBeDefined();
      expect(typeof HashCalculators.calculateHashFromObject).toBe('function');
      expect(typeof HashCalculators.calculateHashFromObjects).toBe('function');
    });
  });

  describe('functionality', () => {
    it('should work with string hash functions', () => {
      const hash = HashCalculators.calculateHashFromString('test');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should work with buffer hash functions', () => {
      const hash = HashCalculators.calculateHashFromBuffer(Buffer.from('test'));
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });

    it('should work with object hash functions', () => {
      const hash = HashCalculators.calculateHashFromObject({ test: 'value' });
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40);
    });
  });
});
