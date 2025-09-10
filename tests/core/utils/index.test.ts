import { isArray, isBuffer, isNullOrUndefined, isString, validateArray, validateBuffer, validateString } from '@/core/utils';
import { describe, expect, it } from 'vitest';

describe('Utils Module Integration', () => {
    describe('Module exports', () => {
        it('should export all required functions', () => {
            expect(typeof isString).toBe('function');
            expect(typeof isNullOrUndefined).toBe('function');
            expect(typeof isArray).toBe('function');
            expect(typeof isBuffer).toBe('function');
            expect(typeof validateString).toBe('function');
            expect(typeof validateArray).toBe('function');
            expect(typeof validateBuffer).toBe('function');
        });
    });

    describe('Basic functionality integration', () => {
        it('should work together for complete type checking workflow', () => {
            // 基本的な型チェックワークフロー
            const value: unknown = 'test string';

            // 型ガードでチェック
            if (isString(value)) {
                // バリデーション関数で検証
                const validated = validateString(value);
                expect(validated).toBe('test string');
            }
        });

        it('should handle different data types in workflow', () => {
            const stringValue: unknown = 'hello world';
            const arrayValue: unknown = [1, 2, 3];
            const bufferValue: unknown = Buffer.from('test');

            // 文字列の処理
            if (isString(stringValue)) {
                const validated = validateString(stringValue);
                expect(validated).toBe('hello world');
            }

            // 配列の処理
            if (isArray(arrayValue)) {
                const validated = validateArray<number>(arrayValue);
                expect(validated).toEqual([1, 2, 3]);
            }

            // Bufferの処理
            if (isBuffer(bufferValue)) {
                const validated = validateBuffer(bufferValue);
                expect(validated.toString()).toBe('test');
            }
        });

        it('should handle null and undefined values', () => {
            const nullValue: unknown = null;
            const undefinedValue: unknown = undefined;

            expect(isNullOrUndefined(nullValue)).toBe(true);
            expect(isNullOrUndefined(undefinedValue)).toBe(true);
            expect(isString(nullValue)).toBe(false);
            expect(isString(undefinedValue)).toBe(false);
        });
    });

    describe('Real-world usage scenarios', () => {
        it('should handle API response validation', () => {
            // APIレスポンスのような構造化データの検証
            const apiResponse: unknown = {
                status: 'success',
                data: ['item1', 'item2', 'item3'],
                message: 'Operation completed'
            };

            if (typeof apiResponse === 'object' && apiResponse !== null) {
                const response = apiResponse as Record<string, unknown>;

                // ステータスの検証
                if (isString(response.status)) {
                    const status = validateString(response.status);
                    expect(status).toBe('success');
                }

                // データの検証
                if (isArray(response.data)) {
                    const data = validateArray<string>(response.data);
                    expect(data).toEqual(['item1', 'item2', 'item3']);
                }

                // メッセージの検証
                if (isString(response.message)) {
                    const message = validateString(response.message);
                    expect(message).toBe('Operation completed');
                }
            }
        });

        it('should handle configuration data validation', () => {
            // 設定データのような構造化データの検証
            const config: unknown = {
                database: {
                    host: 'localhost',
                    port: 5432,
                    ssl: true
                },
                api: {
                    baseUrl: 'https://api.example.com',
                    timeout: 5000
                },
                features: ['logging', 'metrics', 'debug']
            };

            if (typeof config === 'object' && config !== null) {
                const configObj = config as Record<string, unknown>;

                // データベース設定の検証
                if (typeof configObj.database === 'object' && configObj.database !== null) {
                    const db = configObj.database as Record<string, unknown>;

                    if (isString(db.host)) {
                        const host = validateString(db.host);
                        expect(host).toBe('localhost');
                    }
                }

                // API設定の検証
                if (typeof configObj.api === 'object' && configObj.api !== null) {
                    const api = configObj.api as Record<string, unknown>;

                    if (isString(api.baseUrl)) {
                        const baseUrl = validateString(api.baseUrl);
                        expect(baseUrl).toBe('https://api.example.com');
                    }
                }

                // 機能リストの検証
                if (isArray(configObj.features)) {
                    const features = validateArray<string>(configObj.features);
                    expect(features).toEqual(['logging', 'metrics', 'debug']);
                }
            }
        });

        it('should handle user input validation', () => {
            // ユーザー入力のような動的データの検証
            const userInput: unknown = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
                hobbies: ['reading', 'coding', 'gaming'],
                avatar: Buffer.from('fake-image-data')
            };

            if (typeof userInput === 'object' && userInput !== null) {
                const input = userInput as Record<string, unknown>;

                // 名前の検証
                if (isString(input.name)) {
                    const name = validateString(input.name);
                    expect(name).toBe('John Doe');
                }

                // メールの検証
                if (isString(input.email)) {
                    const email = validateString(input.email);
                    expect(email).toBe('john@example.com');
                }

                // 趣味の検証
                if (isArray(input.hobbies)) {
                    const hobbies = validateArray<string>(input.hobbies);
                    expect(hobbies).toEqual(['reading', 'coding', 'gaming']);
                }

                // アバターの検証
                if (isBuffer(input.avatar)) {
                    const avatar = validateBuffer(input.avatar);
                    expect(avatar.toString()).toBe('fake-image-data');
                }
            }
        });

        it('should handle file data validation', () => {
            // ファイルデータのようなバイナリデータの検証
            const fileData: unknown = {
                filename: 'document.pdf',
                content: Buffer.from('PDF content here'),
                size: 1024,
                type: 'application/pdf',
                metadata: {
                    author: 'John Doe',
                    created: '2023-01-01T00:00:00Z',
                    tags: ['document', 'pdf', 'important']
                }
            };

            if (typeof fileData === 'object' && fileData !== null) {
                const file = fileData as Record<string, unknown>;

                // ファイル名の検証
                if (isString(file.filename)) {
                    const filename = validateString(file.filename);
                    expect(filename).toBe('document.pdf');
                }

                // コンテンツの検証
                if (isBuffer(file.content)) {
                    const content = validateBuffer(file.content);
                    expect(content.toString()).toBe('PDF content here');
                }

                // メタデータの検証
                if (typeof file.metadata === 'object' && file.metadata !== null) {
                    const metadata = file.metadata as Record<string, unknown>;

                    if (isString(metadata.author)) {
                        const author = validateString(metadata.author);
                        expect(author).toBe('John Doe');
                    }

                    if (isArray(metadata.tags)) {
                        const tags = validateArray<string>(metadata.tags);
                        expect(tags).toEqual(['document', 'pdf', 'important']);
                    }
                }
            }
        });

        it('should handle log data validation', () => {
            // ログデータのような構造化データの検証
            const logData: unknown = {
                level: 'info',
                message: 'User login successful',
                timestamp: '2023-01-01T00:00:00Z',
                userId: 12345,
                metadata: {
                    ip: '192.168.1.1',
                    userAgent: 'Mozilla/5.0...',
                    sessionId: 'sess_abc123'
                },
                tags: ['auth', 'login', 'success']
            };

            if (typeof logData === 'object' && logData !== null) {
                const log = logData as Record<string, unknown>;

                // レベルとメッセージの検証
                if (isString(log.level)) {
                    const level = validateString(log.level);
                    expect(level).toBe('info');
                }

                if (isString(log.message)) {
                    const message = validateString(log.message);
                    expect(message).toBe('User login successful');
                }

                // タグの検証
                if (isArray(log.tags)) {
                    const tags = validateArray<string>(log.tags);
                    expect(tags).toEqual(['auth', 'login', 'success']);
                }
            }
        });
    });

    describe('Error handling integration', () => {
        it('should handle validation errors gracefully', () => {
            const invalidData: unknown = {
                name: 123, // 文字列ではない
                items: 'not an array', // 配列ではない
                data: 'not a buffer' // Bufferではない
            };

            if (typeof invalidData === 'object' && invalidData !== null) {
                const data = invalidData as Record<string, unknown>;

                // 型ガードでチェックしてからバリデーション
                if (isString(data.name)) {
                    // これは実行されない
                    validateString(data.name);
                } else {
                    // 型が合わない場合は適切に処理
                    expect(isString(data.name)).toBe(false);
                }

                if (isArray(data.items)) {
                    // これは実行されない
                    validateArray(data.items);
                } else {
                    // 型が合わない場合は適切に処理
                    expect(isArray(data.items)).toBe(false);
                }

                if (isBuffer(data.data)) {
                    // これは実行されない
                    validateBuffer(data.data);
                } else {
                    // 型が合わない場合は適切に処理
                    expect(isBuffer(data.data)).toBe(false);
                }
            }
        });
    });

    describe('Performance integration', () => {
        it('should handle high-frequency type checking', () => {
            const startTime = performance.now();

            // 高頻度で型チェックを実行
            for (let i = 0; i < 1000; i++) {
                const value: unknown = i % 2 === 0 ? `string${i}` : [i, i + 1, i + 2];

                if (isString(value)) {
                    validateString(value);
                } else if (isArray(value)) {
                    validateArray<number>(value);
                }
            }

            const endTime = performance.now();
            const executionTime = endTime - startTime;

            expect(executionTime).toBeLessThan(100); // 100ms以内
        });

        it('should handle memory efficiently in continuous operations', () => {
            // 連続操作でのメモリ効率性を確認
            for (let batch = 0; batch < 10; batch++) {
                const batchData = Array.from({ length: 100 }, (_, i) => ({
                    id: i,
                    name: `item${i}`,
                    data: Buffer.from(`data${i}`)
                }));

                batchData.forEach(item => {
                    if (isString(item.name)) {
                        validateString(item.name);
                    }
                    if (isBuffer(item.data)) {
                        validateBuffer(item.data);
                    }
                });
            }
        });
    });

    describe('Type safety integration', () => {
        it('should maintain type safety across functions', () => {
            const processString = (value: unknown): string | null => {
                if (isString(value)) {
                    return validateString(value);
                }
                return null;
            };

            const processArray = <T>(value: unknown): T[] | null => {
                if (isArray(value)) {
                    return validateArray<T>(value);
                }
                return null;
            };

            const processBuffer = (value: unknown): Buffer | null => {
                if (isBuffer(value)) {
                    return validateBuffer(value);
                }
                return null;
            };

            // 型安全な処理
            expect(processString('hello')).toBe('hello');
            expect(processString(123)).toBe(null);

            expect(processArray<number>([1, 2, 3])).toEqual([1, 2, 3]);
            expect(processArray<number>('not array')).toBe(null);

            expect(processBuffer(Buffer.from('test'))).toEqual(Buffer.from('test'));
            expect(processBuffer('not buffer')).toBe(null);
        });
    });
});
