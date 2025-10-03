import { isNumber } from '@/core';
import { MicrodiffPath, MicrodiffSource } from '@/patch/microdiff';
import { get, set, unset } from 'lodash';

/**
 * ネストされた値の取得
 * @param source 対象のオブジェクト
 * @param path アクセスするパス
 * @returns パスで指定された値、存在しない場合はundefined
 */
export function getNestedValue(
  source: MicrodiffSource,
  path: MicrodiffPath,
): unknown {
  if (!path || path.length === 0) {
    return source;
  }

  // lodashのget関数を使用してパスから値を取得
  const pathString = convertPathToString(path);
  return get(source, pathString);
}

/**
 * ネストされた値の設定
 * @param source 対象のオブジェクト
 * @param path 設定するパス
 * @param value 設定する値
 */
export function setNestedValue(
  source: MicrodiffSource,
  path: MicrodiffPath,
  value: unknown,
): void {
  if (!path || path.length === 0) {
    return;
  }

  // lodashのset関数を使用してパスに値を設定
  const pathString = convertPathToString(path);
  set(source, pathString, value);
}

/**
 * ネストされた値の削除
 * @param source 対象のオブジェクト
 * @param path 削除するパス
 */
export function deleteNestedValue(
  source: MicrodiffSource,
  path: MicrodiffPath,
): void {
  if (!path || path.length === 0) {
    return;
  }

  // lodashのunset関数を使用してパスから値を削除
  const pathString = convertPathToString(path);
  unset(source, pathString);
}

/**
 * パス配列をlodash用の文字列パスに変換
 * @param path パス配列
 * @returns lodash用の文字列パス
 */
function convertPathToString(path: MicrodiffPath): string {
  return path.map((key) => (isNumber(key) ? `[${key}]` : key)).join('.');
}
