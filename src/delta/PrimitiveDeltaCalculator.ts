/**
 * Phase 2.1: Primitive値の差分計算
 *
 * プリミティブ値（string, number, boolean, null, undefined等）の
 * 差分を計算します。
 */

import { isPrimitive } from '@/core/utils';
import {
  createDeltaFromChanges,
  handleDeltaCalculationError,
} from '@/delta/DeltaUtils';
import {
  ChangeKey,
  ChangeSpecialKey,
  DeltaCalculationOptions,
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
} from '@/types';

/**
 * プリミティブ値の差分を計算します
 *
 * @param oldValue 変更前の値
 * @param newValue 変更後の値
 * @param _options 計算オプション
 * @returns 差分計算の結果
 */
export function calculatePrimitiveDelta(
  oldValue: unknown,
  newValue: unknown,
  _options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  const startTime = performance.now();

  try {
    // プリミティブ値でない場合はエラー
    if (!isPrimitive(oldValue) || !isPrimitive(newValue)) {
      throw new Error('Both values must be primitive');
    }

    const delta = calculatePrimitiveDeltaInternal(oldValue, newValue);
    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: 1, // プリミティブ値は1つのプロパティとして扱う
    };
  } catch (error) {
    handleDeltaCalculationError(error, 'calculate primitive delta');
  }
}

/**
 * プリミティブ値の差分を内部計算
 * @param oldValue 変更前の値
 * @param newValue 変更後の値
 * @returns ObjectDelta
 */
function calculatePrimitiveDeltaInternal(
  oldValue: unknown,
  newValue: unknown,
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  // 値が同じ場合は変更なし
  if (oldValue === newValue) {
    changes[ChangeSpecialKey.Value] = {
      type: PropertyChangeType.Unchanged,
      oldValue,
      newValue,
    };
    return createDeltaFromChanges(changes);
  }

  // 型が異なる場合は型変更として扱う
  if (typeof oldValue !== typeof newValue) {
    changes[ChangeSpecialKey.Type] = {
      type: PropertyChangeType.Modified,
      oldValue: typeof oldValue,
      newValue: typeof newValue,
    };
  }

  changes[ChangeSpecialKey.Value] = {
    type: PropertyChangeType.Modified,
    oldValue,
    newValue,
  };

  return createDeltaFromChanges(changes);
}
