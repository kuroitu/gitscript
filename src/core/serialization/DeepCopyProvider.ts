/**
 * 深いコピー機能
 *
 * JavaScriptオブジェクトの深いコピーを提供し、
 * 循環参照や特殊な型も適切に処理する
 */

import { detectDataType } from '@/core/serialization/DataTypeDetector';
import { SerializationError } from '@/core/serialization/JsonProvider';
import {
  CircularReferenceHandling,
  DeepCopyOptions,
  DeepCopyResult,
  FunctionHandling,
  SymbolHandling,
} from '@/core/serialization/types';
import {
  isArray,
  isBigInt,
  isBuffer,
  isFunction,
  isNullOrUndefined,
  isObject,
  isPrimitive,
  isSymbol,
} from '@/core/utils';
import { isDate, isMap, isNativeError, isRegExp, isSet } from 'util/types';

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

  // デフォルトオプションを設定
  const defaultOptions: DeepCopyOptions = {
    circularReferenceHandling: CircularReferenceHandling.ignore,
    functionHandling: FunctionHandling.ignore,
    symbolHandling: SymbolHandling.ignore,
    ...options,
  };

  try {
    const visited = new WeakMap<object, unknown>();
    const copied = copyValue(obj, visited, defaultOptions);
    const duration = performance.now() - startTime;

    return {
      data: copied as T,
      typeInfo: detectDataType(copied),
      duration,
    };
  } catch (error) {
    throw new SerializationError(
      `Failed to deep copy object: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
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
  if (isNullOrUndefined(value)) {
    return value;
  }

  // BigInt
  if (isBigInt(value)) {
    return value;
  }

  // Symbol
  if (isSymbol(value)) {
    return handleSymbol(value, options);
  }

  // プリミティブ型（string, number, boolean）
  if (isPrimitive(value)) {
    return value;
  }

  // Function
  if (isFunction(value)) {
    return handleFunction(value as (...args: unknown[]) => unknown, options);
  }

  // Buffer
  if (isBuffer(value)) {
    return Buffer.from(value);
  }

  // Date
  if (isDate(value)) {
    return new Date(value.getTime());
  }

  // RegExp
  if (isRegExp(value)) {
    return new RegExp(value.source, value.flags);
  }

  // Array
  if (isArray(value)) {
    return copyArray(value, visited, options);
  }

  // Set
  if (isSet(value)) {
    return copySet(value, visited, options);
  }

  // Map
  if (isMap(value)) {
    return copyMap(value, visited, options);
  }

  // 通常のオブジェクト
  if (isObject(value)) {
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
  switch (options.symbolHandling || SymbolHandling.ignore) {
    case SymbolHandling.error:
      throw new SerializationError('Symbol values cannot be copied');
    case SymbolHandling.replace:
      return '[Symbol]';
    case SymbolHandling.ignore:
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
  switch (options.functionHandling || FunctionHandling.ignore) {
    case FunctionHandling.error:
      throw new SerializationError('Function values cannot be copied');
    case FunctionHandling.replace:
      return '[Function]';
    case FunctionHandling.ignore:
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

  const copied: Record<string | symbol, unknown> = {};
  visited.set(obj, copied);

  // 通常のプロパティをコピー
  for (const [key, value] of Object.entries(obj)) {
    copied[key] = copyValue(value, visited, options);
  }

  // シンボルプロパティをコピー
  for (const symbolKey of Object.getOwnPropertySymbols(obj)) {
    const value = (obj as Record<string | symbol, unknown>)[symbolKey];
    copied[symbolKey] = copyValue(value, visited, options);
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
  switch (
    options.circularReferenceHandling ||
    CircularReferenceHandling.ignore
  ) {
    case CircularReferenceHandling.error:
      throw new SerializationError('Circular reference detected');
    case CircularReferenceHandling.replace:
      return '[Circular Reference]';
    case CircularReferenceHandling.ignore:
    default:
      return value;
  }
}
