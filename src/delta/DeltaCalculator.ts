/**
 * 差分計算のルート関数
 *
 * 値の型に応じて適切な差分計算器を呼び分けます。
 */

import { isArray, isObject, isPrimitive } from '@/core/utils';
import { calculateArrayDelta } from './ArrayDeltaCalculator';
import { calculateMapDelta } from './MapDeltaCalculator';
import { calculateObjectDelta } from './ObjectDeltaCalculator';
import { calculatePrimitiveDelta } from './PrimitiveDeltaCalculator';
import { calculateSetDelta } from './SetDeltaCalculator';
import {
  DeltaCalculationOptions,
  DeltaCalculationResult,
} from '@/types';

/**
 * 値の型に応じて適切な差分計算を実行します
 *
 * @param oldValue 変更前の値
 * @param newValue 変更後の値
 * @param options 計算オプション
 * @returns 差分計算の結果
 */
export function calculateDelta(
  oldValue: unknown,
  newValue: unknown,
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  // プリミティブ値の場合
  if (isPrimitive(oldValue) && isPrimitive(newValue)) {
    return calculatePrimitiveDelta(oldValue, newValue, options);
  }

  // 配列の場合
  if (isArray(oldValue) && isArray(newValue)) {
    return calculateArrayDelta(oldValue, newValue, options);
  }

  // Setの場合
  if (oldValue instanceof Set && newValue instanceof Set) {
    return calculateSetDelta(oldValue, newValue, options);
  }

  // Mapの場合
  if (oldValue instanceof Map && newValue instanceof Map) {
    return calculateMapDelta(oldValue, newValue, options);
  }

  // オブジェクトの場合（プリミティブ以外のオブジェクト）
  if (isObject(oldValue) && isObject(newValue)) {
    return calculateObjectDelta(
      oldValue as Record<string, unknown>,
      newValue as Record<string, unknown>,
      options,
    );
  }

  // 型が異なる場合はプリミティブとして扱う
  return calculatePrimitiveDelta(oldValue, newValue, options);
}

/**
 * オブジェクトの差分を計算します（型安全版）
 *
 * @param oldObject 変更前のオブジェクト
 * @param newObject 変更後のオブジェクト
 * @param options 計算オプション
 * @returns 差分計算の結果
 */
export function calculateObjectDeltaSafe(
  oldObject: Record<string, unknown>,
  newObject: Record<string, unknown>,
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  return calculateObjectDelta(oldObject, newObject, options);
}

/**
 * 配列の差分を計算します（型安全版）
 *
 * @param oldArray 変更前の配列
 * @param newArray 変更後の配列
 * @param options 計算オプション
 * @returns 差分計算の結果
 */
export function calculateArrayDeltaSafe(
  oldArray: unknown[],
  newArray: unknown[],
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  return calculateArrayDelta(oldArray, newArray, options);
}

/**
 * Setの差分を計算します（型安全版）
 *
 * @param oldSet 変更前のSet
 * @param newSet 変更後のSet
 * @param options 計算オプション
 * @returns 差分計算の結果
 */
export function calculateSetDeltaSafe(
  oldSet: Set<unknown>,
  newSet: Set<unknown>,
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  return calculateSetDelta(oldSet, newSet, options);
}

/**
 * Mapの差分を計算します（型安全版）
 *
 * @param oldMap 変更前のMap
 * @param newMap 変更後のMap
 * @param options 計算オプション
 * @returns 差分計算の結果
 */
export function calculateMapDeltaSafe(
  oldMap: Map<unknown, unknown>,
  newMap: Map<unknown, unknown>,
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  return calculateMapDelta(oldMap, newMap, options);
}

/**
 * プリミティブ値の差分を計算します（型安全版）
 *
 * @param oldValue 変更前の値
 * @param newValue 変更後の値
 * @param options 計算オプション
 * @returns 差分計算の結果
 */
export function calculatePrimitiveDeltaSafe(
  oldValue: unknown,
  newValue: unknown,
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  return calculatePrimitiveDelta(oldValue, newValue, options);
}
