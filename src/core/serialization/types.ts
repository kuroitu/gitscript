/**
 * シリアライゼーション機能の型定義
 *
 * GitScriptライブラリのシリアライゼーション機能で使用する型を定義
 */


/**
 * 深いコピーのオプション（純粋なオブジェクト用）
 */
export type DeepCopyOptions = Record<string, never>;

/**
 * 深いコピーの結果
 */
export interface DeepCopyResult<T = unknown> {
  /** コピーされたデータ */
  data: T;
}
