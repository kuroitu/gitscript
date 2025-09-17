/**
 * microdiff ラッパー
 *
 * microdiffライブラリを低級レイヤでラップし、
 * 型安全性と一貫性を提供します。
 */

import microdiff from 'microdiff';

/**
 * microdiffの変更タイプ
 */
export type MicrodiffChangeType = 'CREATE' | 'REMOVE' | 'CHANGE';

/**
 * microdiffの変更オブジェクト
 */
export interface MicrodiffChange {
  type: MicrodiffChangeType;
  path: (string | number)[];
  value?: unknown;
  oldValue?: unknown;
}

/**
 * microdiffのオプション
 */
export interface MicrodiffOptions {
  cyclesFix?: boolean;
  ignoreArrays?: boolean;
  ignoreKeys?: string[];
}

/**
 * microdiffの結果
 */
export type MicrodiffResult = MicrodiffChange[];

/**
 * オブジェクトの差分を計算
 *
 * @param oldObject 変更前のオブジェクト
 * @param newObject 変更後のオブジェクト
 * @param options オプション
 * @returns 差分の結果
 */
export function calculateDiff(
  oldObject: Record<string, unknown> | unknown[],
  newObject: Record<string, unknown> | unknown[],
  options: MicrodiffOptions = {},
): MicrodiffResult {
  const defaultOptions: Required<MicrodiffOptions> = {
    cyclesFix: true,
    ignoreArrays: false,
    ignoreKeys: [],
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    return microdiff(oldObject, newObject, mergedOptions);
  } catch (error) {
    // エラーが発生した場合は空の配列を返す
    console.warn('microdiff calculation failed:', error);
    return [];
  }
}

/**
 * オブジェクトの差分を計算（型安全版）
 *
 * @param oldObject 変更前のオブジェクト
 * @param newObject 変更後のオブジェクト
 * @param options オプション
 * @returns 差分の結果
 */
export function calculateObjectDiff(
  oldObject: Record<string, unknown>,
  newObject: Record<string, unknown>,
  options: MicrodiffOptions = {},
): MicrodiffResult {
  return calculateDiff(oldObject, newObject, options);
}

/**
 * 配列の差分を計算（型安全版）
 *
 * @param oldArray 変更前の配列
 * @param newArray 変更後の配列
 * @param options オプション
 * @returns 差分の結果
 */
export function calculateArrayDiff(
  oldArray: unknown[],
  newArray: unknown[],
  options: MicrodiffOptions = {},
): MicrodiffResult {
  return calculateDiff(oldArray, newArray, options);
}

/**
 * 変更オブジェクトが有効かどうかを判定
 *
 * @param change 変更オブジェクト
 * @returns 有効な場合true
 */
export function isValidChange(change: unknown): change is MicrodiffChange {
  return (
    typeof change === 'object' &&
    change !== null &&
    'type' in change &&
    'path' in change &&
    Array.isArray((change as Record<string, unknown>).path) &&
    ['CREATE', 'REMOVE', 'CHANGE'].includes((change as MicrodiffChange).type)
  );
}

/**
 * 変更オブジェクトの配列をフィルタリング
 *
 * @param changes 変更オブジェクトの配列
 * @returns 有効な変更オブジェクトの配列
 */
export function filterValidChanges(changes: unknown[]): MicrodiffChange[] {
  return changes.filter(isValidChange);
}

/**
 * パスを文字列に変換
 *
 * @param path パス配列
 * @returns 文字列表現
 */
export function pathToString(path: (string | number)[]): string {
  return path.map(key => `[${key}]`).join('');
}

/**
 * パスから最後のキーを取得
 *
 * @param path パス配列
 * @returns 最後のキー
 */
export function getLastKey(path: (string | number)[]): string | number {
  return path[path.length - 1] ?? '';
}

/**
 * パスから最初のキーを取得
 *
 * @param path パス配列
 * @returns 最初のキー
 */
export function getFirstKey(path: (string | number)[]): string | number {
  return path[0] ?? '';
}
