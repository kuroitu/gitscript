/**
 * オブジェクト差分計算器
 *
 * Phase 2.1: JavaScript オブジェクトの差分計算
 *
 * 2つのオブジェクト間の差分を計算し、プロパティレベルの変更を検出します。
 * ネストしたオブジェクトの再帰的な処理もサポートします。
 */

import { isArray, isNativeError, isObject, isPrimitive } from '@/core/utils';
import { CircularReferenceError } from '@/types/Errors';
import {
  ChangeKey,
  DeltaCalculationOptions,
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
} from '@/types/ObjectDelta';

/** 値がunknownのオブジェクト */
type UnknownValueObject = Record<string, unknown>;

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
  const defaultOptions: Required<DeltaCalculationOptions> = {
    deep: true,
    arrayOrderMatters: true,
    ignoreProperties: [],
    customComparator: () => false,
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const startTime = performance.now();

  try {
    const delta = calculateDelta(oldObject, newObject, mergedOptions);
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
      error: isNativeError(error) ? error.message : 'Unknown error',
    };
  }
}

/**
 * 差分を計算する内部関数
 * @param oldObject 変更前のオブジェクト
 * @param newObject 変更後のオブジェクト
 * @param options オプション
 * @param visited 訪問済みオブジェクトの集合
 * @returns 差分計算の結果
 */
function calculateDelta(
  oldObject: unknown,
  newObject: unknown,
  options: Required<DeltaCalculationOptions>,
  visited = new WeakSet(),
): ObjectDelta {
  // 循環参照の検出
  if (isObject(oldObject) && visited.has(oldObject as UnknownValueObject)) {
    throw new CircularReferenceError('oldObject');
  }
  if (isObject(newObject) && visited.has(newObject as UnknownValueObject)) {
    throw new CircularReferenceError('newObject');
  }

  // プリミティブ値の比較
  if (isPrimitive(oldObject) || isPrimitive(newObject)) {
    return calculatePrimitiveDelta(oldObject, newObject);
  }

  // 配列の比較
  if (isArray(oldObject) && isArray(newObject)) {
    return calculateArrayDelta(oldObject, newObject, options, visited);
  }

  // オブジェクトの比較
  if (isObject(oldObject) && isObject(newObject)) {
    // オブジェクトをvisitedに追加
    visited.add(oldObject as UnknownValueObject);
    visited.add(newObject as UnknownValueObject);

    try {
      return calculateObjectDeltaInternal(
        oldObject as UnknownValueObject,
        newObject as UnknownValueObject,
        options,
        visited,
      );
    } finally {
      // 処理完了後にvisitedから削除
      visited.delete(oldObject as UnknownValueObject);
      visited.delete(newObject as UnknownValueObject);
    }
  }

  // 型が異なる場合
  return calculateTypeChangeDelta(oldObject, newObject);
}

/**
 * プリミティブ値の差分を計算
 * @param oldValue 変更前の値
 * @param newValue 変更後の値
 * @returns 差分計算の結果
 */
function calculatePrimitiveDelta(
  oldValue: unknown,
  newValue: unknown,
): ObjectDelta {
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

  return createDeltaFromChanges(changes);
}

/**
 * 配列の差分を計算
 */
function calculateArrayDelta(
  oldArray: unknown[],
  newArray: unknown[],
  options: Required<DeltaCalculationOptions>,
  visited = new WeakSet(),
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  if (!options.arrayOrderMatters) {
    // 順序を考慮しない場合の簡易比較
    if (oldArray.length !== newArray.length) {
      changes['__length__'] = {
        type: PropertyChangeType.Modified,
        oldValue: oldArray.length,
        newValue: newArray.length,
      };
    }
    return createDeltaFromChanges(changes);
  }

  // 順序を考慮した詳細比較
  const maxLength = Math.max(oldArray.length, newArray.length);

  for (let i = 0; i < maxLength; i++) {
    const oldItem = oldArray[i];
    const newItem = newArray[i];

    if (i >= oldArray.length) {
      // 新しいアイテムが追加された
      changes[`[${i}]`] = {
        type: PropertyChangeType.Added,
        newValue: newItem,
      };
    } else if (i >= newArray.length) {
      // アイテムが削除された
      changes[`[${i}]`] = {
        type: PropertyChangeType.Removed,
        oldValue: oldItem,
      };
    } else if (!areValuesEqual(oldItem, newItem, options, visited)) {
      // アイテムが変更された
      const nestedDelta = options.deep
        ? calculateDelta(oldItem, newItem, options, visited)
        : undefined;

      changes[`[${i}]`] = {
        type: PropertyChangeType.Modified,
        oldValue: oldItem,
        newValue: newItem,
        nestedDelta,
      };
    }
  }

  return createDeltaFromChanges(changes);
}

/**
 * オブジェクトの差分を計算
 */
function calculateObjectDeltaInternal(
  oldObject: Record<string, unknown>,
  newObject: Record<string, unknown>,
  options: Required<DeltaCalculationOptions>,
  visited = new WeakSet(),
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};
  const allKeys = new Set([
    ...Object.keys(oldObject),
    ...Object.keys(newObject),
  ]);

  for (const key of allKeys) {
    // 無視するプロパティをスキップ
    if (options.ignoreProperties.includes(key)) {
      continue;
    }

    const oldValue = oldObject[key];
    const newValue = newObject[key];

    // カスタム比較関数を使用
    if (options.customComparator(key, oldValue, newValue)) {
      continue;
    }

    if (!(key in oldObject)) {
      // プロパティが追加された
      changes[key] = {
        type: PropertyChangeType.Added,
        newValue,
      };
    } else if (!(key in newObject)) {
      // プロパティが削除された
      changes[key] = {
        type: PropertyChangeType.Removed,
        oldValue,
      };
    } else if (!areValuesEqual(oldValue, newValue, options, visited)) {
      // プロパティが変更された
      const nestedDelta = options.deep
        ? calculateDelta(oldValue, newValue, options, visited)
        : undefined;

      changes[key] = {
        type: PropertyChangeType.Modified,
        oldValue,
        newValue,
        nestedDelta,
      };
    }
  }

  return createDeltaFromChanges(changes);
}

/**
 * 型変更の差分を計算
 */
function calculateTypeChangeDelta(
  oldValue: unknown,
  newValue: unknown,
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  changes['__type__'] = {
    type: PropertyChangeType.Modified,
    oldValue: typeof oldValue,
    newValue: typeof newValue,
  };

  changes['__value__'] = {
    type: PropertyChangeType.Modified,
    oldValue,
    newValue,
  };

  return createDeltaFromChanges(changes);
}

/**
 * 2つの値が等しいかどうかを判定
 */
function areValuesEqual(
  oldValue: unknown,
  newValue: unknown,
  options: Required<DeltaCalculationOptions>,
  visited = new WeakSet(),
): boolean {
  // 厳密等価性チェック
  if (oldValue === newValue) {
    return true;
  }

  // null/undefined のチェック
  if (oldValue == null || newValue == null) {
    return oldValue === newValue;
  }

  // 循環参照の検出
  if (isObject(oldValue) && visited.has(oldValue as UnknownValueObject)) {
    throw new CircularReferenceError('oldValue');
  }

  // オブジェクトの深い比較
  if (options.deep && isObject(oldValue) && isObject(newValue)) {
    visited.add(oldValue as UnknownValueObject);
    try {
      const delta = calculateDelta(oldValue, newValue, options);
      return delta.changeCount === 0;
    } finally {
      visited.delete(oldValue as UnknownValueObject);
    }
  }

  return false;
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

  if (isObject(oldObject)) {
    count += Object.keys(oldObject as UnknownValueObject).length;
  }

  if (isObject(newObject)) {
    count += Object.keys(newObject as UnknownValueObject).length;
  }

  return count;
}
