/**
 * Hash モジュール用のテストヘルパー
 * 
 * 共通のテストデータとユーティリティ関数を提供
 */

import { expect } from "vitest";

/**
 * 有効なハッシュのテストデータ
 */
export const VALID_HASHES = {
    sha1_1: 'a1b2c3d4e5f6789012345678901234567890abcd',
    sha1_2: 'b2c3d4e5f6789012345678901234567890abcde1',
    sha1_3: 'c3d4e5f6789012345678901234567890abcdef12',
    uppercase: 'A1B2C3D4E5F6789012345678901234567890ABCD',
    lowercase: 'a1b2c3d4e5f6789012345678901234567890abcd',
} as const;

/**
 * 無効なハッシュのテストデータ
 */
export const INVALID_HASHES = {
    tooShort: 'a1b2c3',
    tooLong: 'a1b2c3d4e5f6789012345678901234567890abcdef',
    invalidChar: 'g1b2c3d4e5f6789012345678901234567890abcd',
    withSpace: 'a1b2c3d4e5f6789012345678901234567890abcd ',
    empty: '',
    nonString: 123,
    null: null,
    undefined: undefined,
} as const;

/**
 * 短縮ハッシュのテストデータ
 */
export const SHORT_HASHES = {
    valid4: 'a1b2',
    valid7: 'a1b2c3d',
    valid10: 'a1b2c3d4e5',
    tooShort: 'abc',
    tooLong: 'a1b2c3d4e5f6789012345678901234567890abcdef',
    invalidChar: 'g1b2c3',
} as const;

/**
 * テスト用の文字列データ
 */
export const TEST_STRINGS = {
    simple: 'Hello, World!',
    empty: '',
    unicode: 'Hello 世界 🌍',
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    newlines: 'line1\nline2\tline3\r\nline4',
    long: 'a'.repeat(10000),
} as const;

/**
 * テスト用のオブジェクトデータ
 */
export const TEST_OBJECTS = {
    simple: { name: 'test', value: 123 },
    complex: {
        string: 'test',
        number: 123,
        boolean: true,
        null: null,
        undefined: undefined,
        array: [1, 2, 3],
        nested: { key: 'value' }
    },
    withFunction: {
        name: 'test',
        func: () => 'hello'
    },
    circular: (() => {
        const obj: { name: string; self: unknown } = { name: 'test', self: null };
        obj.self = obj;
        return obj;
    })(),
} as const;

/**
 * テスト用の配列データ
 */
export const TEST_ARRAYS = {
    simple: ['part1', 'part2', 'part3'],
    empty: [],
    single: ['single'],
    withEmpty: ['', 'test', ''],
    mixed: ['a', 'b', 'c'],
    reversed: ['c', 'b', 'a'],
};

/**
 * テスト用のバッファデータ
 */
export const TEST_BUFFERS = {
    simple: Buffer.from('test content', 'utf8'),
    empty: Buffer.alloc(0),
    binary: Buffer.from([0x00, 0x01, 0x02, 0x03]),
} as const;

/**
 * ハッシュの形式を検証するヘルパー関数
 */
export function expectValidHash(hash: string): void {
    expect(hash).toMatch(/^[a-f0-9]{40}$/i);
}

/**
 * ハッシュの配列の形式を検証するヘルパー関数
 */
export function expectValidHashes(hashes: string[]): void {
    hashes.forEach(hash => expectValidHash(hash));
}

/**
 * エラーメッセージの部分一致をテストするヘルパー関数
 */
export function expectToThrowWithMessage(
    fn: () => void,
    expectedMessage: string
): void {
    expect(fn).toThrow(expectedMessage);
}


/**
 * ハッシュエラーメッセージをテストするヘルパー関数
 * エラーメッセージの変更に柔軟に対応
 */
export function expectInvalidHashError(
    fn: () => void,
    hash?: string
): void {
    if (hash) {
        // ハッシュが指定されている場合は、そのハッシュが含まれることを確認
        expect(fn).toThrow(hash);
    } else {
        // ハッシュが指定されていない場合は、InvalidHashErrorが投げられることを確認
        expect(fn).toThrow();
    }
}

/**
 * シリアライゼーションエラーメッセージをテストするヘルパー関数
 * エラーメッセージの変更に柔軟に対応
 */
export function expectSerializationError(fn: () => void): void {
    expect(fn).toThrow();
}

/**
 * 型エラーメッセージをテストするヘルパー関数
 * エラーメッセージの変更に柔軟に対応
 */
export function expectTypeError(
    fn: () => void,
    expectedType?: string,
    parameterName?: string
): void {
    expect(fn).toThrow();

    // オプションで部分的なメッセージチェック
    if (expectedType) {
        expect(fn).toThrow(expectedType);
    }
    if (parameterName) {
        expect(fn).toThrow(parameterName);
    }
}

/**
 * 引数エラーメッセージをテストするヘルパー関数
 * エラーメッセージの変更に柔軟に対応
 */
export function expectArgumentError(
    fn: () => void,
    parameterName?: string
): void {
    expect(fn).toThrow();

    // オプションでパラメータ名のチェック
    if (parameterName) {
        expect(fn).toThrow(parameterName);
    }
}

/**
 * エラータイプをテストするヘルパー関数
 * エラーメッセージの内容ではなく、エラーの種類をテスト
 */
export function expectErrorType<T extends Error>(
    fn: () => void,
    errorClass: new (...args: unknown[]) => T
): void {
    expect(fn).toThrow(errorClass);
}

/**
 * エラーメッセージの部分一致をテストするヘルパー関数
 * 完全なメッセージではなく、重要な部分のみをテスト
 */
export function expectErrorMessageContains(
    fn: () => void,
    ...keywords: string[]
): void {
    expect(fn).toThrow();

    // 各キーワードがエラーメッセージに含まれることを確認
    keywords.forEach(keyword => {
        expect(fn).toThrow(keyword);
    });
}

/**
 * エラーメッセージのパターンマッチをテストするヘルパー関数
 * 正規表現を使用してエラーメッセージをテスト
 */
export function expectErrorMessageMatches(
    fn: () => void,
    pattern: RegExp
): void {
    expect(fn).toThrow(pattern);
}

/**
 * 大量のハッシュデータを生成するヘルパー関数
 */
export function generateLargeHashArray(size: number): string[] {
    return Array.from({ length: size }, (_, i) =>
        `a${i.toString().padStart(39, '0')}`
    );
}

/**
 * 重複を含むハッシュ配列を生成するヘルパー関数
 */
export function generateHashArrayWithDuplicates(): string[] {
    return [
        VALID_HASHES.sha1_1,
        VALID_HASHES.sha1_2,
        VALID_HASHES.sha1_1, // 重複
        VALID_HASHES.sha1_3,
        VALID_HASHES.sha1_1, // 重複
    ];
}

/**
 * パラメータ化テスト用のヘルパー関数
 * 複数のテストケースを一度に実行
 */
export function runParameterizedTests<T>(
    testCases: {
        name: string;
        input: T;
        expected?: unknown;
        shouldThrow?: boolean;
        expectedError?: string;
    }[],
    testFn: (input: T) => unknown,
    assertionFn: (result: unknown, expected: unknown, testCase: unknown) => void
): void {
    testCases.forEach((testCase) => {
        if (testCase.shouldThrow) {
            expect(() => testFn(testCase.input)).toThrow(testCase.expectedError);
        } else {
            const result = testFn(testCase.input);
            assertionFn(result, testCase.expected, testCase);
        }
    });
}

/**
 * ハッシュ関数用のパラメータ化テストヘルパー
 */
export function runHashTests(
    testCases: {
        name: string;
        input: string;
        expectedHash?: string;
    }[],
    hashFn: (input: string) => string
): void {
    testCases.forEach((testCase) => {
        const result = hashFn(testCase.input);
        expectValidHash(result);
        if (testCase.expectedHash) {
            expect(result).toBe(testCase.expectedHash);
        }
    });
}

/**
 * バリデーション関数用のパラメータ化テストヘルパー
 */
export function runValidationTests<T>(
    testCases: {
        name: string;
        input: T;
        expected: boolean;
    }[],
    validationFn: (input: T) => boolean
): void {
    testCases.forEach((testCase) => {
        const result = validationFn(testCase.input);
        expect(result).toBe(testCase.expected);
    });
}

/**
 * テストケース生成用のヘルパー関数
 */
export function generateTestCases<T, R>(
    inputs: T[],
    expectedResults: R[],
    testNameGenerator?: (input: T, index: number) => string
): { name: string; input: T; expected: R }[] {
    return inputs.map((input, index) => ({
        name: testNameGenerator ? testNameGenerator(input, index) : `test case ${index + 1}`,
        input,
        expected: expectedResults[index],
    }));
}

/**
 * バリデーション用のテストケースセット
 */
export const VALIDATION_TEST_CASES = {
    validHashes: [
        { name: 'lowercase hash', input: VALID_HASHES.sha1_1, expected: true },
        { name: 'uppercase hash', input: VALID_HASHES.uppercase, expected: true },
        { name: 'mixed case hash', input: 'A1B2c3d4e5f6789012345678901234567890abcd', expected: true },
    ],
    invalidHashes: [
        { name: 'too short', input: INVALID_HASHES.tooShort, expected: false },
        { name: 'too long', input: INVALID_HASHES.tooLong, expected: false },
        { name: 'invalid char', input: INVALID_HASHES.invalidChar, expected: false },
        { name: 'with space', input: INVALID_HASHES.withSpace, expected: false },
        { name: 'empty string', input: INVALID_HASHES.empty, expected: false },
    ],
    shortHashes: [
        { name: 'valid 4 chars', input: SHORT_HASHES.valid4, expected: true },
        { name: 'valid 7 chars', input: SHORT_HASHES.valid7, expected: true },
        { name: 'valid 10 chars', input: SHORT_HASHES.valid10, expected: true },
        { name: 'too short', input: SHORT_HASHES.tooShort, expected: false },
        { name: 'too long', input: SHORT_HASHES.tooLong, expected: false },
        { name: 'invalid char', input: SHORT_HASHES.invalidChar, expected: false },
    ],
};

/**
 * ハッシュ計算用のテストケースセット
 */
export const HASH_CALCULATION_TEST_CASES = {
    strings: [
        { name: 'simple string', input: TEST_STRINGS.simple },
        { name: 'empty string', input: TEST_STRINGS.empty },
        { name: 'unicode string', input: TEST_STRINGS.unicode },
        { name: 'special chars', input: TEST_STRINGS.specialChars },
        { name: 'newlines', input: TEST_STRINGS.newlines },
        { name: 'long string', input: TEST_STRINGS.long },
    ],
    objects: [
        { name: 'simple object', input: TEST_OBJECTS.simple },
        { name: 'complex object', input: TEST_OBJECTS.complex },
        { name: 'object with function', input: TEST_OBJECTS.withFunction },
    ],
    arrays: [
        { name: 'simple array', input: TEST_ARRAYS.simple },
        { name: 'empty array', input: TEST_ARRAYS.empty },
        { name: 'single element', input: TEST_ARRAYS.single },
        { name: 'with empty strings', input: TEST_ARRAYS.withEmpty },
    ],
    buffers: [
        { name: 'simple buffer', input: TEST_BUFFERS.simple },
        { name: 'empty buffer', input: TEST_BUFFERS.empty },
        { name: 'binary buffer', input: TEST_BUFFERS.binary },
    ],
};
