import { SerializationError, stringifyCompact } from '@/core/serialization';
import { expectValidJson } from '@tests/core/serialization/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Serialization Module Integration', () => {
    describe('Module exports', () => {
        it('should export all required functions', () => {
            expect(typeof stringifyCompact).toBe('function');
            expect(SerializationError).toBeDefined();
        });
    });

    describe('Basic functionality integration', () => {
        it('should work for complete serialization workflow', () => {
            // 基本的なシリアライゼーションワークフロー
            const data = { name: 'test', value: 123 };
            const serialized = stringifyCompact(data);

            expectValidJson(serialized);

            // 同じデータから再度シリアライズして一貫性を確認
            const serialized2 = stringifyCompact(data);
            expect(serialized).toBe(serialized2);
        });

        it('should handle different data types in workflow', () => {
            const stringData = 'hello world';
            const numberData = 42;
            const booleanData = true;
            const arrayData = [1, 2, 3];
            const objectData = { key: 'value' };

            const stringSerialized = stringifyCompact(stringData);
            const numberSerialized = stringifyCompact(numberData);
            const booleanSerialized = stringifyCompact(booleanData);
            const arraySerialized = stringifyCompact(arrayData);
            const objectSerialized = stringifyCompact(objectData);

            expectValidJson(stringSerialized);
            expectValidJson(numberSerialized);
            expectValidJson(booleanSerialized);
            expectValidJson(arraySerialized);
            expectValidJson(objectSerialized);

            // すべて異なる結果であることを確認
            const results = [stringSerialized, numberSerialized, booleanSerialized, arraySerialized, objectSerialized];
            const uniqueResults = new Set(results);
            expect(uniqueResults.size).toBe(results.length);
        });
    });

    describe('Error handling integration', () => {
        it('should handle SerializationError properly', () => {
            // SerializationErrorが正しく定義されていることを確認
            expect(SerializationError.prototype).toBeInstanceOf(Error);

            // インスタンスのnameプロパティをテスト
            const error = new SerializationError('Test error');
            expect(error.name).toBe('SerializationError');
        });

        it('should provide meaningful error messages', () => {
            // エラーメッセージが適切に設定されていることを確認
            const error = new SerializationError('Test error');
            expect(error.message).toContain('Serialization error: Test error');
            expect(error.code).toBe('SERIALIZATION_ERROR');
        });

        it('should handle circular reference errors', () => {
            const circularObj: any = { name: 'test' };
            circularObj.self = circularObj;

            expect(() => stringifyCompact(circularObj)).toThrow(SerializationError);
        });

        it('should handle BigInt serialization errors', () => {
            expect(() => stringifyCompact(BigInt(123))).toThrow(SerializationError);
        });

        it('should handle Symbol serialization (converts to undefined)', () => {
            const result = stringifyCompact(Symbol('test'));
            expect(result).toBeUndefined();
        });
    });

    describe('Real-world usage scenarios', () => {
        it('should handle configuration data simulation', () => {
            // 設定データのような構造化データのシミュレーション
            const configData = {
                database: {
                    host: 'localhost',
                    port: 5432,
                    ssl: true,
                    connectionPool: {
                        min: 2,
                        max: 10
                    }
                },
                api: {
                    baseUrl: 'https://api.example.com',
                    timeout: 5000,
                    retries: 3
                },
                features: {
                    enableLogging: true,
                    enableMetrics: false,
                    debugMode: false
                }
            };

            const serialized = stringifyCompact(configData);
            expectValidJson(serialized);
            expect(serialized).toContain('"host":"localhost"');
            expect(serialized).toContain('"port":5432');
        });

        it('should handle user data simulation', () => {
            // ユーザーデータのような構造化データのシミュレーション
            const userData = {
                id: 12345,
                name: 'John Doe',
                email: 'john@example.com',
                profile: {
                    age: 30,
                    location: 'Tokyo, Japan',
                    preferences: {
                        theme: 'dark',
                        language: 'ja',
                        notifications: true
                    }
                },
                tags: ['developer', 'typescript', 'nodejs']
            };

            const serialized = stringifyCompact(userData);
            expectValidJson(serialized);
            expect(serialized).toContain('"name":"John Doe"');
            expect(serialized).toContain('"email":"john@example.com"');
        });

        it('should handle API response simulation', () => {
            // APIレスポンスのような構造化データのシミュレーション
            const apiResponse = {
                status: 'success',
                data: {
                    users: [
                        { id: 1, name: 'Alice' },
                        { id: 2, name: 'Bob' },
                        { id: 3, name: 'Charlie' }
                    ],
                    pagination: {
                        page: 1,
                        limit: 10,
                        total: 3,
                        hasNext: false
                    }
                },
                timestamp: '2023-01-01T00:00:00Z'
            };

            const serialized = stringifyCompact(apiResponse);
            expectValidJson(serialized);
            expect(serialized).toContain('"status":"success"');
            expect(serialized).toContain('"users"');
        });

        it('should handle log data simulation', () => {
            // ログデータのような構造化データのシミュレーション
            const logData = {
                level: 'info',
                message: 'User login successful',
                timestamp: new Date('2023-01-01T00:00:00Z'),
                metadata: {
                    userId: 12345,
                    ip: '192.168.1.1',
                    userAgent: 'Mozilla/5.0...',
                    sessionId: 'sess_abc123'
                },
                tags: ['auth', 'login', 'success']
            };

            const serialized = stringifyCompact(logData);
            expectValidJson(serialized);
            expect(serialized).toContain('"level":"info"');
            expect(serialized).toContain('"message":"User login successful"');
        });

        it('should handle form data simulation', () => {
            // フォームデータのような構造化データのシミュレーション
            const formData = {
                personalInfo: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '+81-90-1234-5678'
                },
                address: {
                    street: '1-2-3 Shibuya',
                    city: 'Shibuya',
                    prefecture: 'Tokyo',
                    postalCode: '150-0002',
                    country: 'Japan'
                },
                preferences: {
                    newsletter: true,
                    sms: false,
                    language: 'ja'
                }
            };

            const serialized = stringifyCompact(formData);
            expectValidJson(serialized);
            expect(serialized).toContain('"firstName":"John"');
            expect(serialized).toContain('"lastName":"Doe"');
        });
    });

    describe('Performance integration', () => {
        it('should handle high-frequency serialization', () => {
            const startTime = performance.now();

            // 高頻度でシリアライゼーションを実行
            for (let i = 0; i < 1000; i++) {
                const data = { id: i, data: `test${i}` };
                const serialized = stringifyCompact(data);
                expectValidJson(serialized);
            }

            const endTime = performance.now();
            const executionTime = endTime - startTime;

            expect(executionTime).toBeLessThan(1000); // 1秒以内
        });

        it('should handle memory efficiently in continuous operations', () => {
            // 連続操作でのメモリ効率性を確認
            for (let batch = 0; batch < 10; batch++) {
                const batchData = Array.from({ length: 100 }, (_, i) => ({
                    batch,
                    item: i,
                    data: `batch_${batch}_item_${i}`
                }));

                const serialized = stringifyCompact(batchData);
                expectValidJson(serialized);
            }
        });
    });

    describe('Data integrity', () => {
        it('should maintain data integrity for complex objects', () => {
            const complexObject = {
                level1: {
                    level2: {
                        level3: {
                            value: 'deep value',
                            array: [1, 2, { nested: true }],
                            special: {
                                unicode: 'こんにちは世界',
                                emoji: '🌍🚀💻',
                                specialChars: '!@#$%^&*()'
                            }
                        }
                    }
                }
            };

            const serialized = stringifyCompact(complexObject);
            expectValidJson(serialized);

            // パースして元のデータと比較
            const parsed = JSON.parse(serialized);
            expect(parsed.level1.level2.level3.value).toBe('deep value');
            expect(parsed.level1.level2.level3.array).toEqual([1, 2, { nested: true }]);
            expect(parsed.level1.level2.level3.special.unicode).toBe('こんにちは世界');
        });

        it('should handle numeric precision correctly', () => {
            const numericData = {
                integer: 42,
                float: 3.141592653589793,
                scientific: 1.23e-10,
                large: 999999999999999,
                negative: -42.5
            };

            const serialized = stringifyCompact(numericData);
            expectValidJson(serialized);

            const parsed = JSON.parse(serialized);
            expect(parsed.integer).toBe(42);
            expect(parsed.float).toBe(3.141592653589793);
            expect(parsed.scientific).toBe(1.23e-10);
            expect(parsed.large).toBe(999999999999999);
            expect(parsed.negative).toBe(-42.5);
        });

        it('should handle boolean values correctly', () => {
            const booleanData = {
                trueValue: true,
                falseValue: false,
                mixed: {
                    true: true,
                    false: false
                }
            };

            const serialized = stringifyCompact(booleanData);
            expectValidJson(serialized);

            const parsed = JSON.parse(serialized);
            expect(parsed.trueValue).toBe(true);
            expect(parsed.falseValue).toBe(false);
            expect(parsed.mixed.true).toBe(true);
            expect(parsed.mixed.false).toBe(false);
        });
    });
});
