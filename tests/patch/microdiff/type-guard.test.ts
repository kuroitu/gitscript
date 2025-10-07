/**
 * src/patch/microdiff/type-guard.ts のテスト
 */

import {
  isMicrodiffChange,
  isMicrodiffChangeType,
  isMicrodiffOptions,
  isMicrodiffPath,
  isMicrodiffResult,
  isMicrodiffSource,
} from '@/patch/microdiff/type-guard';
import { describe, expect, it } from 'vitest';

describe('Microdiff Type Guards', () => {
  describe('isMicrodiffOptions', () => {
    it('should return true for valid MicrodiffOptions', () => {
      expect(isMicrodiffOptions({})).toBe(true);
      expect(isMicrodiffOptions({ cyclesFix: true })).toBe(true);
      expect(isMicrodiffOptions({ cyclesFix: false })).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(isMicrodiffOptions(null)).toBe(false);
      expect(isMicrodiffOptions(undefined)).toBe(false);
      expect(isMicrodiffOptions('string')).toBe(false);
      expect(isMicrodiffOptions(123)).toBe(false);
      expect(isMicrodiffOptions({ cyclesFix: 'string' })).toBe(false);
      expect(isMicrodiffOptions({ cyclesFix: 123 })).toBe(false);
    });
  });

  describe('isMicrodiffChangeType', () => {
    it('should return true for valid change types', () => {
      expect(isMicrodiffChangeType('CREATE')).toBe(true);
      expect(isMicrodiffChangeType('REMOVE')).toBe(true);
      expect(isMicrodiffChangeType('CHANGE')).toBe(true);
    });

    it('should return false for invalid change types', () => {
      expect(isMicrodiffChangeType('INVALID')).toBe(false);
      expect(isMicrodiffChangeType('create')).toBe(false);
      expect(isMicrodiffChangeType('remove')).toBe(false);
      expect(isMicrodiffChangeType('change')).toBe(false);
      expect(isMicrodiffChangeType('')).toBe(false);
      expect(isMicrodiffChangeType(null)).toBe(false);
      expect(isMicrodiffChangeType(undefined)).toBe(false);
      expect(isMicrodiffChangeType(123)).toBe(false);
    });
  });

  describe('isMicrodiffPath', () => {
    it('should return true for valid paths', () => {
      expect(isMicrodiffPath([])).toBe(true);
      expect(isMicrodiffPath(['user'])).toBe(true);
      expect(isMicrodiffPath(['user', 'name'])).toBe(true);
      expect(isMicrodiffPath([0])).toBe(true);
      expect(isMicrodiffPath([0, 1, 2])).toBe(true);
      expect(isMicrodiffPath(['user', 0, 'name'])).toBe(true);
    });

    it('should return false for invalid paths', () => {
      expect(isMicrodiffPath(null)).toBe(false);
      expect(isMicrodiffPath(undefined)).toBe(false);
      expect(isMicrodiffPath('string')).toBe(false);
      expect(isMicrodiffPath(123)).toBe(false);
      expect(isMicrodiffPath({})).toBe(false);
      expect(isMicrodiffPath([null])).toBe(false);
      expect(isMicrodiffPath([undefined])).toBe(false);
      expect(isMicrodiffPath([{}])).toBe(false);
      expect(isMicrodiffPath([[]])).toBe(false);
    });
  });

  describe('isMicrodiffSource', () => {
    it('should return true for valid sources', () => {
      expect(isMicrodiffSource({})).toBe(true);
      expect(isMicrodiffSource({ name: 'Alice' })).toBe(true);
      expect(isMicrodiffSource([])).toBe(true);
      expect(isMicrodiffSource([1, 2, 3])).toBe(true);
    });

    it('should return false for invalid sources', () => {
      expect(isMicrodiffSource(undefined)).toBe(false);
      expect(isMicrodiffSource('string')).toBe(false);
      expect(isMicrodiffSource(123)).toBe(false);
      expect(isMicrodiffSource(true)).toBe(false);
      expect(isMicrodiffSource(Symbol('test'))).toBe(false);
    });
  });

  describe('isMicrodiffChange', () => {
    it('should return true for valid CREATE changes', () => {
      const createChange = {
        type: 'CREATE',
        path: ['user', 'name'],
        value: 'Alice',
      };
      expect(isMicrodiffChange(createChange)).toBe(true);
    });

    it('should return true for valid REMOVE changes', () => {
      const removeChange = {
        type: 'REMOVE',
        path: ['user', 'age'],
        oldValue: 30,
      };
      expect(isMicrodiffChange(removeChange)).toBe(true);
    });

    it('should return true for valid CHANGE changes', () => {
      const changeChange = {
        type: 'CHANGE',
        path: ['user', 'name'],
        value: 'Bob',
        oldValue: 'Alice',
      };
      expect(isMicrodiffChange(changeChange)).toBe(true);
    });

    it('should return false for invalid changes', () => {
      expect(isMicrodiffChange(null)).toBe(false);
      expect(isMicrodiffChange(undefined)).toBe(false);
      expect(isMicrodiffChange({})).toBe(false);
      expect(isMicrodiffChange({ type: 'INVALID' })).toBe(false);
      expect(isMicrodiffChange({ type: 'CREATE' })).toBe(false);
      expect(isMicrodiffChange({ type: 'CREATE', path: 'invalid' })).toBe(
        false,
      );
    });
  });

  describe('isMicrodiffResult', () => {
    it('should return true for valid results', () => {
      const validResult = [
        {
          type: 'CREATE',
          path: ['user', 'name'],
          value: 'Alice',
        },
        {
          type: 'CHANGE',
          path: ['user', 'age'],
          value: 31,
          oldValue: 30,
        },
      ];
      expect(isMicrodiffResult(validResult)).toBe(true);
    });

    it('should return true for empty results', () => {
      expect(isMicrodiffResult([])).toBe(true);
    });

    it('should return false for invalid results', () => {
      expect(isMicrodiffResult(null)).toBe(false);
      expect(isMicrodiffResult(undefined)).toBe(false);
      expect(isMicrodiffResult('string')).toBe(false);
      expect(isMicrodiffResult(123)).toBe(false);
      expect(isMicrodiffResult({})).toBe(false);
      expect(isMicrodiffResult([null])).toBe(false);
      expect(isMicrodiffResult([{}])).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should narrow types correctly', () => {
      const unknownValue: unknown = { cyclesFix: true };

      if (isMicrodiffOptions(unknownValue)) {
        // TypeScript should know this is MicrodiffOptions
        expect(unknownValue.cyclesFix).toBe(true);
      }

      const unknownPath: unknown = ['user', 'name'];
      if (isMicrodiffPath(unknownPath)) {
        // TypeScript should know this is MicrodiffPath
        expect(unknownPath[0]).toBe('user');
        expect(unknownPath[1]).toBe('name');
      }

      const unknownSource: unknown = { name: 'Alice' };
      if (isMicrodiffSource(unknownSource)) {
        // TypeScript should know this is MicrodiffSource
        expect(typeof unknownSource).toBe('object');
      }
    });
  });
});
