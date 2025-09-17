/**
 * 配列差分計算器（microdiffベース）
 *
 * Phase 2.2: 配列の差分計算
 *
 * microdiffライブラリを使用して配列の差分を計算します。
 * 順序を考慮する/しないオプションをサポートします。
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
 * 配列の差分を計算します
 *
 * @param oldArray 変更前の配列
 * @param newArray 変更後の配列
 * @param options オプション
 * @returns 差分計算の結果
 */
export function calculateArrayDelta(
  oldArray: unknown[],
  newArray: unknown[],
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  const startTime = performance.now();

  try {
    // microdiffのオプションを設定
    const microdiffOptions = {
      cyclesFix: true,
      ignoreArrays: !options.arrayOrderMatters, // 配列の順序を考慮するか
      ignoreKeys: options.ignoreProperties,
    };

    // microdiffで差分を計算
    const microdiffResult = microdiff(oldArray as any, newArray as any, microdiffOptions);
    
    // ObjectDelta形式に変換
    const delta = convertArrayDiffToObjectDelta(microdiffResult, oldArray, newArray, options);
    
    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: oldArray.length + newArray.length,
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
 * 配列の差分をObjectDelta形式に変換
 */
function convertArrayDiffToObjectDelta(
  microdiffResult: any[],
  oldArray: unknown[],
  newArray: unknown[],
  options: DeltaCalculationOptions,
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  // 配列の長さの変更をチェック
  if (oldArray.length !== newArray.length) {
    changes['__length__'] = {
      type: PropertyChangeType.Modified,
      oldValue: oldArray.length,
      newValue: newArray.length,
    };
  }

  // microdiffの結果を変換
  for (const change of microdiffResult) {
    const key = convertArrayPathToChangeKey(change.path);
    const propertyChange = convertMicrodiffChangeToPropertyChange(change);
    changes[key] = propertyChange;
  }

  return createDeltaFromChanges(changes);
}

/**
 * 配列のパスをChangeKeyに変換
 */
function convertArrayPathToChangeKey(path: (string | number)[]): ChangeKey {
  if (path.length === 0) {
    return '__root__';
  }

  // 配列のインデックスの場合は[0], [1]形式に変換
  if (path.length === 1 && typeof path[0] === 'number') {
    return `[${path[0]}]`;
  }

  // ネストした配列の場合は最初のインデックスのみを使用
  const firstKey = path[0];
  if (typeof firstKey === 'number') {
    return `[${firstKey}]`;
  }

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
