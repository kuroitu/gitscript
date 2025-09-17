/**
 * Set/Map差分計算器（microdiffベース）
 *
 * Phase 2.2: Set・Map の差分計算
 *
 * Set/Mapをオブジェクトに変換してmicrodiffで差分を計算します。
 */

import microdiff from 'microdiff';
import {
  ChangeKey,
  DeltaCalculationOptions,
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
} from '@/types/ObjectDelta';

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
    const microdiffResult = microdiff(oldObj as any, newObj as any, {
      cyclesFix: true,
      ignoreArrays: true,
      ignoreKeys: options.ignoreProperties,
    });

    // ObjectDelta形式に変換
    const delta = convertSetMapDiffToObjectDelta(microdiffResult, oldSet, newSet);
    
    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: oldSet.size + newSet.size,
    };
  } catch (error) {
    const duration = performance.now() - startTime;

    return {
      delta: createEmptyDelta(),
      duration,
      totalProperties: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
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
    const microdiffResult = microdiff(oldObj as any, newObj as any, {
      cyclesFix: true,
      ignoreArrays: true,
      ignoreKeys: options.ignoreProperties,
    });

    // ObjectDelta形式に変換
    const delta = convertSetMapDiffToObjectDelta(microdiffResult, oldMap, newMap);
    
    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: oldMap.size + newMap.size,
    };
  } catch (error) {
    const duration = performance.now() - startTime;

    return {
      delta: createEmptyDelta(),
      duration,
      totalProperties: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Setをオブジェクトに変換
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
 */
function mapToObject(map: Map<unknown, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of map) {
    const keyStr = typeof key === 'string' ? key : `key_${String(key)}`;
    obj[keyStr] = value;
  }
  return obj;
}

/**
 * Set/Mapの差分をObjectDelta形式に変換
 */
function convertSetMapDiffToObjectDelta(
  microdiffResult: any[],
  oldCollection: Set<unknown> | Map<unknown, unknown>,
  newCollection: Set<unknown> | Map<unknown, unknown>,
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  // サイズの変更をチェック
  if (oldCollection.size !== newCollection.size) {
    changes['__size__'] = {
      type: PropertyChangeType.Modified,
      oldValue: oldCollection.size,
      newValue: newCollection.size,
    };
  }

  // microdiffの結果を変換
  for (const change of microdiffResult) {
    const key = convertSetMapPathToChangeKey(change.path);
    const propertyChange = convertMicrodiffChangeToPropertyChange(change);
    changes[key] = propertyChange;
  }

  return createDeltaFromChanges(changes);
}

/**
 * Set/MapのパスをChangeKeyに変換
 */
function convertSetMapPathToChangeKey(path: (string | number)[]): ChangeKey {
  if (path.length === 0) {
    return '__root__';
  }

  // 最初の要素をキーとして使用
  const firstKey = path[0];
  return String(firstKey);
}

/**
 * microdiffの変更をPropertyChangeに変換
 */
function convertMicrodiffChangeToPropertyChange(change: any): PropertyChange {
  switch (change.type) {
    case 'CREATE':
      return {
        type: PropertyChangeType.Added,
        newValue: change.value,
      };
    case 'REMOVE':
      return {
        type: PropertyChangeType.Removed,
        oldValue: change.oldValue,
      };
    case 'CHANGE':
      return {
        type: PropertyChangeType.Modified,
        oldValue: change.oldValue,
        newValue: change.value,
      };
    default:
      return {
        type: PropertyChangeType.Modified,
        oldValue: change.oldValue,
        newValue: change.value,
      };
  }
}

/**
 * 変更情報からObjectDeltaを作成
 */
function createDeltaFromChanges(
  changes: Record<ChangeKey, PropertyChange>,
): ObjectDelta {
  const addedCount = Object.values(changes).filter(
    (c) => c.type === PropertyChangeType.Added,
  ).length;
  const removedCount = Object.values(changes).filter(
    (c) => c.type === PropertyChangeType.Removed,
  ).length;
  const modifiedCount = Object.values(changes).filter(
    (c) => c.type === PropertyChangeType.Modified,
  ).length;

  return {
    changes,
    changeCount: addedCount + removedCount + modifiedCount,
    addedCount,
    removedCount,
    modifiedCount,
  };
}

/**
 * 空の差分を作成
 */
function createEmptyDelta(): ObjectDelta {
  return {
    changes: {},
    changeCount: 0,
    addedCount: 0,
    removedCount: 0,
    modifiedCount: 0,
  };
}
