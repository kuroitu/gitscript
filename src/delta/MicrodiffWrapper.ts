/**
 * microdiff ラッパー
 *
 * microdiffライブラリを低級レイヤでラップし、
 * 型安全性と一貫性を提供します。
 */

import { isArray, isNativeError, isNull, isObject } from '@/core/utils';
import { DeltaCalculationError } from '@/types';
import microdiff from 'microdiff';

/**
 * microdiffの変更タイプ
 */
export const MicrodiffChangeType = {
  /** 作成 */
  CREATE: 'CREATE',
  /** 削除 */
  REMOVE: 'REMOVE',
  /** 変更 */
  CHANGE: 'CHANGE',
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
  path: (string | number)[];
  /** 値 */
  value?: unknown;
  /** 古い値 */
  oldValue?: unknown;
}

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
    // エラーが発生した場合は専用エラーをthrow
    throw new DeltaCalculationError(
      'Failed to calculate diff using microdiff',
      isNativeError(error) ? error : undefined,
    );
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
    isObject(change) &&
    !isNull(change) &&
    Object.hasOwn(change, 'type') &&
    Object.hasOwn(change, 'path') &&
    isArray((change as Record<string, unknown>).path) &&
    Object.values(MicrodiffChangeType).includes(
      (change as MicrodiffChange).type,
    )
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
  return path.map((key) => `[${key}]`).join('');
}

/**
 * パスから最後のキーを取得
 *
 * @param path パス配列
 * @returns 最後のキー
 */
export function getLastKey(path: (string | number)[]): string | number {
  return path.at(-1) ?? '';
}

/**
 * パスから最初のキーを取得
 *
 * @param path パス配列
 * @returns 最初のキー
 */
export function getFirstKey(path: (string | number)[]): string | number {
  return path.at(0) ?? '';
}
