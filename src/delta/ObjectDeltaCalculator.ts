/**
 * オブジェクト差分計算器（microdiffベース）
 *
 * Phase 2.1: JavaScript オブジェクトの差分計算
 *
 * microdiffライブラリを使用して2つのオブジェクト間の差分を計算し、
 * プロパティレベルの変更を検出します。
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
 * 2つのオブジェクト間の差分を計算します
 *
 * @param oldObject 変更前のオブジェクト
 * @param newObject 変更後のオブジェクト
 * @param options オプション
 * @returns 差分計算の結果
 */
export function calculateObjectDelta(
  oldObject: unknown,
  newObject: unknown,
  options: DeltaCalculationOptions = {},
): DeltaCalculationResult {
  const startTime = performance.now();

  try {
    // プリミティブ値の場合は特別処理
    if (isPrimitive(oldObject) || isPrimitive(newObject)) {
      return calculatePrimitiveDelta(oldObject, newObject, startTime);
    }

    // microdiffのオプションを設定
    const microdiffOptions = {
      cyclesFix: true, // 循環参照の処理
      ignoreArrays: !options.arrayOrderMatters, // 配列の順序を考慮するか
      ignoreKeys: options.ignoreProperties, // 無視するプロパティ
    };

    // microdiffで差分を計算
    const microdiffResult = microdiff(oldObject as any, newObject as any, microdiffOptions);
    
    // ObjectDelta形式に変換
    const delta = convertMicrodiffToObjectDelta(microdiffResult);
    
    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: countTotalProperties(oldObject, newObject),
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
 * プリミティブ値の差分を計算
 */
function calculatePrimitiveDelta(
  oldValue: unknown,
  newValue: unknown,
  startTime: number,
): DeltaCalculationResult {
  const changes: Record<ChangeKey, PropertyChange> = {};

  if (oldValue !== newValue) {
    // 型が異なる場合は型変更として扱う
    if (typeof oldValue !== typeof newValue) {
      changes['__type__'] = {
        type: PropertyChangeType.Modified,
        oldValue: typeof oldValue,
        newValue: typeof newValue,
      };
    }

    changes['__value__'] = {
      type: PropertyChangeType.Modified,
      oldValue,
      newValue,
    };
  }

  const delta = createDeltaFromChanges(changes);
  const duration = performance.now() - startTime;

  return {
    delta,
    duration,
    totalProperties: 0,
  };
}

/**
 * microdiffの結果をObjectDelta形式に変換
 */
function convertMicrodiffToObjectDelta(microdiffResult: any[]): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  for (const change of microdiffResult) {
    const key = convertPathToChangeKey(change.path);
    const propertyChange = convertMicrodiffChangeToPropertyChange(change);
    changes[key] = propertyChange;
  }

  return createDeltaFromChanges(changes);
}

/**
 * microdiffのパスをChangeKeyに変換
 */
function convertPathToChangeKey(path: (string | number)[]): ChangeKey {
  if (path.length === 0) {
    return '__root__';
  }

  // 配列のインデックスの場合は[0], [1]形式に変換
  if (path.length === 1 && typeof path[0] === 'number') {
    return `[${path[0]}]`;
  }

  // オブジェクトのプロパティの場合は文字列として返す
  if (path.length === 1 && typeof path[0] === 'string') {
    return path[0];
  }

  // ネストしたパスの場合は最後の要素を使用
  const lastKey = path[path.length - 1];
  if (typeof lastKey === 'number') {
    return `[${lastKey}]`;
  }
  return lastKey;
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

/**
 * 総プロパティ数をカウント
 */
function countTotalProperties(oldObject: unknown, newObject: unknown): number {
  let count = 0;

  if (typeof oldObject === 'object' && oldObject !== null) {
    count += Object.keys(oldObject).length;
  }

  if (typeof newObject === 'object' && newObject !== null) {
    count += Object.keys(newObject).length;
  }

  return count;
}

/**
 * プリミティブ値かどうかを判定
 */
function isPrimitive(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  );
}