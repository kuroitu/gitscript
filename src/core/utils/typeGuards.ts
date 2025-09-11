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
 * 値がnumberかどうかをチェックする
 * @param value チェックする値
 * @returns numberの場合true
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * 値がbooleanかどうかをチェックする
 * @param value チェックする値
 * @returns booleanの場合true
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * 値がbigintかどうかをチェックする
 * @param value チェックする値
 * @returns bigintの場合true
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

/**
 * 値がsymbolかどうかをチェックする
 * @param value チェックする値
 * @returns symbolの場合true
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

/**
 * 値がfunctionかどうかをチェックする
 * @param value チェックする値
 * @returns functionの場合true
 */
export function isFunction(
  value: unknown,
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * 値がnullかどうかをチェックする
 * @param value チェックする値
 * @returns nullの場合true
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * 値がundefinedかどうかをチェックする
 * @param value チェックする値
 * @returns undefinedの場合true
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * 値がnullまたはundefinedかどうかをチェックする
 * @param value チェックする値
 * @returns nullまたはundefinedの場合true
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value);
}

/**
 * 値がプリミティブ型かどうかをチェックする
 * @param value チェックする値
 * @returns プリミティブ型の場合true
 */
export function isPrimitive(value: unknown): boolean {
  return (!isObject(value) && !isFunction(value)) || isNull(value);
}

/**
 * 値がオブジェクトかどうかをチェックする
 * @param value チェックする値
 * @returns オブジェクトの場合true
 */
export function isObject(value: unknown): value is object {
  return typeof value === 'object' && !isNull(value);
}

/**
 * 値がネイティブエラーかどうかをチェックする
 * @param value チェックする値
 * @returns ネイティブエラーの場合true
 */
export function isNativeError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * 値がDateオブジェクトかどうかをチェックする
 * @param value チェックする値
 * @returns Dateオブジェクトの場合true
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

/**
 * 値がMapオブジェクトかどうかをチェックする
 * @param value チェックする値
 * @returns Mapオブジェクトの場合true
 */
export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

/**
 * 値がSetオブジェクトかどうかをチェックする
 * @param value チェックする値
 * @returns Setオブジェクトの場合true
 */
export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}

/**
 * 値がRegExpオブジェクトかどうかをチェックする
 * @param value チェックする値
 * @returns RegExpオブジェクトの場合true
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
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
