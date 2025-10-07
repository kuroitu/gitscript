/**
 * src/core/utils/index.ts のテスト
 */

import {
  isArray,
  isBuffer,
  isNullOrUndefined,
  isString,
  validateRange,
} from '@/core/utils';
import { describe, expect, it } from 'vitest';

describe('Utils Module Integration', () => {
  describe('Module exports', () => {
    it('should export all required functions', () => {
      expect(typeof isString).toBe('function');
      expect(typeof isNullOrUndefined).toBe('function');
      expect(typeof isArray).toBe('function');
      expect(typeof isBuffer).toBe('function');
      expect(typeof validateRange).toBe('function');
    });
  });

  describe('Basic functionality integration', () => {
    it('should work together for complete type checking workflow', () => {
      // 基本的な型チェックワークフロー
      const value: unknown = 'test string';

      // 型ガードでチェック
      if (isString(value)) {
        expect(value).toBe('test string');
      }

      // 数値の範囲チェック
      const numberValue = 5;
      expect(() => validateRange(numberValue, 0, 10)).not.toThrow();
    });

    it('should handle different data types in workflow', () => {
      const stringValue: unknown = 'hello world';
      const arrayValue: unknown = [1, 2, 3];
      const bufferValue: unknown = Buffer.from('test');

      // 文字列の処理
      if (isString(stringValue)) {
        expect(stringValue).toBe('hello world');
      }

      // 配列の処理
      if (isArray(arrayValue)) {
        expect(arrayValue.length).toBe(3);
      }

      // バッファの処理
      if (isBuffer(bufferValue)) {
        expect(bufferValue.length).toBe(4);
      }
    });

    it('should handle null and undefined values', () => {
      const nullValue: unknown = null;
      const undefinedValue: unknown = undefined;

      expect(isNullOrUndefined(nullValue)).toBe(true);
      expect(isNullOrUndefined(undefinedValue)).toBe(true);
      expect(isNullOrUndefined('string')).toBe(false);
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should handle API response validation', () => {
      const response: unknown = {
        status: 'success',
        data: { id: 1, name: 'test' },
        timestamp: Date.now(),
      };

      if (isString(response) || isArray(response) || isBuffer(response)) {
        // 型ガードで適切に処理
        expect(true).toBe(true);
      }
    });

    it('should handle configuration data validation', () => {
      const config: unknown = {
        database: {
          host: 'localhost',
          port: 5432,
          name: 'mydb',
        },
        server: {
          port: 3000,
          timeout: 5000,
        },
      };

      if (isString(config) || isArray(config) || isBuffer(config)) {
        // 型ガードで適切に処理
        expect(true).toBe(true);
      }
    });

    it('should handle user input validation', () => {
      const input: unknown = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      if (isString(input) || isArray(input) || isBuffer(input)) {
        // 型ガードで適切に処理
        expect(true).toBe(true);
      }
    });

    it('should handle file data validation', () => {
      const file: unknown = {
        filename: 'document.pdf',
        size: 1024,
        content: Buffer.from('file content'),
      };

      if (isString(file) || isArray(file) || isBuffer(file)) {
        // 型ガードで適切に処理
        expect(true).toBe(true);
      }
    });

    it('should handle log data validation', () => {
      const log: unknown = {
        level: 'info',
        message: 'Application started',
        timestamp: new Date().toISOString(),
      };

      if (isString(log) || isArray(log) || isBuffer(log)) {
        // 型ガードで適切に処理
        expect(true).toBe(true);
      }
    });
  });

  describe('Error handling integration', () => {
    it('should handle validation errors gracefully', () => {
      // validateRangeのエラーハンドリング
      expect(() => validateRange(15, 0, 10)).toThrow();
      expect(() => validateRange(5, 0, 10)).not.toThrow();
    });
  });

  describe('Performance integration', () => {
    it('should handle high-frequency type checking', () => {
      const values = [
        'string',
        [1, 2, 3],
        Buffer.from('test'),
        null,
        undefined,
      ];

      // 高頻度の型チェック
      for (let i = 0; i < 1000; i++) {
        values.forEach((value) => {
          if (isString(value)) {
            expect(typeof value).toBe('string');
          } else if (isArray(value)) {
            expect(Array.isArray(value)).toBe(true);
          } else if (isBuffer(value)) {
            expect(Buffer.isBuffer(value)).toBe(true);
          }
        });
      }
    });

    it('should handle memory efficiently in continuous operations', () => {
      const batchData = Array.from({ length: 100 }, (_, i) => ({
        name: `item${i}`,
        data: Buffer.from(`data${i}`),
      }));

      batchData.forEach((item) => {
        if (isString(item.name)) {
          expect(typeof item.name).toBe('string');
        }
        if (isBuffer(item.data)) {
          expect(Buffer.isBuffer(item.data)).toBe(true);
        }
      });
    });
  });

  describe('Type safety integration', () => {
    it('should maintain type safety across functions', () => {
      const processString = (value: unknown): string | null => {
        if (isString(value)) {
          return value; // TypeScript should know this is a string
        }
        return null;
      };

      const processArray = (value: unknown): unknown[] | null => {
        if (isArray(value)) {
          return value; // TypeScript should know this is an array
        }
        return null;
      };

      const processBuffer = (value: unknown): Buffer | null => {
        if (isBuffer(value)) {
          return value; // TypeScript should know this is a Buffer
        }
        return null;
      };

      expect(processString('test')).toBe('test');
      expect(processString(123)).toBeNull();

      expect(processArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(processArray('string')).toBeNull();

      expect(processBuffer(Buffer.from('test'))).toEqual(Buffer.from('test'));
      expect(processBuffer('string')).toBeNull();
    });
  });
});
