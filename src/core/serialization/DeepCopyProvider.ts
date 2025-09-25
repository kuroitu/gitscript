/**
 * 深いコピー機能
 *
 * lodashのcloneDeepを使用してJavaScriptオブジェクトの深いコピーを提供し、
 * 循環参照や特殊な型も適切に処理する
 */

import { detectDataType } from '@/core/serialization/detector';
import { SerializationError } from '@/core/serialization/errors';
import {
  CircularReferenceHandling,
  DeepCopyOptions,
  DeepCopyResult,
  FunctionHandling,
  SymbolHandling,
} from '@/core/serialization/types';
import { isFunction, isNativeError, isSymbol } from '@/core/utils';
import { cloneDeep } from 'lodash';

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
    // 特殊な型の事前チェック
    const visited = new WeakMap<object, unknown>();
    const preprocessedObj = preprocessValue(obj, defaultOptions, visited);

    // lodashのcloneDeepを使用（Set/Map/Date/RegExp/Bufferもサポート）
    const copied = cloneDeep(preprocessedObj);
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
 * 値の前処理を実行する（lodashのcloneDeepで処理できない型のみ変換）
 * @param value 前処理する値
 * @param options コピーオプション
 * @returns 前処理された値
 */
function preprocessValue(
  value: unknown,
  options: DeepCopyOptions,
  visited: WeakMap<object, unknown> = new WeakMap<object, unknown>(),
): unknown {
  // null または undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Symbol
  if (isSymbol(value)) {
    return handleSymbol(value, options);
  }

  // Function
  if (isFunction(value)) {
    return handleFunction(value as (...args: unknown[]) => unknown, options);
  }

  // オブジェクトの場合、循環参照チェックと再帰処理
  if (typeof value === 'object') {
    // 循環参照チェック
    if (visited.has(value)) {
      return handleCircularReference(visited.get(value), options);
    }

    // Set/Map/Date/RegExp/Bufferはlodashが直接サポートするのでそのまま返す
    if (value instanceof Set || value instanceof Map || 
        value instanceof Date || value instanceof RegExp || 
        Buffer.isBuffer(value)) {
      return value;
    }

    // 配列の場合
    if (Array.isArray(value)) {
      const processed: unknown[] = [];
      visited.set(value, processed);
      for (const item of value) {
        processed.push(preprocessValue(item, options, visited));
      }
      return processed;
    }

    // 通常のオブジェクトの場合
    const processed: Record<string | symbol, unknown> = {};
    visited.set(value, processed);
    
    // 通常のプロパティを処理
    for (const [key, val] of Object.entries(value)) {
      processed[key] = preprocessValue(val, options, visited);
    }

    // シンボルプロパティを処理
    for (const symbolKey of Object.getOwnPropertySymbols(value)) {
      const val = (value as Record<string | symbol, unknown>)[symbolKey];
      processed[symbolKey] = preprocessValue(val, options, visited);
    }

    return processed;
  }

  // プリミティブ型はそのまま返す
  return value;
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
