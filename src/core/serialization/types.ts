/**
 * シリアライゼーション機能の型定義
 *
 * GitScriptライブラリのシリアライゼーション機能で使用する型を定義
 */


/**
 * データ型の種類（純粋なオブジェクトのみ）
 */
export const DataType = {
  /** プリミティブ型 */
  primitive: 'primitive',
  /** オブジェクト */
  object: 'object',
  /** 配列 */
  array: 'array',
  /** Set */
  set: 'set',
  /** Map */
  map: 'map',
  /** Date */
  date: 'date',
  /** RegExp */
  regexp: 'regexp',
  /** Buffer */
  buffer: 'buffer',
  /** BigInt */
  bigint: 'bigint',
  /** Null */
  null: 'null',
} as const;
export type DataType = (typeof DataType)[keyof typeof DataType];

/**
 * データ型の検出結果
 */
export interface DataTypeInfo {
  /** データ型の種類 */
  type: DataType;
  /** 型の詳細情報 */
  details?: {
    /** オブジェクトの場合のプロパティ数 */
    propertyCount?: number;
    /** 配列の場合の要素数 */
    elementCount?: number;
    /** Setの場合の要素数 */
    setSize?: number;
    /** Mapの場合の要素数 */
    mapSize?: number;
    /** バッファの場合のサイズ */
    bufferSize?: number;
  };
}


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
  /** データ型情報 */
  typeInfo: DataTypeInfo;
  /** コピーに要した時間（ミリ秒） */
  duration: number;
}
