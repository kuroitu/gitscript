/**
 * 差分計算のルート関数
 *
 * 値の型に応じて適切な差分計算器を呼び分けます。
 */

import { isArray, isMap, isObject, isPrimitive, isSet } from '@/core/utils';
import { calculateArrayDelta } from '@/delta/ArrayDeltaCalculator';
import { calculateMapDelta } from '@/delta/MapDeltaCalculator';
import { calculateObjectDelta } from '@/delta/ObjectDeltaCalculator';
import { calculatePrimitiveDelta } from '@/delta/PrimitiveDeltaCalculator';
import { calculateSetDelta } from '@/delta/SetDeltaCalculator';
import { MicrodiffOptions } from '@/delta/microdiff/types';
import { DeltaCalculationResult } from '@/types';

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
  options: MicrodiffOptions = {},
): DeltaCalculationResult {
  // プリミティブ値の場合
  if (isPrimitive(oldValue) && isPrimitive(newValue)) {
    return calculatePrimitiveDelta(oldValue, newValue);
  }

  // 配列の場合
  if (isArray(oldValue) && isArray(newValue)) {
    return calculateArrayDelta(oldValue, newValue, options);
  }

  // Setの場合
  if (isSet(oldValue) && isSet(newValue)) {
    return calculateSetDelta(oldValue, newValue, options);
  }

  // Mapの場合
  if (isMap(oldValue) && isMap(newValue)) {
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
  return calculatePrimitiveDelta(oldValue, newValue);
}
