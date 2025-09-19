/**
 * Phase 2.2: Map の差分計算
 *
 * Mapをオブジェクトに変換してmicrodiffで差分を計算します。
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
 * Mapの差分を計算します
 *
 * @param oldMap 変更前のMap
 * @param newMap 変更後のMap
 * @param options 計算オプション
 * @returns 差分計算の結果
 */
export function calculateMapDelta(
  oldMap: Map<unknown, unknown>,
  newMap: Map<unknown, unknown>,
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  const startTime = performance.now();

  try {
    // Mapをオブジェクトに変換
    const oldObj = mapToObject(oldMap);
    const newObj = mapToObject(newMap);

    // microdiffで差分を計算
    const microdiffResult: MicrodiffResult = calculateDiff(oldObj, newObj, {
      cyclesFix: true,
      ignoreArrays: true,
      ignoreKeys: options.ignoreProperties,
    });

    // ObjectDelta形式に変換
    const delta = convertMapDiffToObjectDelta(
      microdiffResult,
      oldMap,
      newMap,
    );

    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: oldMap.size + newMap.size,
    };
  } catch (error) {
    handleDeltaCalculationError(error, 'calculate Map delta');
  }
}

/**
 * Mapをオブジェクトに変換
 * @param map Map
 * @returns オブジェクト
 */
function mapToObject(map: Map<unknown, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of map) {
    const keyStr = isString(key) ? key : `key_${String(key)}`;
    obj[keyStr] = value;
  }
  return obj;
}

/**
 * Mapの差分をObjectDelta形式に変換
 * @param microdiffResult microdiffの結果
 * @param oldMap 変更前のMap
 * @param newMap 変更後のMap
 * @returns ObjectDelta
 */
function convertMapDiffToObjectDelta(
  microdiffResult: MicrodiffResult,
  oldMap: Map<unknown, unknown>,
  newMap: Map<unknown, unknown>,
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  // サイズの変更をチェック
  if (oldMap.size !== newMap.size) {
    changes[ChangeSpecialKey.Size] = {
      type: PropertyChangeType.Modified,
      oldValue: oldMap.size,
      newValue: newMap.size,
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
