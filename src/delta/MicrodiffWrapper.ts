/**
 * microdiff ラッパー
 *
 * microdiffライブラリを低級レイヤでラップし、
 * 型安全性と一貫性を提供します。
 */

import { isArray, isNativeError, isNumber, isString } from '@/core/utils';
import { DeltaCalculationError } from '@/types';
import microdiff from 'microdiff';

/**
 * microdiffの変更タイプ
 */
export const MicrodiffChangeType = {
  /** 作成 */
  Create: 'CREATE',
  /** 削除 */
  Remove: 'REMOVE',
  /** 変更 */
  Change: 'CHANGE',
} as const;
export type MicrodiffChangeType =
  (typeof MicrodiffChangeType)[keyof typeof MicrodiffChangeType];

/**
 * microdiffの変更オブジェクト
 */
export interface MicrodiffChange {
  /** 変更タイプ */
  type: MicrodiffChangeType;
  /** パス */
  path: MicrodiffPath;
  /** 値 */
  value?: unknown;
  /** 古い値 */
  oldValue?: unknown;
}

/**
 * microdiffの結果
 */
export type MicrodiffResult = MicrodiffChange[];

/**
 * microdiffのパス
 */
export type MicrodiffPath = (string | number)[];

/**
 * microdiffのオプション
 */
export interface MicrodiffOptions {
  /** 循環参照の処理 */
  cyclesFix?: boolean;
  /** 配列の順序を考慮するか */
  ignoreArrays?: boolean;
  /** 無視するプロパティ */
  ignoreKeys?: string[];
}

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
    // エラーが発生した場合は専用エラーをthrow
    throw new DeltaCalculationError(
      'Failed to calculate diff using microdiff',
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * 変更タイプが有効かどうかを判定
 *
 * @param type 変更タイプ
 * @returns 有効な場合true
 */
export function isMicrodiffChangeType(
  type: unknown,
): type is MicrodiffChangeType {
  return Object.values(MicrodiffChangeType).includes(
    type as MicrodiffChangeType,
  );
}

/**
 * パスが有効かどうかを判定
 *
 * @param path パス
 * @returns 有効な場合true
 */
export function isMicrodiffPath(path: unknown): path is MicrodiffPath {
  return isArray(path) && path.every((key) => isString(key) || isNumber(key));
}

/**
 * 変更オブジェクトが有効かどうかを判定
 *
 * @param change 変更オブジェクト
 * @returns 有効な場合true
 */
export function isValidChange(change: unknown): change is MicrodiffChange {
  const microdiffChange = change as MicrodiffChange;
  return (
    !!microdiffChange &&
    isMicrodiffChangeType(microdiffChange.type) &&
    isMicrodiffPath(microdiffChange.path)
  );
}

/**
 * 変更オブジェクトの配列をフィルタリング
 *
 * @param changes 変更オブジェクトの配列
 * @returns 有効な変更オブジェクトの配列
 */
export function filterValidChanges(changes: unknown[]): MicrodiffResult {
  return changes.filter(isValidChange);
}

/**
 * パスを文字列に変換
 *
 * @param path パス配列
 * @returns 文字列表現
 */
export function pathToString(path: MicrodiffPath): string {
  return path.map((key) => `[${key}]`).join('');
}

/**
 * パスから最後のキーを取得
 *
 * @param path パス配列
 * @returns 最後のキー
 */
export function getLastKey(path: MicrodiffPath): string | number {
  return path.at(-1) ?? '';
}

/**
 * パスから最初のキーを取得
 *
 * @param path パス配列
 * @returns 最初のキー
 */
export function getFirstKey(path: MicrodiffPath): string | number {
  return path.at(0) ?? '';
}
