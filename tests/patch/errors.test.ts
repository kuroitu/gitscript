/**
 * src/patch/errors.ts のテスト
 */

import { DeltaCalculationError } from '@/patch/errors';
import { describe, expect, it } from 'vitest';

describe('Patch Errors', () => {
  describe('DeltaCalculationError', () => {
    it('should create error with message only', () => {
      const error = new DeltaCalculationError('Test error message');

      expect(error).toBeInstanceOf(DeltaCalculationError);
      expect(error.message).toBe(
        'Delta calculation failed: Test error message',
      );
      expect(error.code).toBe('DELTA_CALCULATION_ERROR');
      expect(error.name).toBe('DeltaCalculationError');
    });

    it('should create error with message and original error', () => {
      const originalError = new Error('Original error message');
      const error = new DeltaCalculationError(
        'Test error message',
        originalError,
      );

      expect(error).toBeInstanceOf(DeltaCalculationError);
      expect(error.message).toBe(
        'Delta calculation failed: Test error message (Original error message)',
      );
      expect(error.code).toBe('DELTA_CALCULATION_ERROR');
      expect(error.name).toBe('DeltaCalculationError');
    });

    it('should inherit from GitScriptError', () => {
      const error = new DeltaCalculationError('Test error message');

      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('DeltaCalculationError');
    });

    it('should handle empty message', () => {
      const error = new DeltaCalculationError('');

      expect(error.message).toBe('Delta calculation failed: ');
      expect(error.code).toBe('DELTA_CALCULATION_ERROR');
    });

    it('should handle undefined original error', () => {
      const error = new DeltaCalculationError('Test error message', undefined);

      expect(error.message).toBe(
        'Delta calculation failed: Test error message',
      );
      expect(error.code).toBe('DELTA_CALCULATION_ERROR');
    });

    it('should handle null original error', () => {
      const error = new DeltaCalculationError(
        'Test error message',
        null as any,
      );

      expect(error.message).toBe(
        'Delta calculation failed: Test error message',
      );
      expect(error.code).toBe('DELTA_CALCULATION_ERROR');
    });

    it('should preserve original error in cause', () => {
      const originalError = new Error('Original error message');
      const error = new DeltaCalculationError(
        'Test error message',
        originalError,
      );

      expect(error.cause).toBe(originalError);
    });
  });
});
