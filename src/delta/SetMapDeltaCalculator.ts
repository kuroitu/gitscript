/**
 * Set/Map差分計算器（microdiffベース）
 *
 * Phase 2.2: Set・Map の差分計算
 *
 * Set/Mapをオブジェクトに変換してmicrodiffで差分を計算します。
 */

import { isString } from '@/core/utils';
import {
  calculateDiff,
  MicrodiffResult,
  type MicrodiffChange,
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
} from './DeltaUtils';

/**
 * Setの差分を計算します
 *
 * @param oldSet 変更前のSet
 * @param newSet 変更後のSet
 * @param options オプション
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
    const delta = convertSetMapDiffToObjectDelta(
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
    handleDeltaCalculationError(error, 'calculate Map delta');
  }
}

/**
 * Mapの差分を計算します
 *
 * @param oldMap 変更前のMap
 * @param newMap 変更後のMap
 * @param options オプション
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
    const delta = convertSetMapDiffToObjectDelta(
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
 * Set/Mapの差分をObjectDelta形式に変換
 * @param microdiffResult microdiffの結果
 * @param oldCollection 変更前のSet/Map
 * @param newCollection 変更後のSet/Map
 * @returns ObjectDelta
 */
function convertSetMapDiffToObjectDelta(
  microdiffResult: MicrodiffChange[],
  oldCollection: Set<unknown> | Map<unknown, unknown>,
  newCollection: Set<unknown> | Map<unknown, unknown>,
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  // サイズの変更をチェック
  if (oldCollection.size !== newCollection.size) {
    changes[ChangeSpecialKey.Size] = {
      type: PropertyChangeType.Modified,
      oldValue: oldCollection.size,
      newValue: newCollection.size,
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
