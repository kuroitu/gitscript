/**
 * プリミティブ操作
 */
export const PrimitiveOperation = {
  /** セット */
  Set: 'set',
  /** 削除 */
  Delete: 'delete',
} as const;
export type PrimitiveOperation =
  (typeof PrimitiveOperation)[keyof typeof PrimitiveOperation];

/**
 * プロパティ操作
 */
export const PropertyOperation = {
  /** セット */
  Set: 'set',
  /** 削除 */
  Delete: 'delete',
  /** 変更 */
  Modify: 'modify',
} as const;
export type PropertyOperation =
  (typeof PropertyOperation)[keyof typeof PropertyOperation];

/**
 * 配列操作
 */
export const ArrayOperationType = {
  /** 挿入 */
  Insert: 'insert',
  /** 削除 */
  Delete: 'delete',
  /** 変更 */
  Modify: 'modify',
  /** 移動 */
  Move: 'move',
} as const;
export type ArrayOperationType =
  (typeof ArrayOperationType)[keyof typeof ArrayOperationType];

/**
 * Set操作
 */
export const SetOperation = {
  /** 追加 */
  Add: 'add',
  /** 削除 */
  Delete: 'delete',
} as const;
export type SetOperation = (typeof SetOperation)[keyof typeof SetOperation];

/**
 * Map操作
 */
export const MapOperation = {
  /** セット */
  Set: 'set',
  /** 削除 */
  Delete: 'delete',
} as const;
export type MapOperation = (typeof MapOperation)[keyof typeof MapOperation];

/**
 * データ型
 */
export const DataType = {
  /** プリミティブ */
  Primitive: 'primitive',
  /** オブジェクト */
  Object: 'object',
  /** 配列 */
  Array: 'array',
  /** セット */
  Set: 'set',
  /** マップ */
  Map: 'map',
} as const;
export type DataType = (typeof DataType)[keyof typeof DataType];
