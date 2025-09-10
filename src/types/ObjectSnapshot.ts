/**
 * オブジェクトスナップショット
 * 特定時点でのJavaScriptオブジェクトの状態を表現
 */
export interface ObjectSnapshot {
  /** オブジェクトのハッシュ */
  hash: string;
  /** オブジェクトのデータ */
  data: unknown;
  /** データ型（object, array, set, map, primitive） */
  type: string;
  /** 作成日時 */
  timestamp: Date;
  /** バージョン番号 */
  version: number;
}
