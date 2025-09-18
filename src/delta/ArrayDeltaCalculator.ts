/**
 * 配列差分計算器（microdiffベース）
 *
 * Phase 2.2: 配列の差分計算
 *
 * microdiffライブラリを使用して配列の差分を計算します。
 * 順序を考慮する/しないオプションをサポートします。
 */

import { isNumber } from '@/core/utils';
import {
  calculateArrayDiff,
  getFirstKey,
  MicrodiffChangeType,
  type MicrodiffChange,
} from '@/delta/MicrodiffWrapper';
import { DeltaCalculationError } from '@/types/Errors';
import {
  ChangeKey,
  ChangeSpecialKey,
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
    const microdiffResult = calculateArrayDiff(
      oldArray,
      newArray,
      microdiffOptions,
    );

    // ObjectDelta形式に変換
    const delta = convertArrayDiffToObjectDelta(
      microdiffResult,
      oldArray,
      newArray,
    );

    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: oldArray.length + newArray.length,
    };
  } catch (error) {
    // DeltaCalculationErrorの場合はそのまま再throw
    if (error instanceof DeltaCalculationError) {
      throw error;
    }

    // その他のエラーの場合はDeltaCalculationErrorでラップ
    throw new DeltaCalculationError(
      'Failed to calculate array delta',
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * 配列の差分をObjectDelta形式に変換
 * @param microdiffResult microdiffの結果
 * @param oldArray 変更前の配列
 * @param newArray 変更後の配列
 * @returns ObjectDelta
 */
function convertArrayDiffToObjectDelta(
  microdiffResult: MicrodiffChange[],
  oldArray: unknown[],
  newArray: unknown[],
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  // 配列の長さの変更をチェック
  if (oldArray.length !== newArray.length) {
    changes[ChangeSpecialKey.Length] = {
      type: PropertyChangeType.Modified,
      oldValue: oldArray.length,
      newValue: newArray.length,
    };
  }

  // microdiffの結果を変換
  microdiffResult.forEach((change) => {
    const key = convertArrayPathToChangeKey(change.path);
    const propertyChange = convertMicrodiffChangeToPropertyChange(change);
    changes[key] = propertyChange;
  });

  return createDeltaFromChanges(changes);
}

/**
 * 配列のパスをChangeKeyに変換
 */
function convertArrayPathToChangeKey(path: (string | number)[]): ChangeKey {
  if (path.length === 0) {
    return ChangeSpecialKey.Root;
  }

  // 配列のインデックスの場合は[0], [1]形式に変換
  if (path.length === 1 && isNumber(path[0])) {
    return `[${path[0]}]`;
  }

  // ネストした配列の場合は最初のインデックスのみを使用
  const firstKey = getFirstKey(path);
  if (isNumber(firstKey)) {
    return `[${firstKey}]`;
  }

  return String(firstKey);
}

/**
 * microdiffの変更をPropertyChangeに変換
 * @param change microdiffの変更
 * @returns PropertyChange
 */
function convertMicrodiffChangeToPropertyChange(
  change: MicrodiffChange,
): PropertyChange {
  switch (change.type) {
    case MicrodiffChangeType.CREATE:
      return {
        type: PropertyChangeType.Added,
        newValue: change.value,
      };
    case MicrodiffChangeType.REMOVE:
      return {
        type: PropertyChangeType.Removed,
        oldValue: change.oldValue,
      };
    case MicrodiffChangeType.CHANGE:
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
 * @param changes 変更情報
 * @returns ObjectDelta
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
