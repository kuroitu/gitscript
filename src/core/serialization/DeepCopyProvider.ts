/**
 * 深いコピー機能
 *
 * JavaScriptオブジェクトの深いコピーを提供し、
 * 循環参照や特殊な型も適切に処理する
 */

import { detectDataType } from './DataTypeDetector';
import { SerializationError } from './JsonProvider';
import { DeepCopyOptions, DeepCopyResult } from './types';

// 型の再エクスポート
export type { DeepCopyOptions, DeepCopyResult };

/**
 * オブジェクトの深いコピーを作成する
 * @param obj コピーするオブジェクト
 * @param options コピーオプション
 * @returns 深いコピーの結果
 */
export function deepCopy<T = unknown>(
  obj: T,
  options: DeepCopyOptions = {},
): DeepCopyResult<T> {
  const startTime = performance.now();

  try {
    const visited = new WeakMap<object, unknown>();
    const copied = copyValue(obj, visited, options);
    const duration = performance.now() - startTime;

    return {
      data: copied as T,
      typeInfo: detectDataType(copied),
      duration,
    };
  } catch (error) {
    throw new SerializationError(
      `Failed to deep copy object: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * 値のコピーを実行する
 * @param value コピーする値
 * @param visited 訪問済みオブジェクトのマップ
 * @param options コピーオプション
 * @returns コピーされた値
 */
function copyValue(
  value: unknown,
  visited: WeakMap<object, unknown>,
  options: DeepCopyOptions,
): unknown {
  // null または undefined
  if (value === null || value === undefined) {
    return value;
  }

  // プリミティブ型
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  // BigInt
  if (typeof value === 'bigint') {
    return value;
  }

  // Symbol
  if (typeof value === 'symbol') {
    return handleSymbol(value, options);
  }

  // Function
  if (typeof value === 'function') {
    return handleFunction(value as (...args: unknown[]) => unknown, options);
  }

  // Buffer
  if (Buffer.isBuffer(value)) {
    return Buffer.from(value);
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // Array
  if (Array.isArray(value)) {
    return copyArray(value, visited, options);
  }

  // Set
  if (value instanceof Set) {
    return copySet(value, visited, options);
  }

  // Map
  if (value instanceof Map) {
    return copyMap(value, visited, options);
  }

  // 通常のオブジェクト
  if (typeof value === 'object') {
    return copyObject(value, visited, options);
  }

  // その他の型
  return value;
}

/**
 * Symbolの処理
 * @param value Symbol値
 * @param options コピーオプション
 * @returns 処理された値
 */
function handleSymbol(value: symbol, options: DeepCopyOptions): unknown {
  switch (options.symbolHandling) {
    case 'error':
      throw new SerializationError('Symbol values cannot be copied');
    case 'replace':
      return '[Symbol]';
    case 'ignore':
    default:
      return value;
  }
}

/**
 * Functionの処理
 * @param value 関数値
 * @param options コピーオプション
 * @returns 処理された値
 */
function handleFunction(
  value: (...args: unknown[]) => unknown,
  options: DeepCopyOptions,
): unknown {
  switch (options.functionHandling) {
    case 'error':
      throw new SerializationError('Function values cannot be copied');
    case 'replace':
      return '[Function]';
    case 'ignore':
    default:
      return value;
  }
}

/**
 * 配列のコピー
 * @param arr コピーする配列
 * @param visited 訪問済みオブジェクトのマップ
 * @param options コピーオプション
 * @returns コピーされた配列
 */
function copyArray(
  arr: unknown[],
  visited: WeakMap<object, unknown>,
  options: DeepCopyOptions,
): unknown[] {
  // 循環参照チェック
  if (visited.has(arr)) {
    return [handleCircularReference(visited.get(arr), options)];
  }

  const copied: unknown[] = [];
  visited.set(arr, copied);

  for (const item of arr) {
    copied.push(copyValue(item, visited, options));
  }

  return copied;
}

/**
 * Setのコピー
 * @param set コピーするSet
 * @param visited 訪問済みオブジェクトのマップ
 * @param options コピーオプション
 * @returns コピーされたSet
 */
function copySet(
  set: Set<unknown>,
  visited: WeakMap<object, unknown>,
  options: DeepCopyOptions,
): Set<unknown> {
  // 循環参照チェック
  if (visited.has(set)) {
    return handleCircularReference(visited.get(set), options) as Set<unknown>;
  }

  const copied = new Set<unknown>();
  visited.set(set, copied);

  for (const item of set) {
    copied.add(copyValue(item, visited, options));
  }

  return copied;
}

/**
 * Mapのコピー
 * @param map コピーするMap
 * @param visited 訪問済みオブジェクトのマップ
 * @param options コピーオプション
 * @returns コピーされたMap
 */
function copyMap(
  map: Map<unknown, unknown>,
  visited: WeakMap<object, unknown>,
  options: DeepCopyOptions,
): Map<unknown, unknown> {
  // 循環参照チェック
  if (visited.has(map)) {
    return handleCircularReference(visited.get(map), options) as Map<
      unknown,
      unknown
    >;
  }

  const copied = new Map<unknown, unknown>();
  visited.set(map, copied);

  for (const [key, value] of map) {
    const copiedKey = copyValue(key, visited, options);
    const copiedValue = copyValue(value, visited, options);
    copied.set(copiedKey, copiedValue);
  }

  return copied;
}

/**
 * オブジェクトのコピー
 * @param obj コピーするオブジェクト
 * @param visited 訪問済みオブジェクトのマップ
 * @param options コピーオプション
 * @returns コピーされたオブジェクト
 */
function copyObject(
  obj: object,
  visited: WeakMap<object, unknown>,
  options: DeepCopyOptions,
): object {
  // 循環参照チェック
  if (visited.has(obj)) {
    return handleCircularReference(visited.get(obj), options) as object;
  }

  const copied: Record<string, unknown> = {};
  visited.set(obj, copied);

  for (const [key, value] of Object.entries(obj)) {
    copied[key] = copyValue(value, visited, options);
  }

  return copied;
}

/**
 * 循環参照の処理
 * @param value 循環参照の値
 * @param options コピーオプション
 * @returns 処理された値
 */
function handleCircularReference(
  value: unknown,
  options: DeepCopyOptions,
): unknown {
  switch (options.circularReferenceHandling) {
    case 'error':
      throw new SerializationError('Circular reference detected');
    case 'replace':
      return '[Circular Reference]';
    case 'ignore':
    default:
      return value;
  }
}
