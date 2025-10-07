/**
 * src/core/utils/validators.ts のテスト
 */

import { validateRange } from '@/core/utils/validators';
import { describe, expect, it } from 'vitest';

describe('Validation Functions', () => {
  describe('validateRange', () => {
    it('should return value for valid range values', () => {
      expect(validateRange(5, 0, 10)).toBe(5);
      expect(validateRange(0, 0, 10)).toBe(0);
      expect(validateRange(10, 0, 10)).toBe(10);
      expect(validateRange(-5, -10, 0)).toBe(-5);
    });

    it('should throw ArgumentError for out-of-range values', () => {
      expect(() => validateRange(15, 0, 10)).toThrow();
      expect(() => validateRange(-1, 0, 10)).toThrow();
      expect(() => validateRange(11, 0, 10)).toThrow();
    });

    it('should use custom parameter name in error message', () => {
      expect(() => validateRange(15, 0, 10, 'count')).toThrow(
        'count must be between 0 and 10',
      );
    });

    it('should include range information in error message', () => {
      expect(() => validateRange(5, 10, 20)).toThrow(
        'value must be between 10 and 20',
      );
    });

    it('should not throw error for value in range', () => {
      expect(() => validateRange(5, 0, 10)).not.toThrow();
      expect(() => validateRange(7.5, 0, 10)).not.toThrow();
    });

    it('should not throw error for value at minimum', () => {
      expect(() => validateRange(0, 0, 10)).not.toThrow();
    });

    it('should not throw error for value at maximum', () => {
      expect(() => validateRange(10, 0, 10)).not.toThrow();
    });

    it('should throw error for value below minimum', () => {
      expect(() => validateRange(-1, 0, 10)).toThrow();
    });

    it('should throw error for value above maximum', () => {
      expect(() => validateRange(11, 0, 10)).toThrow();
    });

    it('should not throw error for negative range', () => {
      expect(() => validateRange(-5, -10, -1)).not.toThrow();
    });

    it('should not throw error for float value in range', () => {
      expect(() => validateRange(5.5, 0, 10)).not.toThrow();
    });

    it('should throw error for float value out of range', () => {
      expect(() => validateRange(10.5, 0, 10)).toThrow();
    });

    it('should handle edge cases', () => {
      expect(() => validateRange(0, 0, 0)).not.toThrow();
      expect(() => validateRange(1, 0, 0)).toThrow();
    });

    it('should handle negative ranges', () => {
      expect(() => validateRange(-5, -10, 0)).not.toThrow();
      expect(() => validateRange(-15, -10, 0)).toThrow();
    });

    it('should handle float ranges', () => {
      expect(() => validateRange(5.5, 0.1, 9.9)).not.toThrow();
      expect(() => validateRange(0.05, 0.1, 9.9)).toThrow();
    });
  });
});
