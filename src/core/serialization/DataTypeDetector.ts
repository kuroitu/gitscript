/**
 * データ型検出機能
 *
 * JavaScriptオブジェクトの型を詳細に検出し、
 * シリアライゼーションに必要な情報を提供する
 */

import { DataType, DataTypeInfo } from '@/core/serialization/types';
import {
  isArray,
  isBigInt,
  isBuffer,
  isDate,
  isFunction,
  isMap,
  isNativeError,
  isNull,
  isObject,
  isPrimitive,
  isRegExp,
  isSet,
  isSymbol,
  isUndefined,
} from '@/core/utils';
import { DataTypeDetectionError } from '@/types';

/**
 * データ型を検出する
 * @param value 検出する値
 * @returns データ型情報
 */
export function detectDataType(value: unknown): DataTypeInfo {
  try {
    const typeInfo = analyzeValue(value);

    return {
      ...typeInfo,
      // パフォーマンス情報は型定義に含まれていないため、ここでは追加しない
    };
  } catch (error) {
    throw new DataTypeDetectionError(
      isNativeError(error) ? error.message : 'Unknown error',
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * 値の詳細分析を行う
 * @param value 分析する値
 * @returns データ型情報
 */
export function analyzeValue(value: unknown): DataTypeInfo {
  // null チェック
  if (isNull(value)) {
    return { type: DataType.null };
  }

  // undefined チェック
  if (isUndefined(value)) {
    return { type: DataType.undefined };
  }

  // BigInt チェック
  if (isBigInt(value)) {
    return { type: DataType.bigint };
  }

  // Symbol チェック
  if (isSymbol(value)) {
    return { type: DataType.symbol };
  }

  // プリミティブ型のチェック（string, number, boolean）
  if (isPrimitive(value)) {
    return { type: DataType.primitive };
  }

  // Function チェック
  if (isFunction(value)) {
    return {
      type: DataType.function,
      details: {
        parameterCount: value.length,
      },
    };
  }

  // Buffer チェック
  if (isBuffer(value)) {
    return {
      type: DataType.buffer,
      details: {
        bufferSize: value.length,
      },
    };
  }

  // Date チェック
  if (isDate(value)) {
    return { type: DataType.date };
  }

  // RegExp チェック
  if (isRegExp(value)) {
    return { type: DataType.regexp };
  }

  // Array チェック
  if (isArray(value)) {
    return {
      type: DataType.array,
      details: {
        elementCount: value.length,
      },
    };
  }

  // Set チェック
  if (isSet(value)) {
    return {
      type: DataType.set,
      details: {
        setSize: value.size,
      },
    };
  }

  // Map チェック
  if (isMap(value)) {
    return {
      type: DataType.map,
      details: {
        mapSize: value.size,
      },
    };
  }

  // 通常のオブジェクト
  if (isObject(value)) {
    const propertyCount = Object.keys(value).length;
    return {
      type: DataType.object,
      details: {
        propertyCount,
      },
    };
  }

  // その他の型（通常は到達しない）
  return { type: DataType.primitive };
}
