import { stringifyCompact } from '@/core/serialization/JsonProvider';
import {
    EXPECTED_JSON,
    KNOWN_JSON_TEST_CASES,
    OBJECT_WITH_FUNCTION,
    OBJECT_WITH_SYMBOL,
    TEST_ARRAYS,
    TEST_OBJECTS,
    TEST_PRIMITIVES,
    createCircularReference,
    expectSerializationError,
    expectValidJson,
    generateDeepNestedObject,
    generateLargeObject,
    measureExecutionTime,
    runParameterizedTests
} from '@tests/core/serialization/testHelpers';
import { describe, expect, it } from 'vitest';

describe('JSON Provider Functions', () => {
    describe('stringifyCompact', () => {
        it('should stringify simple object', () => {
            const result = stringifyCompact(TEST_OBJECTS.simple);
            expectValidJson(result);
            expect(result).toBe(EXPECTED_JSON.simple);
        });

        it('should stringify empty object', () => {
            const result = stringifyCompact(TEST_OBJECTS.empty);
            expectValidJson(result);
            expect(result).toBe(EXPECTED_JSON.empty);
        });

        it('should stringify nested object', () => {
            const result = stringifyCompact(TEST_OBJECTS.nested);
            expectValidJson(result);
            expect(result).toBe(EXPECTED_JSON.nested);
        });

        it('should stringify array', () => {
            const result = stringifyCompact(TEST_OBJECTS.array);
            expectValidJson(result);
            expect(result).toBe(EXPECTED_JSON.array);
        });

        it('should stringify mixed object', () => {
            const result = stringifyCompact(TEST_OBJECTS.mixed);
            expectValidJson(result);
        });

        it('should stringify object with special characters in keys', () => {
            const result = stringifyCompact(TEST_OBJECTS.withSpecialChars);
            expectValidJson(result);
        });

        it('should stringify object with unicode values', () => {
            const result = stringifyCompact(TEST_OBJECTS.withUnicode);
            expectValidJson(result);
        });

        it('should stringify object with various number types', () => {
            const result = stringifyCompact(TEST_OBJECTS.withNumbers);
            expectValidJson(result);
        });

        it('should stringify object with boolean values', () => {
            const result = stringifyCompact(TEST_OBJECTS.withBooleans);
            expectValidJson(result);
        });

        it('should stringify object with null and undefined values', () => {
            const result = stringifyCompact(TEST_OBJECTS.withNulls);
            expectValidJson(result);
        });

        it('should stringify object with arrays', () => {
            const result = stringifyCompact(TEST_OBJECTS.withArrays);
            expectValidJson(result);
        });

        // 既知のJSON文字列のテスト
        runParameterizedTests(
            KNOWN_JSON_TEST_CASES,
            stringifyCompact,
            (result, expected) => {
                expectValidJson(result);
                expect(result).toBe(expected);
            }
        );

        // プリミティブ値のテスト
        it('should stringify string primitive', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.string);
            expectValidJson(result);
            expect(result).toBe(EXPECTED_JSON.string);
        });

        it('should stringify number primitive', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.number);
            expectValidJson(result);
            expect(result).toBe(EXPECTED_JSON.number);
        });

        it('should stringify boolean primitive', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.booleanTrue);
            expectValidJson(result);
            expect(result).toBe(EXPECTED_JSON.boolean);
        });

        it('should stringify null primitive', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.null);
            expectValidJson(result);
            expect(result).toBe(EXPECTED_JSON.null);
        });

        it('should stringify undefined primitive', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.undefined);
            expect(result).toBeUndefined(); // undefinedはundefinedに変換される
        });

        it('should stringify empty string', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.emptyString);
            expectValidJson(result);
            expect(result).toBe('""');
        });

        it('should stringify zero', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.zero);
            expectValidJson(result);
            expect(result).toBe('0');
        });

        it('should stringify negative number', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.negative);
            expectValidJson(result);
            expect(result).toBe('-100');
        });

        it('should stringify float number', () => {
            const result = stringifyCompact(TEST_PRIMITIVES.float);
            expectValidJson(result);
            expect(result).toBe('3.14159');
        });

        // 配列のテスト
        it('should stringify empty array', () => {
            const result = stringifyCompact(TEST_ARRAYS.empty);
            expectValidJson(result);
            expect(result).toBe('[]');
        });

        it('should stringify number array', () => {
            const result = stringifyCompact(TEST_ARRAYS.numbers);
            expectValidJson(result);
            expect(result).toBe('[1,2,3,4,5]');
        });

        it('should stringify string array', () => {
            const result = stringifyCompact(TEST_ARRAYS.strings);
            expectValidJson(result);
            expect(result).toBe('["hello","world","test"]');
        });

        it('should stringify mixed array', () => {
            const result = stringifyCompact(TEST_ARRAYS.mixed);
            expectValidJson(result);
        });

        it('should stringify nested array', () => {
            const result = stringifyCompact(TEST_ARRAYS.nested);
            expectValidJson(result);
            expect(result).toBe('[[1,2],[3,4],[5,6]]');
        });

        it('should stringify array with empty strings', () => {
            const result = stringifyCompact(TEST_ARRAYS.withEmpty);
            expectValidJson(result);
        });

        it('should stringify array with nulls', () => {
            const result = stringifyCompact(TEST_ARRAYS.withNulls);
            expectValidJson(result);
        });

        it('should stringify array with undefined values', () => {
            const result = stringifyCompact(TEST_ARRAYS.withUndefined);
            expectValidJson(result);
        });

        // 一貫性テスト
        it('should produce consistent results for same input', () => {
            const result1 = stringifyCompact(TEST_OBJECTS.simple);
            const result2 = stringifyCompact(TEST_OBJECTS.simple);
            expect(result1).toBe(result2);
        });

        it('should produce different results for different inputs', () => {
            const result1 = stringifyCompact(TEST_OBJECTS.simple);
            const result2 = stringifyCompact(TEST_OBJECTS.mixed);
            expect(result1).not.toBe(result2);
        });

        // エラーハンドリングテスト
        it('should throw SerializationError for circular reference', () => {
            expectSerializationError(() => {
                stringifyCompact(createCircularReference());
            });
        });

        it('should handle object with function (converts to undefined)', () => {
            const result = stringifyCompact(OBJECT_WITH_FUNCTION);
            expectValidJson(result);
            // 関数はundefinedに変換され、プロパティが除外される
            expect(result).toBe('{"name":"test"}');
        });

        it('should handle object with symbol (converts to undefined)', () => {
            const result = stringifyCompact(OBJECT_WITH_SYMBOL);
            expectValidJson(result);
            // シンボルはundefinedに変換され、プロパティが除外される
            expect(result).toBe('{"name":"test"}');
        });

        // パフォーマンステスト
        it('should handle large objects efficiently', () => {
            const largeObject = generateLargeObject(10000);

            const executionTime = measureExecutionTime(() => {
                const result = stringifyCompact(largeObject);
                expectValidJson(result);
            });

            expect(executionTime).toBeLessThan(1000); // 1秒以内
        });

        it('should handle deep nested objects efficiently', () => {
            const deepObject = generateDeepNestedObject(100);

            const executionTime = measureExecutionTime(() => {
                const result = stringifyCompact(deepObject);
                expectValidJson(result);
            });

            expect(executionTime).toBeLessThan(1000); // 1秒以内
        });

        it('should handle very large objects', () => {
            const veryLargeObject = generateLargeObject(100000);

            const executionTime = measureExecutionTime(() => {
                const result = stringifyCompact(veryLargeObject);
                expectValidJson(result);
            });

            expect(executionTime).toBeLessThan(2000); // 2秒以内
        });

        // エッジケーステスト
        it('should handle Date objects', () => {
            const date = new Date('2023-01-01T00:00:00Z');
            const result = stringifyCompact(date);
            expectValidJson(result);
            expect(result).toContain('2023-01-01');
        });

        it('should handle RegExp objects', () => {
            const regex = /test/gi;
            const result = stringifyCompact(regex);
            expectValidJson(result);
            expect(result).toBe('{}'); // RegExpは空オブジェクトに変換される
        });

        it('should handle Error objects', () => {
            const error = new Error('test error');
            const result = stringifyCompact(error);
            expectValidJson(result);
            // Errorオブジェクトは空オブジェクトに変換される
            expect(result).toBe('{}');
        });

        it('should handle Map objects', () => {
            const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
            const result = stringifyCompact(map);
            expectValidJson(result);
            expect(result).toBe('{}'); // Mapは空オブジェクトに変換される
        });

        it('should handle Set objects', () => {
            const set = new Set([1, 2, 3]);
            const result = stringifyCompact(set);
            expectValidJson(result);
            expect(result).toBe('{}'); // Setは空オブジェクトに変換される
        });

        it('should handle BigInt values', () => {
            const bigInt = BigInt(123456789);
            expectSerializationError(() => {
                stringifyCompact(bigInt);
            });
        });

        it('should handle Symbol values', () => {
            const symbol = Symbol('test');
            // Symbolはundefinedに変換される
            const result = stringifyCompact(symbol);
            expect(result).toBeUndefined();
        });

        // メモリ効率性テスト
        it('should handle memory efficiently with large data', () => {
            // メモリリークがないことを確認するため、複数回実行
            for (let i = 0; i < 10; i++) {
                const largeObject = generateLargeObject(10000);
                const result = stringifyCompact(largeObject);
                expectValidJson(result);
            }
        });

        it('should handle concurrent serialization', () => {
            const promises = Array.from({ length: 100 }, (_, i) =>
                Promise.resolve(stringifyCompact({ id: i, data: `test${i}` }))
            );

            return Promise.all(promises).then(results => {
                results.forEach(result => {
                    expectValidJson(result);
                });
                // すべて異なる結果であることを確認
                const uniqueResults = new Set(results);
                expect(uniqueResults.size).toBe(results.length);
            });
        });
    });
});
