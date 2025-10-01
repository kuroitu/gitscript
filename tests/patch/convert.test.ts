/**
 * src/patch/convert.ts のテスト
 */

import {
  convertPatchToMicrodiffResult,
  convertMicrodiffResultToPatch,
} from '@/patch/convert';
import { MicrodiffChangeType } from '@/patch/microdiff';
import { describe, expect, it } from 'vitest';

describe('Patch Convert', () => {
  describe('convertPatchToMicrodiffResult', () => {
    it('should convert patch to microdiff result', () => {
      const patch: any = {
        diff: [
          {
            type: MicrodiffChangeType.Change,
            path: ['user', 'name'],
            value: 'Bob',
          },
          {
            type: MicrodiffChangeType.Create,
            path: ['user', 'age'],
            value: 30,
          },
        ],
      };

      const result = convertPatchToMicrodiffResult(patch);
      expect(result).toEqual(patch.diff);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should handle empty patch', () => {
      const patch: any = { diff: [] };
      const result = convertPatchToMicrodiffResult(patch);
      expect(result).toEqual([]);
    });

    it('should preserve microdiff change structure', () => {
      const patch: any = {
        diff: [
          {
            type: MicrodiffChangeType.Remove,
            path: ['items', 0],
            value: undefined,
          },
        ],
      };

      const result = convertPatchToMicrodiffResult(patch);
      expect(result[0]).toEqual({
        type: MicrodiffChangeType.Remove,
        path: ['items', 0],
        value: undefined,
      });
    });
  });

  describe('convertMicrodiffResultToPatch', () => {
    it('should convert microdiff result to patch', () => {
      const microdiffResult: any = [
        {
          type: MicrodiffChangeType.Change,
          path: ['user', 'name'],
          value: 'Alice',
        },
        {
          type: MicrodiffChangeType.Create,
          path: ['user', 'email'],
          value: 'alice@example.com',
        },
      ];

      const result = convertMicrodiffResultToPatch(microdiffResult);
      expect(result).toEqual({ diff: microdiffResult });
    });

    it('should handle empty microdiff result', () => {
      const microdiffResult: any[] = [];
      const result = convertMicrodiffResultToPatch(microdiffResult);
      expect(result).toEqual({ diff: [] });
    });

    it('should preserve all change types', () => {
      const microdiffResult = [
        {
          type: MicrodiffChangeType.Create,
          path: ['new', 'field'],
          value: 'new value',
        },
        {
          type: MicrodiffChangeType.Change,
          path: ['existing', 'field'],
          value: 'changed value',
        },
        {
          type: MicrodiffChangeType.Remove,
          path: ['removed', 'field'],
          value: undefined,
        },
      ];

      const result = convertMicrodiffResultToPatch(microdiffResult);
      expect(result.diff).toEqual(microdiffResult);
    });
  });

  describe('round-trip conversion', () => {
    it('should maintain data integrity through round-trip conversion', () => {
      const originalPatch = {
        diff: [
          {
            type: MicrodiffChangeType.Change,
            path: ['user', 'profile', 'name'],
            value: 'Alice Updated',
          },
          {
            type: MicrodiffChangeType.Create,
            path: ['user', 'profile', 'avatar'],
            value: 'avatar.jpg',
          },
          {
            type: MicrodiffChangeType.Remove,
            path: ['user', 'profile', 'oldField'],
            value: undefined,
          },
        ],
      };

      // パッチ → microdiff結果 → パッチ
      const microdiffResult = convertPatchToMicrodiffResult(originalPatch);
      const convertedPatch = convertMicrodiffResultToPatch(microdiffResult);

      expect(convertedPatch).toEqual(originalPatch);
    });

    it('should handle complex nested paths', () => {
      const originalPatch = {
        diff: [
          {
            type: MicrodiffChangeType.Change,
            path: ['data', 'items', 0, 'metadata', 'tags', 1],
            value: 'updated tag',
          },
        ],
      };

      const microdiffResult = convertPatchToMicrodiffResult(originalPatch);
      const convertedPatch = convertMicrodiffResultToPatch(microdiffResult);

      expect(convertedPatch).toEqual(originalPatch);
    });
  });
});
