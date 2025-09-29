import { isArray, isNumber } from '@/core';
import { getNestedValue, setNestedValue } from '@/patch/apply/nested-accessor';
import { MicrodiffPath, MicrodiffSource } from '@/patch/microdiff';

/**
 * 配列削除処理
 */
export const useArrayDeletion = () => {
  /** 削除する要素をマーカーで置換 */
  const removeSymbol = Symbol('micropatch-delete');
  /** 遅延実行のキュー */
  const deletionQueue: (() => void)[] = [];

  /**
   * 配列要素の削除をスケジュール
   * @param source 対象オブジェクト
   * @param path 削除するパス
   */
  function scheduleArrayDeletion(
    source: MicrodiffSource,
    path: MicrodiffPath,
  ): void {
    const parentPath = path.slice(0, -1);
    const lastKey = path.at(-1);

    if (parentPath.length === 0 || !isNumber(lastKey)) {
      return;
    }

    const parent = getNestedValue(source, parentPath);
    if (!isArray(parent)) {
      return;
    }

    // 削除対象の要素をマーカーで置換
    parent[lastKey] = removeSymbol;

    // 遅延実行のキューに追加
    deletionQueue.push(() => {
      executeArrayDeletion(source, parentPath);
    });
  }

  /**
   * すべての削除処理を実行
   */
  function executeAllDeletions(): void {
    deletionQueue.forEach((deletion) => deletion());
  }

  /**
   * 配列削除を実行
   * @param source 対象オブジェクト
   * @param parentPath 親パス
   */
  function executeArrayDeletion(
    source: MicrodiffSource,
    parentPath: MicrodiffPath,
  ): void {
    const updatedParent = getNestedValue(source, parentPath);
    if (!isArray(updatedParent)) {
      return;
    }

    const filteredArray = updatedParent.filter(
      (element: unknown) => element !== removeSymbol,
    );

    setNestedValue(source, parentPath, filteredArray);
  }

  return {
    scheduleArrayDeletion,
    executeAllDeletions,
  };
};
