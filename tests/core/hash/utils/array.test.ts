/**
 * src/core/hash/utils/array.ts のテスト
 */

import {
  findHashIndex,
  removeDuplicateHashes,
  sortHashes,
} from '@/core/hash/utils/array';
import { describe, expect, it } from 'vitest';

describe('Hash Array Utils', () => {
  describe('sortHashes', () => {
    it('should sort valid hashes alphabetically', () => {
      const hashes = [
        '7c211433f02071597741e6ff5a8ea34789abbf43',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const sorted = sortHashes(hashes);

      expect(sorted).toEqual([
        '7c211433f02071597741e6ff5a8ea34789abbf43',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ]);
    });

    it('should filter out invalid hashes', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'invalid',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        'short',
      ];
      const sorted = sortHashes(hashes);

      expect(sorted).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ]);
    });

    it('should handle empty array', () => {
      const hashes: string[] = [];
      const sorted = sortHashes(hashes);

      expect(sorted).toEqual([]);
    });

    it('should handle case insensitive sorting', () => {
      const hashes = [
        'AAF4C61DDCC5E8A2DABEDE0F3B482CD9AEA9434D',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      ];
      const sorted = sortHashes(hashes);

      expect(sorted).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'AAF4C61DDCC5E8A2DABEDE0F3B482CD9AEA9434D',
      ]);
    });
  });

  describe('removeDuplicateHashes', () => {
    it('should remove duplicate hashes', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        '7c211433f02071597741e6ff5a8ea34789abbf43',
      ];
      const unique = removeDuplicateHashes(hashes);

      expect(unique).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        '7c211433f02071597741e6ff5a8ea34789abbf43',
      ]);
    });

    it('should handle case insensitive duplicates', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'A94A8FE5CCB19BA61C4C0873D391E987982FBBD3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const unique = removeDuplicateHashes(hashes);

      expect(unique).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ]);
    });

    it('should filter out invalid hashes', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'invalid',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        'short',
      ];
      const unique = removeDuplicateHashes(hashes);

      expect(unique).toEqual([
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ]);
    });

    it('should handle empty array', () => {
      const hashes: string[] = [];
      const unique = removeDuplicateHashes(hashes);

      expect(unique).toEqual([]);
    });

    it('should preserve original case of first occurrence', () => {
      const hashes = [
        'A94A8FE5CCB19BA61C4C0873D391E987982FBBD3',
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      ];
      const unique = removeDuplicateHashes(hashes);

      expect(unique).toEqual(['A94A8FE5CCB19BA61C4C0873D391E987982FBBD3']);
    });
  });

  describe('findHashIndex', () => {
    it('should find existing hash', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        '7c211433f02071597741e6ff5a8ea34789abbf43',
      ];
      const index = findHashIndex(
        hashes,
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      );

      expect(index).toBe(1);
    });

    it('should return -1 for non-existing hash', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const index = findHashIndex(
        hashes,
        '7c211433f02071597741e6ff5a8ea34789abbf43',
      );

      expect(index).toBe(-1);
    });

    it('should handle case insensitive search', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'AAF4C61DDCC5E8A2DABEDE0F3B482CD9AEA9434D',
      ];
      const index = findHashIndex(
        hashes,
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      );

      expect(index).toBe(1);
    });

    it('should return -1 for invalid target hash', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const index = findHashIndex(hashes, 'invalid');

      expect(index).toBe(-1);
    });

    it('should skip invalid hashes in array', () => {
      const hashes = [
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        'invalid',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      ];
      const index = findHashIndex(
        hashes,
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      );

      expect(index).toBe(2);
    });

    it('should handle empty array', () => {
      const hashes: string[] = [];
      const index = findHashIndex(
        hashes,
        'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      );

      expect(index).toBe(-1);
    });
  });
});
