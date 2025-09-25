/**
 * 深いコピー機能
 *
 * lodashのcloneDeepを使用してJavaScriptオブジェクトの深いコピーを提供し、
 * 循環参照や特殊な型も適切に処理する
 */

import { cloneDeep } from 'lodash';
import { detectDataType } from '@/core/serialization/detector';
import { SerializationError } from '@/core/serialization/errors';
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
  isDate,
  isFunction,
  isMap,
  isNativeError,
  isNullOrUndefined,
  isObject,
  isPrimitive,
  isRegExp,
  isSet,
  isSymbol,
} from '@/core/utils';

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
    // 循環参照検出用のWeakMap
    const visited = new WeakMap<object, unknown>();
    
    // 特殊な型の事前チェックと循環参照処理
    const preprocessedObj = preprocessValue(obj, defaultOptions, visited);
    
    // lodashのcloneDeepを使用
    const copied = cloneDeep(preprocessedObj);
    
    // Set/Mapを元の型に復元（新しいvisitedマップを使用）
    const restoreVisited = new WeakMap<object, unknown>();
    const restored = restoreSpecialTypes(copied, obj, defaultOptions, restoreVisited);
    const duration = performance.now() - startTime;

    return {
      data: restored as T,
      typeInfo: detectDataType(restored),
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
 * 値の前処理を実行する（lodashのcloneDeepで処理できない型を変換）
 * @param value 前処理する値
 * @param options コピーオプション
 * @param visited 訪問済みオブジェクトのマップ
 * @returns 前処理された値
 */
function preprocessValue(
  value: unknown,
  options: DeepCopyOptions,
  visited: WeakMap<object, unknown>,
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
    return { __type__: 'Buffer', data: Array.from(value) };
  }

  // Date
  if (isDate(value)) {
    return { __type__: 'Date', value: value.getTime() };
  }

  // RegExp
  if (isRegExp(value)) {
    return { __type__: 'RegExp', source: value.source, flags: value.flags };
  }

  // Set
  if (isSet(value)) {
    return setToObject(value, options, visited);
  }

  // Map
  if (isMap(value)) {
    return mapToObject(value, options, visited);
  }

  // Array
  if (isArray(value)) {
    // 循環参照チェック
    if (visited.has(value)) {
      return handleCircularReference(visited.get(value), options);
    }

    const processed: Record<string, unknown> = { __type__: 'Array' };
    visited.set(value, processed);
    
    for (let i = 0; i < value.length; i++) {
      processed[i.toString()] = preprocessValue(value[i], options, visited);
    }
    
    return processed;
  }

  // 通常のオブジェクト
  if (isObject(value)) {
    // 循環参照チェック
    if (visited.has(value)) {
      return handleCircularReference(visited.get(value), options);
    }

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
 * Setをオブジェクトに変換する
 * @param set 変換するSet
 * @param options コピーオプション
 * @param visited 訪問済みオブジェクトのマップ
 * @returns 変換されたオブジェクト
 */
function setToObject(
  set: Set<unknown>,
  options: DeepCopyOptions,
  visited: WeakMap<object, unknown>,
): Record<string, unknown> {
  // 循環参照チェック
  if (visited.has(set)) {
    return handleCircularReference(visited.get(set), options) as Record<string, unknown>;
  }

  const obj: Record<string, unknown> = { __type__: 'Set' };
  visited.set(set, obj);
  
  let index = 0;
  for (const item of set) {
    obj[`item_${index}`] = preprocessValue(item, options, visited);
    index++;
  }
  
  return obj;
}

/**
 * Mapをオブジェクトに変換する
 * @param map 変換するMap
 * @param options コピーオプション
 * @param visited 訪問済みオブジェクトのマップ
 * @returns 変換されたオブジェクト
 */
function mapToObject(
  map: Map<unknown, unknown>,
  options: DeepCopyOptions,
  visited: WeakMap<object, unknown>,
): Record<string, unknown> {
  // 循環参照チェック
  if (visited.has(map)) {
    return handleCircularReference(visited.get(map), options) as Record<string, unknown>;
  }

  const obj: Record<string, unknown> = { __type__: 'Map' };
  visited.set(map, obj);
  
  for (const [key, value] of map) {
    const keyStr = typeof key === 'string' ? key : `key_${String(key)}`;
    obj[keyStr] = preprocessValue(value, options, visited);
  }
  
  return obj;
}

/**
 * 特殊な型を復元する
 * @param copied コピーされたオブジェクト
 * @param original 元のオブジェクト
 * @param options コピーオプション
 * @returns 復元されたオブジェクト
 */
function restoreSpecialTypes(
  copied: unknown,
  original: unknown,
  options: DeepCopyOptions,
  visited: WeakMap<object, unknown> = new WeakMap<object, unknown>(),
): unknown {
  // 循環参照チェック
  if (isObject(original) && visited.has(original)) {
    return handleCircularReference(visited.get(original), options);
  }

  if (isObject(copied)) {
    const copiedObj = copied as Record<string, unknown>;

    // Dateの復元
    if (copiedObj.__type__ === 'Date' && typeof copiedObj.value === 'number') {
      return new Date(copiedObj.value);
    }

    // RegExpの復元
    if (copiedObj.__type__ === 'RegExp' && 
        typeof copiedObj.source === 'string' && 
        typeof copiedObj.flags === 'string') {
      return new RegExp(copiedObj.source, copiedObj.flags);
    }

    // Bufferの復元
    if (copiedObj.__type__ === 'Buffer' && Array.isArray(copiedObj.data)) {
      return Buffer.from(copiedObj.data as number[]);
    }

    // Arrayの復元
    if (copiedObj.__type__ === 'Array' && isArray(original)) {
      const restoredArray: unknown[] = [];
      for (let i = 0; i < (original as unknown[]).length; i++) {
        const key = i.toString();
        if (key in copiedObj) {
          restoredArray[i] = restoreSpecialTypes(
            copiedObj[key], 
            (original as unknown[])[i], 
            options, 
            visited
          );
        }
      }
      return restoredArray;
    }

    // Setの復元
    if (copiedObj.__type__ === 'Set' && isSet(original)) {
      const restoredSet = new Set<unknown>();
      for (const [key, value] of Object.entries(copiedObj)) {
        if (key.startsWith('item_')) {
          const index = parseInt(key.slice(5), 10);
          const originalItem = Array.from(original)[index];
          restoredSet.add(restoreSpecialTypes(value, originalItem, options, visited));
        }
      }
      return restoredSet;
    }

    // Mapの復元
    if (copiedObj.__type__ === 'Map' && isMap(original)) {
      const restoredMap = new Map<unknown, unknown>();
      for (const [key, value] of Object.entries(copiedObj)) {
        if (key !== '__type__') {
          const originalKey = key.startsWith('key_') ? key.slice(4) : key;
          const originalValue = original.get(originalKey);
          restoredMap.set(originalKey, restoreSpecialTypes(value, originalValue, options, visited));
        }
      }
      return restoredMap;
    }

    // 通常のオブジェクトの再帰処理
    if (isObject(original)) {
      const originalObj = original as Record<string | symbol, unknown>;
      const restored: Record<string | symbol, unknown> = {};
      visited.set(original, restored);
      
      for (const [key, value] of Object.entries(copiedObj)) {
        if (key !== '__type__') {
          const originalValue = originalObj[key];
          restored[key] = restoreSpecialTypes(value, originalValue, options, visited);
        }
      }

      // シンボルプロパティの復元
      for (const symbolKey of Object.getOwnPropertySymbols(originalObj)) {
        const value = copiedObj[symbolKey as unknown as string];
        if (value !== undefined) {
          const originalValue = originalObj[symbolKey];
          restored[symbolKey] = restoreSpecialTypes(value, originalValue, options, visited);
        }
      }

      return restored;
    }
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

