/**
 * オブジェクト差分の型定義
 *
 * Phase 2.1: JavaScript オブジェクトの差分計算
 */

/**
 * プロパティの変更タイプ
 */
export const PropertyChangeType = {
  /** 追加された */
  Added: 'added',
  /** 削除された */
  Removed: 'removed',
  /** 変更された */
  Modified: 'modified',
  /** 変更されていない */
  Unchanged: 'unchanged',
} as const;
export type PropertyChangeType =
  (typeof PropertyChangeType)[keyof typeof PropertyChangeType];

/**
 * プロパティの変更情報
 */
export interface PropertyChange {
  /** 変更タイプ */
  type: PropertyChangeType;
  /** 変更前の値（addedの場合はundefined） */
  oldValue?: unknown;
  /** 変更後の値（removedの場合はundefined） */
  newValue?: unknown;
  /** ネストしたオブジェクトの差分（オブジェクトの場合のみ） */
  nestedDelta?: ObjectDelta;
}

/**
 * 特殊な変更キー
 */
export const ChangeSpecialKey = {
  /** 型変更 */
  Type: '__type__',
  /** 値変更 */
  Value: '__value__',
  /** 配列長変更 */
  Length: '__length__',
  /** ルート */
  Root: '__root__',
  /** サイズ変更 */
  Size: '__size__',
} as const;
export type ChangeSpecialKey =
  (typeof ChangeSpecialKey)[keyof typeof ChangeSpecialKey];

/**
 * 変更情報のキー
 *
 * 実際に使用されるキーの型を定義
 */
export type ChangeKey =
  // 特殊な変更キー
  | ChangeSpecialKey
  // 配列インデックス
  | `[${number}]`
  // 通常のプロパティ名
  | string;

/**
 * オブジェクト差分
 *
 * 2つのオブジェクト間の差分を表現します。
 * 各プロパティの変更情報を含みます。
 */
export interface ObjectDelta {
  /** プロパティ名をキーとした変更情報のマップ */
  changes: Record<ChangeKey, PropertyChange>;
  /** 変更されたプロパティの数 */
  changeCount: number;
  /** 追加されたプロパティの数 */
  addedCount: number;
  /** 削除されたプロパティの数 */
  removedCount: number;
  /** 変更されたプロパティの数 */
  modifiedCount: number;
}

/**
 * 差分適用のオプション
 */
export interface DeltaApplicationOptions {
  /** 削除されたプロパティを無視するかどうか（デフォルト: false） */
  ignoreRemovals?: boolean;
  /** 追加されたプロパティを無視するかどうか（デフォルト: false） */
  ignoreAdditions?: boolean;
  /** 変更されたプロパティを無視するかどうか（デフォルト: false） */
  ignoreModifications?: boolean;
}

/**
 * 差分計算の結果
 */
export interface DeltaCalculationResult {
  /** 計算された差分 */
  delta: ObjectDelta;
  /** 計算にかかった時間（ミリ秒） */
  duration: number;
  /** 比較されたプロパティの総数 */
  totalProperties: number;
  /** エラーが発生した場合の情報 */
  error?: string;
}
