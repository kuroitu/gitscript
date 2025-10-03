import { deepCopy, isArray } from '@/core';
import { useArrayDeletion } from '@/patch/apply/array-deletion';
import {
  deleteNestedValue,
  getNestedValue,
  setNestedValue,
} from '@/patch/apply/nested-accessor';
import { convertPatchToMicrodiffResult } from '@/patch/convert';
import {
  MicrodiffChangeType,
  MicrodiffPath,
  MicrodiffResult,
  MicrodiffSource,
} from '@/patch/microdiff';
import { Patch } from '@/patch/types';

/**
 * パッチを適用
 */
export const useApplyPatch = () => {
  const { scheduleArrayDeletion, executeAllDeletions } = useArrayDeletion();

  /**
   * パッチを適用
   * @param source 適用前のオブジェクト
   * @param patch パッチ
   * @returns 適用後のオブジェクト
   */
  function applyPatch<T extends Record<string, unknown>>(
    source: T,
    patch: Patch,
  ): T;
  function applyPatch<T extends unknown[]>(source: T, patch: Patch): T;
  function applyPatch<T extends MicrodiffSource>(source: T, patch: Patch): T {
    const microdiffResult = convertPatchToMicrodiffResult(patch);
    return applyMicrodiffResult(source, microdiffResult);
  }

  /**
   * microdiffの結果を適用
   * @param source 適用前のオブジェクト
   * @param diffs microdiffの結果
   * @returns 適用後のオブジェクト
   */
  function applyMicrodiffResult<T extends MicrodiffSource>(
    source: T,
    diffs: MicrodiffResult,
  ): T {
    const newSource = deepCopy(source).data;

    for (const diff of diffs) {
      if (!diff.path || diff.path.length === 0) {
        continue;
      }

      switch (diff.type) {
        case MicrodiffChangeType.Create:
        case MicrodiffChangeType.Change:
          setNestedValue(newSource, diff.path, diff.value);
          break;
        case MicrodiffChangeType.Remove:
          handleRemoveOperation(newSource, diff.path);
          break;
      }
    }

    // すべての配列削除処理を実行
    executeAllDeletions();
    return newSource;
  }

  /**
   * 削除操作を処理
   * @param source 対象オブジェクト
   * @param path 削除するパス
   */
  function handleRemoveOperation(
    source: MicrodiffSource,
    path: MicrodiffPath,
  ): void {
    const targetValue = getNestedValue(source, path);

    if (isArray(targetValue)) {
      // 配列の場合は特別な処理
      scheduleArrayDeletion(source, path);
    } else {
      // 通常のオブジェクトの場合は直接削除
      deleteNestedValue(source, path);
    }
  }

  return {
    applyPatch,
    handleRemoveOperation,
  };
};

/**
 * 削除操作を処理
 * @param source 対象オブジェクト
 * @param path 削除するパス
 * @param arrayDeletionManager 配列削除マネージャー
 */
export function handleRemoveOperation(
  source: MicrodiffSource,
  path: MicrodiffPath,
  arrayDeletionManager: ReturnType<typeof useArrayDeletion>,
): void {
  const targetValue = getNestedValue(source, path);

  if (isArray(targetValue)) {
    // 配列の場合は特別な処理
    arrayDeletionManager.scheduleArrayDeletion(source, path);
  } else {
    // 通常のオブジェクトの場合は直接削除
    deleteNestedValue(source, path);
  }
}
