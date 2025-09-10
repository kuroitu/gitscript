import { calculateSha1, calculateSha1FromMultiple, isCryptoAvailable } from '@/core/crypto/CryptoProvider';
import {
    ENCODING_TEST_CASES,
    EXPECTED_HASHES,
    KNOWN_HASH_TEST_CASES,
    SEPARATOR_TEST_CASES,
    TEST_ARRAYS,
    TEST_BUFFERS,
    TEST_STRINGS,
    expectValidHash,
    generateLargeArray,
    generateLargeBuffer,
    generateLargeString,
    measureExecutionTime,
    runParameterizedTests
} from '@tests/core/crypto/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Crypto Provider Functions', () => {
    describe('calculateSha1', () => {
        it('should calculate SHA-1 hash for string', () => {
            const hash = calculateSha1(TEST_STRINGS.simple);
            expectValidHash(hash);
        });

        it('should calculate SHA-1 hash for Buffer', () => {
            const hash = calculateSha1(TEST_BUFFERS.simple);
            expectValidHash(hash);
        });

        it('should produce consistent hashes for same input', () => {
            const hash1 = calculateSha1(TEST_STRINGS.simple);
            const hash2 = calculateSha1(TEST_STRINGS.simple);
            expect(hash1).toBe(hash2);
        });

        it('should produce different hashes for different inputs', () => {
            const hash1 = calculateSha1(TEST_STRINGS.simple);
            const hash2 = calculateSha1(TEST_STRINGS.unicode);
            expect(hash1).not.toBe(hash2);
        });

        it('should handle empty string', () => {
            const hash = calculateSha1(TEST_STRINGS.empty);
            expectValidHash(hash);
            expect(hash).toBe(EXPECTED_HASHES.emptyString);
        });

        it('should handle empty buffer', () => {
            const hash = calculateSha1(TEST_BUFFERS.empty);
            expectValidHash(hash);
        });

        // 既知のハッシュ値のテスト
        runParameterizedTests(
            KNOWN_HASH_TEST_CASES,
            calculateSha1,
            (result, expected) => {
                expectValidHash(result);
                expect(result).toBe(expected);
            }
        );

        // エンコーディングテスト
        it('should handle different encodings', () => {
            const testString = 'hello world';

            ENCODING_TEST_CASES.forEach(({ encoding }) => {
                const hash = calculateSha1(testString, encoding);
                expectValidHash(hash);
            });
        });

        // 特殊エンコーディングテスト（hexエンコーディング用の適切なデータ）
        it('should handle special encodings with appropriate data', () => {
            const base64Data = 'SGVsbG8gV29ybGQ='; // "Hello World" in base64
            const hexData = '48656c6c6f20576f726c64'; // "Hello World" in hex

            const base64Hash = calculateSha1(base64Data, 'base64');
            const hexHash = calculateSha1(hexData, 'hex');

            expectValidHash(base64Hash);
            expectValidHash(hexHash);
        });

        it('should handle unicode strings', () => {
            const hash = calculateSha1(TEST_STRINGS.unicode);
            expectValidHash(hash);
        });

        it('should handle special characters', () => {
            const hash = calculateSha1(TEST_STRINGS.specialChars);
            expectValidHash(hash);
        });

        it('should handle newlines and tabs', () => {
            const hash = calculateSha1(TEST_STRINGS.newlines);
            expectValidHash(hash);
        });

        it('should handle null characters', () => {
            const hash = calculateSha1(TEST_STRINGS.nullChar);
            expectValidHash(hash);
        });

        it('should handle binary data', () => {
            const hash = calculateSha1(TEST_BUFFERS.binary);
            expectValidHash(hash);
        });

        it('should handle large strings efficiently', () => {
            const largeString = generateLargeString(1000000); // 1MB

            const executionTime = measureExecutionTime(() => {
                const hash = calculateSha1(largeString);
                expectValidHash(hash);
            });

            expect(executionTime).toBeLessThan(1000); // 1秒以内
        });

        it('should handle large buffers efficiently', () => {
            const largeBuffer = generateLargeBuffer(1000000); // 1MB

            const executionTime = measureExecutionTime(() => {
                const hash = calculateSha1(largeBuffer);
                expectValidHash(hash);
            });

            expect(executionTime).toBeLessThan(1000); // 1秒以内
        });
    });

    describe('calculateSha1FromMultiple', () => {
        it('should calculate hash from multiple strings', () => {
            const hash = calculateSha1FromMultiple(TEST_ARRAYS.simple);
            expectValidHash(hash);
        });

        it('should calculate hash from mixed data types', () => {
            const hash = calculateSha1FromMultiple(TEST_ARRAYS.mixed);
            expectValidHash(hash);
        });

        it('should handle empty array', () => {
            const hash = calculateSha1FromMultiple(TEST_ARRAYS.empty);
            expectValidHash(hash);
        });

        it('should handle single element array', () => {
            const hash = calculateSha1FromMultiple(TEST_ARRAYS.single);
            expectValidHash(hash);
        });

        it('should produce consistent hashes for same input', () => {
            const hash1 = calculateSha1FromMultiple(TEST_ARRAYS.simple);
            const hash2 = calculateSha1FromMultiple(TEST_ARRAYS.simple);
            expect(hash1).toBe(hash2);
        });

        it('should produce different hashes for different order', () => {
            const array1 = ['first', 'second'];
            const array2 = ['second', 'first'];

            const hash1 = calculateSha1FromMultiple(array1);
            const hash2 = calculateSha1FromMultiple(array2);

            expect(hash1).not.toBe(hash2);
        });

        it('should handle different separators', () => {
            const data = ['hello', 'world'];

            SEPARATOR_TEST_CASES.forEach(({ separator }) => {
                const hash = calculateSha1FromMultiple(data, separator);
                expectValidHash(hash);
            });
        });

        it('should handle different encodings', () => {
            const data = ['hello', 'world'];

            ENCODING_TEST_CASES.forEach(({ encoding }) => {
                const hash = calculateSha1FromMultiple(data, '\0', encoding);
                expectValidHash(hash);
            });
        });

        it('should handle special encodings with appropriate data', () => {
            const base64Data = ['SGVsbG8=', 'V29ybGQ=']; // ["Hello", "World"] in base64
            const hexData = ['48656c6c6f', '576f726c64']; // ["Hello", "World"] in hex

            const base64Hash = calculateSha1FromMultiple(base64Data, '\0', 'base64');
            // hexエンコーディングでは区切り文字もhex形式にする必要がある
            const hexHash = calculateSha1FromMultiple(hexData, '00', 'hex');

            expectValidHash(base64Hash);
            expectValidHash(hexHash);
        });

        it('should handle arrays with empty strings', () => {
            const hash = calculateSha1FromMultiple(TEST_ARRAYS.withEmpty);
            expectValidHash(hash);
        });

        it('should handle unicode arrays', () => {
            const hash = calculateSha1FromMultiple(TEST_ARRAYS.unicode);
            expectValidHash(hash);
        });

        it('should handle large arrays efficiently', () => {
            const largeArray = generateLargeArray(10000);

            const executionTime = measureExecutionTime(() => {
                const hash = calculateSha1FromMultiple(largeArray);
                expectValidHash(hash);
            });

            expect(executionTime).toBeLessThan(1000); // 1秒以内
        });

        it('should handle mixed buffer and string arrays', () => {
            const mixedArray = [
                'string1',
                Buffer.from('buffer1', 'utf8'),
                'string2',
                Buffer.from('buffer2', 'utf8')
            ];

            const hash = calculateSha1FromMultiple(mixedArray);
            expectValidHash(hash);
        });

        it('should handle custom separator correctly', () => {
            const data = ['a', 'b', 'c'];
            const separator = '|||';

            const hash = calculateSha1FromMultiple(data, separator);
            expectValidHash(hash);

            // 同じ結果が得られることを確認
            const expected = calculateSha1('a|||b|||c');
            expect(hash).toBe(expected);
        });

        it('should handle empty separator', () => {
            const data = ['a', 'b', 'c'];
            const separator = '';

            const hash = calculateSha1FromMultiple(data, separator);
            expectValidHash(hash);

            // 同じ結果が得られることを確認
            const expected = calculateSha1('abc');
            expect(hash).toBe(expected);
        });
    });

    describe('isCryptoAvailable', () => {
        it('should return true when crypto is available', () => {
            const available = isCryptoAvailable();
            expect(typeof available).toBe('boolean');
            // Node.js環境では通常trueが返される
            expect(available).toBe(true);
        });

        it('should be consistent across multiple calls', () => {
            const result1 = isCryptoAvailable();
            const result2 = isCryptoAvailable();
            expect(result1).toBe(result2);
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle very long strings', () => {
            const veryLongString = generateLargeString(10000000); // 10MB

            const executionTime = measureExecutionTime(() => {
                const hash = calculateSha1(veryLongString);
                expectValidHash(hash);
            });

            expect(executionTime).toBeLessThan(2000); // 2秒以内
        });

        it('should handle very large arrays', () => {
            const veryLargeArray = generateLargeArray(100000);

            const executionTime = measureExecutionTime(() => {
                const hash = calculateSha1FromMultiple(veryLargeArray);
                expectValidHash(hash);
            });

            expect(executionTime).toBeLessThan(2000); // 2秒以内
        });

        it('should handle single character strings', () => {
            const hash = calculateSha1(TEST_STRINGS.singleChar);
            expectValidHash(hash);
            expect(hash).toBe(EXPECTED_HASHES.singleA);
        });

        it('should handle numeric strings', () => {
            const hash = calculateSha1(TEST_STRINGS.numbers);
            expectValidHash(hash);
        });

        it('should handle mixed character strings', () => {
            const hash = calculateSha1(TEST_STRINGS.mixed);
            expectValidHash(hash);
        });

        it('should handle large binary buffers', () => {
            const largeBinaryBuffer = generateLargeBuffer(1000000);

            const executionTime = measureExecutionTime(() => {
                const hash = calculateSha1(largeBinaryBuffer);
                expectValidHash(hash);
            });

            expect(executionTime).toBeLessThan(1000); // 1秒以内
        });
    });

    describe('Performance and memory', () => {
        it('should handle multiple hash calculations efficiently', () => {
            const testData = Array.from({ length: 1000 }, (_, i) => `test${i}`);

            const executionTime = measureExecutionTime(() => {
                testData.forEach(data => {
                    const hash = calculateSha1(data);
                    expectValidHash(hash);
                });
            });

            expect(executionTime).toBeLessThan(1000); // 1秒以内
        });

        it('should handle memory efficiently with large data', () => {
            // メモリリークがないことを確認するため、複数回実行
            for (let i = 0; i < 10; i++) {
                const largeString = generateLargeString(100000);
                const hash = calculateSha1(largeString);
                expectValidHash(hash);
            }
        });

        it('should handle concurrent hash calculations', () => {
            const promises = Array.from({ length: 100 }, (_, i) =>
                Promise.resolve(calculateSha1(`concurrent${i}`))
            );

            return Promise.all(promises).then(hashes => {
                hashes.forEach(hash => {
                    expectValidHash(hash);
                });
                // すべて異なるハッシュであることを確認
                const uniqueHashes = new Set(hashes);
                expect(uniqueHashes.size).toBe(hashes.length);
            });
        });
    });
});
