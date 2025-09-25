/**
 * 差分計算の共通ユーティリティ
 *
 * 各差分計算器で共通して使用される処理を提供します。
 */

/**
 * パスの最初のキーを取得
 * @param path パス
 * @returns 最初のキー
 */
export function getFirstKey(path: MicrodiffPath): string | number {
  return path[0];
}

/**
 * パスの最後のキーを取得
 * @param path パス
 * @returns 最後のキー
 */
export function getLastKey(path: MicrodiffPath): string | number {
  return path[path.length - 1];
}

import { isNumber, isString } from '@/core/utils';
import {
  type MicrodiffChange,
  type MicrodiffPath,
} from '@/delta/microdiff/wrapper';
import { MicrodiffChangeType } from '@/delta/microdiff/types';
import {
  ChangeKey,
  ChangeSpecialKey,
  DeltaCalculationError,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
} from '@/types';

/**
 * microdiffの変更をPropertyChangeに変換
 * @param change microdiffの変更
 * @returns PropertyChange
 */
export function convertMicrodiffChangeToPropertyChange(
  change: MicrodiffChange,
): PropertyChange {
  switch (change.type) {
    case MicrodiffChangeType.Create:
      return {
        type: PropertyChangeType.Added,
        newValue: change.value,
      };
    case MicrodiffChangeType.Remove:
      return {
        type: PropertyChangeType.Removed,
        oldValue: change.oldValue,
      };
    case MicrodiffChangeType.Change:
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
export function createDeltaFromChanges(
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
 * microdiffのパスをChangeKeyに変換（オブジェクト用）
 * @param path microdiffのパス
 * @returns ChangeKey
 */
export function convertObjectPathToChangeKey(path: MicrodiffPath): ChangeKey {
  if (path.length === 0) {
    return ChangeSpecialKey.Root;
  }

  // 配列のインデックスの場合は[0], [1]形式に変換
  if (path.length === 1 && isNumber(path[0])) {
    return `[${path[0]}]`;
  }

  // オブジェクトのプロパティの場合は文字列として返す
  if (path.length === 1 && isString(path[0])) {
    return path[0];
  }

  // ネストしたパスの場合は最後の要素を使用
  const lastKey = getLastKey(path);
  if (isNumber(lastKey)) {
    return `[${lastKey}]`;
  }
  return lastKey;
}

/**
 * microdiffのパスをChangeKeyに変換（配列用）
 * @param path microdiffのパス
 * @returns ChangeKey
 */
export function convertArrayPathToChangeKey(path: MicrodiffPath): ChangeKey {
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
 * microdiffのパスをChangeKeyに変換（Set/Map用）
 * @param path microdiffのパス
 * @returns ChangeKey
 */
export function convertSetMapPathToChangeKey(path: MicrodiffPath): ChangeKey {
  if (path.length === 0) {
    return ChangeSpecialKey.Root;
  }

  // 最初の要素をキーとして使用
  const firstKey = getFirstKey(path);
  return String(firstKey);
}

/**
 * エラーハンドリングの共通処理
 * @param error エラー
 * @param operation 操作名
 * @returns エラーをthrow
 */
export function handleDeltaCalculationError(
  error: unknown,
  operation: string,
): never {
  // DeltaCalculationErrorの場合はそのまま再throw
  if (error instanceof DeltaCalculationError) {
    throw error;
  }

  // その他のエラーの場合はDeltaCalculationErrorでラップ
  throw new DeltaCalculationError(
    `Failed to ${operation}`,
    error instanceof Error ? error : new Error(String(error)),
  );
}
