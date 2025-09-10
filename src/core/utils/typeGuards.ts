/**
 * 型ガードと型チェック用のユーティリティ関数
 * 
 * 型安全性を向上させるための型チェック関数群
 */

/**
 * 値が文字列かどうかをチェックする
 * @param value チェックする値
 * @returns 文字列の場合true
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * 値がnullまたはundefinedかどうかをチェックする
 * @param value チェックする値
 * @returns nullまたはundefinedの場合true
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

/**
 * 値が配列かどうかをチェックする
 * @param value チェックする値
 * @returns 配列の場合true
 */
export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

/**
 * 値がBufferかどうかをチェックする
 * @param value チェックする値
 * @returns Bufferの場合true
 */
export function isBuffer(value: unknown): value is Buffer {
    return Buffer.isBuffer(value);
}
