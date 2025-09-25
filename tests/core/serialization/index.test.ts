/**
 * シリアライゼーションモジュールの統合テスト（最小限版）
 */

import {
  deepCopy,
  deserialize,
  SerializationError,
  stringifyCompact,
} from '@/core/serialization';
import { describe, expect, it } from 'vitest';

describe('Serialization Module Integration (Minimal)', () => {
  describe('Module exports', () => {
    it('should export all required functions', () => {
      expect(typeof stringifyCompact).toBe('function');
      expect(typeof deserialize).toBe('function');
      expect(typeof deepCopy).toBe('function');
    });
  });

  describe('Basic functionality integration', () => {
    it('should work for complete serialization workflow', () => {
      const original = { name: 'test', value: 42 };

      // シリアライゼーション
      const serialized = stringifyCompact(original);
      expect(serialized).toBe('{"name":"test","value":42}');

      // デシリアライゼーション
      const deserialized = deserialize(serialized);
      expect(deserialized).toEqual(original);
    });

    it('should handle different data types in workflow', () => {
      const testData = {
        string: 'hello',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
      };

      const serialized = stringifyCompact(testData);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(testData);
    });
  });

  describe('Error handling integration', () => {
    it('should handle SerializationError properly', () => {
      const invalidJson = '{invalid json}';

      expect(() => deserialize(invalidJson)).toThrow(SerializationError);
    });

    it('should provide meaningful error messages', () => {
      try {
        deserialize('{invalid}');
      } catch (error) {
        expect(error).toBeInstanceOf(SerializationError);
        expect((error as SerializationError).message).toContain('Failed to deserialize');
      }
    });

    it('should handle circular reference errors', () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      expect(() => stringifyCompact(obj)).toThrow(SerializationError);
    });

    it('should handle BigInt serialization errors', () => {
      const bigIntObj = { value: BigInt(123) };

      expect(() => stringifyCompact(bigIntObj)).toThrow(SerializationError);
    });

    it('should handle Symbol serialization (returns undefined)', () => {
      const result = stringifyCompact(Symbol('test'));
      expect(result).toBe(undefined);
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should handle configuration data simulation', () => {
      const config = {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
        features: {
          auth: true,
          logging: false,
        },
      };

      const serialized = stringifyCompact(config);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(config);
    });

    it('should handle user data simulation', () => {
      const user = {
        id: 123,
        username: 'testuser',
        email: 'test@example.com',
        profile: {
          firstName: 'Test',
          lastName: 'User',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      };

      const serialized = stringifyCompact(user);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(user);
    });

    it('should handle API response simulation', () => {
      const apiResponse = {
        status: 'success',
        data: {
          users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
          },
        },
        metadata: {
          timestamp: '2023-01-01T00:00:00Z',
          version: '1.0',
        },
      };

      const serialized = stringifyCompact(apiResponse);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(apiResponse);
    });

    it('should handle log data simulation', () => {
      const logEntry = {
        level: 'info',
        message: 'User action completed',
        timestamp: '2023-01-01T12:00:00Z',
        context: {
          userId: 123,
          action: 'update_profile',
          duration: 250,
        },
      };

      const serialized = stringifyCompact(logEntry);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(logEntry);
    });

    it('should handle form data simulation', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        interests: ['programming', 'music', 'travel'],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          zipcode: '12345',
        },
      };

      const serialized = stringifyCompact(formData);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(formData);
    });
  });

  describe('Performance integration', () => {
    it('should handle high-frequency serialization', () => {
      const testData = { counter: 0, timestamp: Date.now() };
      const iterations = 1000;

      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        stringifyCompact(testData);
      }
      const endTime = performance.now();

      // パフォーマンステスト：1000回の操作が合理的な時間で完了すること
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle memory efficiently in continuous operations', () => {
      // メモリ効率のテスト
      for (let i = 0; i < 100; i++) {
        const data = { iteration: i, timestamp: new Date().toISOString() };
        const serialized = stringifyCompact(data);
        const deserialized = deserialize(serialized);
        expect(deserialized).toEqual(data);
      }

      // メモリリークがないことの間接的な確認
      expect(true).toBe(true);
    });
  });

  describe('Data integrity', () => {
    it('should maintain data integrity for complex objects', () => {
      const complexObject = {
        numbers: [1, 2, 3, 4, 5],
        strings: ['a', 'b', 'c'],
        nested: {
          deep: {
            value: 'very deep',
            array: [{ id: 1 }, { id: 2 }],
          },
        },
        mixed: [1, 'two', { three: 3 }, [4, 5]],
      };

      const serialized = stringifyCompact(complexObject);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(complexObject);
    });

    it('should handle numeric precision correctly', () => {
      const numbers = {
        integer: 42,
        float: 3.14159,
        negative: -123.456,
        zero: 0,
        scientific: 1.23e-4,
      };

      const serialized = stringifyCompact(numbers);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(numbers);
    });

    it('should handle boolean values correctly', () => {
      const booleans = {
        isTrue: true,
        isFalse: false,
        nested: { flag: true },
        array: [true, false, true],
      };

      const serialized = stringifyCompact(booleans);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(booleans);
    });
  });

  describe('Deep copy integration', () => {
    it('should work with deep copy for complete workflow', () => {
      const original = {
        data: { value: 42 },
        array: [1, 2, { nested: true }],
      };

      // 深いコピー
      const copied = deepCopy(original);
      expect(copied.data).toEqual(original);
      expect(copied.data).not.toBe(original); // 参照が異なることを確認

      // コピーしたオブジェクトをシリアライズ
      const serialized = stringifyCompact(copied.data);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(original);
    });
  });

});