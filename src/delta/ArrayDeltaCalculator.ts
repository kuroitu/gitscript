/**
 * 配列差分計算器（microdiffベース）
 *
 * Phase 2.2: 配列の差分計算
 *
 * microdiffライブラリを使用して配列の差分を計算します。
 * 順序を考慮する/しないオプションをサポートします。
 */

import {
  calculateDiff,
  MicrodiffOptions,
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
  convertArrayPathToChangeKey,
  convertMicrodiffChangeToPropertyChange,
  createDeltaFromChanges,
  handleDeltaCalculationError,
} from './DeltaUtils';

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
    const microdiffOptions: MicrodiffOptions = {
      cyclesFix: true,
      ignoreArrays: !options.arrayOrderMatters,
      ignoreKeys: options.ignoreProperties,
    };

    // microdiffで差分を計算
    const microdiffResult = calculateDiff(oldArray, newArray, microdiffOptions);

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
    handleDeltaCalculationError(error, 'calculate array delta');
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
  microdiffResult: MicrodiffResult,
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
