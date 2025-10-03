/**
 * src/types/errors/staging.ts のテスト
 */

import { StagingAreaError } from '@/types/errors/staging';
import { describe, expect, it } from 'vitest';

describe('Staging Error', () => {
  describe('StagingAreaError', () => {
    it('should create error with message', () => {
      const message = 'Staging area operation failed';
      const error = new StagingAreaError(message);

      expect(error).toBeInstanceOf(StagingAreaError);
      expect(error.message).toBe(message);
      expect(error.code).toBe('STAGING_AREA_ERROR');
      expect(error.name).toBe('StagingAreaError');
    });

    it('should inherit from GitScriptError', () => {
      const error = new StagingAreaError('Test message');

      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('StagingAreaError');
    });

    it('should handle empty message', () => {
      const error = new StagingAreaError('');

      expect(error.message).toBe('');
      expect(error.code).toBe('STAGING_AREA_ERROR');
    });
  });
});
