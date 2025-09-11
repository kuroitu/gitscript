/**
 * シリアライゼーション機能の型定義
 *
 * GitScriptライブラリのシリアライゼーション機能で使用する型を定義
 */

/**
 * サポートされるシリアライゼーション形式
 */
export const SerializationFormat = {
  /** JSON形式 */
  json: 'json',
  /** コンパクト形式 */
  compact: 'compact',
  /** 人間が読みやすい形式 */
  pretty: 'pretty',
} as const;
export type SerializationFormat =
  (typeof SerializationFormat)[keyof typeof SerializationFormat];

/**
 * データ型の種類
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
  /** Function */
  function: 'function',
  /** Symbol */
  symbol: 'symbol',
  /** Undefined */
  undefined: 'undefined',
  /** Null */
  null: 'null',
  /** Buffer */
  buffer: 'buffer',
  /** BigInt */
  bigint: 'bigint',
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
    /** 関数の場合の引数の数 */
    parameterCount?: number;
    /** バッファの場合のサイズ */
    bufferSize?: number;
  };
}

/**
 * シリアライゼーションオプション
 */
export interface SerializationOptions {
  /** シリアライゼーション形式 */
  format?: SerializationFormat;
  /** インデントのスペース数（pretty形式の場合） */
  indent?: number;
  /** 循環参照の処理方法 */
  circularReferenceHandling?: 'error' | 'replace' | 'ignore';
  /** 関数の処理方法 */
  functionHandling?: 'error' | 'replace' | 'ignore';
  /** Symbolの処理方法 */
  symbolHandling?: 'error' | 'replace' | 'ignore';
  /** undefinedの処理方法 */
  undefinedHandling?: 'error' | 'replace' | 'ignore';
  /** カスタムリプレーサー関数 */
  replacer?: (key: string, value: unknown) => unknown;
}

/**
 * デシリアライゼーションオプション
 */
export interface DeserializationOptions {
  /** カスタムリバイバー関数 */
  reviver?: (key: string, value: unknown) => unknown;
  /** 厳密な型チェックを行うか */
  strict?: boolean;
}

/**
 * 循環参照の処理方法
 */
export const CircularReferenceHandling = {
  /** エラー */
  error: 'error',
  /** 置換 */
  replace: 'replace',
  /** 無視 */
  ignore: 'ignore',
} as const;
export type CircularReferenceHandling =
  (typeof CircularReferenceHandling)[keyof typeof CircularReferenceHandling];

/**
 * 関数の処理方法
 */
export const FunctionHandling = {
  /** エラー */
  error: 'error',
  /** 置換 */
  replace: 'replace',
  /** 無視 */
  ignore: 'ignore',
} as const;
export type FunctionHandling =
  (typeof FunctionHandling)[keyof typeof FunctionHandling];

/**
 * Symbolの処理方法
 */
export const SymbolHandling = {
  /** エラー */
  error: 'error',
  /** 置換 */
  replace: 'replace',
  /** 無視 */
  ignore: 'ignore',
} as const;
export type SymbolHandling =
  (typeof SymbolHandling)[keyof typeof SymbolHandling];

/**
 * 深いコピーのオプション
 */
export interface DeepCopyOptions {
  /** 循環参照の処理方法 */
  circularReferenceHandling?: CircularReferenceHandling;
  /** 関数の処理方法 */
  functionHandling?: FunctionHandling;
  /** Symbolの処理方法 */
  symbolHandling?: SymbolHandling;
  /** カスタムコピー関数 */
  customCopier?: (value: unknown) => unknown;
}

/**
 * シリアライゼーション結果
 */
export interface SerializationResult {
  /** シリアライズされたデータ */
  data: string;
  /** 使用された形式 */
  format: SerializationFormat;
  /** データ型情報 */
  typeInfo: DataTypeInfo;
  /** シリアライゼーションに要した時間（ミリ秒） */
  duration: number;
}

/**
 * デシリアライゼーション結果
 */
export interface DeserializationResult<T = unknown> {
  /** デシリアライズされたデータ */
  data: T;
  /** データ型情報 */
  typeInfo: DataTypeInfo;
  /** デシリアライゼーションに要した時間（ミリ秒） */
  duration: number;
}

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
