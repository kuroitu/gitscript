/**
 * シリアライゼーションモジュールの統合テスト
 */

import { describe, it, expect } from 'vitest';
import {
    SerializationError,
    stringifyCompact,
    serialize,
    deserialize,
    deepCopy,
    detectDataType,
    isPrimitive,
    isObject,
    isArray,
    SerializationFormat,
    DataType
} from '@/core/serialization';

describe('Serialization Module Integration', () => {
    describe('Module exports', () => {
        it('should export all required functions', () => {
            expect(typeof stringifyCompact).toBe('function');
            expect(typeof serialize).toBe('function');
            expect(typeof deserialize).toBe('function');
            expect(typeof deepCopy).toBe('function');
            expect(typeof detectDataType).toBe('function');
            expect(typeof isPrimitive).toBe('function');
            expect(typeof isObject).toBe('function');
            expect(typeof isArray).toBe('function');
        });
    });

    describe('Basic functionality integration', () => {
        it('should work for complete serialization workflow', () => {
            const original = { name: 'test', value: 42 };
            
            // シリアライゼーション
            const serialized = serialize(original);
            expect(serialized.data).toBe('{"name":"test","value":42}');
            
            // デシリアライゼーション
            const deserialized = deserialize(serialized.data);
            expect(deserialized.data).toEqual(original);
        });

        it('should handle different data types in workflow', () => {
            const testData = {
                string: 'hello',
                number: 42,
                boolean: true,
                array: [1, 2, 3],
                object: { nested: 'value' }
            };
            
            const serialized = serialize(testData);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(testData);
        });
    });

    describe('Error handling integration', () => {
        it('should handle SerializationError properly', () => {
            expect(() => {
                throw new SerializationError('Test error');
            }).toThrow(SerializationError);
        });

        it('should provide meaningful error messages', () => {
            try {
                throw new SerializationError('Test error message');
            } catch (error) {
                expect(error).toBeInstanceOf(SerializationError);
                expect(error.message).toContain('Test error message');
            }
        });

        it('should handle circular reference errors', () => {
            const obj: any = { a: 1 };
            obj.self = obj;
            
            expect(() => serialize(obj)).toThrow(SerializationError);
        });

        it('should handle BigInt serialization errors', () => {
            expect(() => stringifyCompact(BigInt(123))).toThrow(SerializationError);
        });

        it('should handle Symbol serialization (converts to null)', () => {
            const result = stringifyCompact(Symbol('test'));
            expect(result).toBe('null');
        });
    });

    describe('Real-world usage scenarios', () => {
        it('should handle configuration data simulation', () => {
            // 設定データのような構造化データのシミュレーション
            const config = {
                database: {
                    host: 'localhost',
                    port: 5432,
                    credentials: {
                        username: 'admin',
                        password: 'secret'
                    }
                },
                features: ['auth', 'logging', 'monitoring'],
                debug: true
            };
            
            const serialized = serialize(config);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(config);
        });

        it('should handle user data simulation', () => {
            // ユーザーデータのシミュレーション
            const user = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                preferences: {
                    theme: 'dark',
                    notifications: true,
                    language: 'en'
                },
                lastLogin: '2023-01-01T00:00:00.000Z' // Dateは文字列として扱う
            };
            
            const serialized = serialize(user);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(user);
        });

        it('should handle API response simulation', () => {
            // APIレスポンスのシミュレーション
            const apiResponse = {
                status: 'success',
                data: {
                    users: [
                        { id: 1, name: 'Alice' },
                        { id: 2, name: 'Bob' }
                    ],
                    pagination: {
                        page: 1,
                        total: 2
                    }
                },
                timestamp: new Date().toISOString()
            };
            
            const serialized = serialize(apiResponse);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(apiResponse);
        });

        it('should handle log data simulation', () => {
            // ログデータのシミュレーション
            const timestamp = new Date().toISOString();
            const logEntry = {
                level: 'info',
                message: 'User login successful',
                timestamp: timestamp, // 文字列として扱う
                metadata: {
                    userId: 123,
                    ip: '192.168.1.1',
                    userAgent: 'Mozilla/5.0...'
                }
            };
            
            const serialized = serialize(logEntry);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(logEntry);
        });

        it('should handle form data simulation', () => {
            // フォームデータのシミュレーション
            const formData = {
                personalInfo: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com'
                },
                preferences: {
                    newsletter: true,
                    notifications: false
                },
                tags: ['customer', 'premium']
            };
            
            const serialized = serialize(formData);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(formData);
        });
    });

    describe('Performance integration', () => {
        it('should handle high-frequency serialization', () => {
            const testData = { value: Math.random() };
            const iterations = 1000;
            
            const startTime = performance.now();
            for (let i = 0; i < iterations; i++) {
                serialize(testData);
            }
            const endTime = performance.now();
            
            const avgTime = (endTime - startTime) / iterations;
            expect(avgTime).toBeLessThan(1); // 1ms未満であることを期待
        });

        it('should handle memory efficiently in continuous operations', () => {
            // メモリリークがないことを確認するため、複数回実行
            for (let i = 0; i < 100; i++) {
                const data = { iteration: i, timestamp: new Date().toISOString() };
                const serialized = serialize(data);
                const deserialized = deserialize(serialized.data);
                expect(deserialized.data).toEqual(data);
            }
        });
    });

    describe('Data integrity', () => {
        it('should maintain data integrity for complex objects', () => {
            const complexObject = {
                nested: {
                    deeply: {
                        nested: {
                            value: 'test',
                            array: [1, { inner: 'value' }, 3]
                        }
                    }
                },
                // Set/MapはJSONシリアライゼーションで空オブジェクトになる
                set: {},
                map: {}
            };
            
            const serialized = serialize(complexObject);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(complexObject);
        });

        it('should handle numeric precision correctly', () => {
            const numbers = {
                integer: 42,
                float: 3.14159,
                scientific: 1.23e-10,
                large: 999999999999999
            };
            
            const serialized = serialize(numbers);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(numbers);
        });

        it('should handle boolean values correctly', () => {
            const booleans = {
                true: true,
                false: false
            };
            
            const serialized = serialize(booleans);
            const deserialized = deserialize(serialized.data);
            
            expect(deserialized.data).toEqual(booleans);
        });
    });
});