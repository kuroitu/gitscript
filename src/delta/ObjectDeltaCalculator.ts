/**
 * オブジェクト差分計算器（microdiffベース）
 *
 * Phase 2.1: JavaScript オブジェクトの差分計算
 *
 * microdiffライブラリを使用して2つのオブジェクト間の差分を計算し、
 * プロパティレベルの変更を検出します。
 */

import { isObject, isPrimitive } from '@/core/utils';
import {
  convertMicrodiffChangeToPropertyChange,
  convertObjectPathToChangeKey,
  createDeltaFromChanges,
  handleDeltaCalculationError,
} from '@/delta/DeltaUtils';
import { calculateDiff } from '@/delta/microdiff/wrapper';
import { MicrodiffOptions, MicrodiffResult } from '@/delta/microdiff/types';
import {
  ChangeKey,
  ChangeSpecialKey,
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
} from '@/types';

/**
 * 2つのオブジェクト間の差分を計算します
 *
 * @param oldObject 変更前のオブジェクト
 * @param newObject 変更後のオブジェクト
 * @param options オプション
 * @returns 差分計算の結果
 */
export function calculateObjectDelta(
  oldObject: Record<string, unknown>,
  newObject: Record<string, unknown>,
  options: MicrodiffOptions = {},
): DeltaCalculationResult {
  const startTime = performance.now();

  try {
    // プリミティブ値の場合は特別処理
    if (isPrimitive(oldObject) || isPrimitive(newObject)) {
      return calculatePrimitiveDelta(oldObject, newObject, startTime);
    }

    // microdiffのデフォルトオプションを設定
    const microdiffOptions: MicrodiffOptions = {
      cyclesFix: true,
      ...options,
    };

    // microdiffで差分を計算
    const microdiffResult = calculateDiff(
      oldObject,
      newObject,
      microdiffOptions,
    );

    // ObjectDelta形式に変換
    const delta = convertMicrodiffToObjectDelta(microdiffResult);

    const duration = performance.now() - startTime;

    return {
      delta,
      duration,
      totalProperties: countTotalProperties(oldObject, newObject),
    };
  } catch (error) {
    handleDeltaCalculationError(error, 'calculate object delta');
  }
}

/**
 * プリミティブ値の差分を計算
 * @param oldValue 変更前の値
 * @param newValue 変更後の値
 * @param startTime 開始時間
 * @returns 差分計算の結果
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
 * @param microdiffResult microdiffの結果
 * @returns ObjectDelta
 */
function convertMicrodiffToObjectDelta(
  microdiffResult: MicrodiffResult,
): ObjectDelta {
  const changes: Record<ChangeKey, PropertyChange> = {};

  microdiffResult.forEach((change) => {
    const key = convertObjectPathToChangeKey(change.path);
    const propertyChange = convertMicrodiffChangeToPropertyChange(change);
    changes[key] = propertyChange;
  });

  return createDeltaFromChanges(changes);
}

/**
 * 総プロパティ数をカウント
 * @param oldObject 変更前のオブジェクト
 * @param newObject 変更後のオブジェクス
 * @returns 総プロパティ数
 */
function countTotalProperties(oldObject: unknown, newObject: unknown): number {
  let count = 0;

  if (isObject(oldObject)) {
    count += Object.keys(oldObject).length;
  }

  if (isObject(newObject)) {
    count += Object.keys(newObject).length;
  }

  return count;
}
