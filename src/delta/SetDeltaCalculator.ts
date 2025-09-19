/**
 * Phase 2.2: Set の差分計算
 *
 * Setをオブジェクトに変換してmicrodiffで差分を計算します。
 */

import { isString } from '@/core/utils';
import {
  calculateDiff,
  MicrodiffResult,
} from '@/delta/MicrodiffWrapper';
import {
  ChangeKey,
  ChangeSpecialKey,
  DeltaCalculationOptions,
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
} from '@/types';
import {
  convertMicrodiffChangeToPropertyChange,
  convertSetMapPathToChangeKey,
  createDeltaFromChanges,
  handleDeltaCalculationError,
} from '@/delta/DeltaUtils';

/**
 * Setの差分を計算します
 *
 * @param oldSet 変更前のSet
 * @param newSet 変更後のSet
 * @param options 計算オプション
 * @returns 差分計算の結果
 */
export function calculateSetDelta(
  oldSet: Set<unknown>,
  newSet: Set<unknown>,
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  const startTime = performance.now();

  try {
    // Setをオブジェクトに変換
    const oldObj = setToObject(oldSet);
    const newObj = setToObject(newSet);

    // microdiffで差分を計算
    const microdiffResult: MicrodiffResult = calculateDiff(oldObj, newObj, {
      cyclesFix: true,
      ignoreArrays: true,
      ignoreKeys: options.ignoreProperties,
    });

    // ObjectDelta形式に変換
    const delta = convertSetDiffToObjectDelta(
      microdiffResult,
      oldSet,
      newSet,
    );

    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: oldSet.size + newSet.size,
    };
  } catch (error) {
    handleDeltaCalculationError(error, 'calculate Set delta');
  }
}

/**
 * Setをオブジェクトに変換
 * @param set Set
 * @returns オブジェクト
 */
function setToObject(set: Set<unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  let index = 0;
  for (const value of set) {
    obj[`item_${index}`] = value;
    index++;
  }
  return obj;
}

/**
 * Setの差分をObjectDelta形式に変換
 * @param microdiffResult microdiffの結果
 * @param oldSet 変更前のSet
 * @param newSet 変更後のSet
 * @returns ObjectDelta
 */
function convertSetDiffToObjectDelta(
  microdiffResult: MicrodiffResult,
  oldSet: Set<unknown>,
  newSet: Set<unknown>,
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  // サイズの変更をチェック
  if (oldSet.size !== newSet.size) {
    changes[ChangeSpecialKey.Size] = {
      type: PropertyChangeType.Modified,
      oldValue: oldSet.size,
      newValue: newSet.size,
    };
  }

  // microdiffの結果を変換
  microdiffResult.forEach((change) => {
    const key = convertSetMapPathToChangeKey(change.path);
    const propertyChange = convertMicrodiffChangeToPropertyChange(change);
    changes[key] = propertyChange;
  });

  return createDeltaFromChanges(changes);
}
