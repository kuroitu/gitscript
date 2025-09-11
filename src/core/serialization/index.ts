/**
 * シリアライゼーション機能のエクスポート
 *
 * GitScriptライブラリのシリアライゼーション機能を提供するモジュール
 */

// 型定義
export type {
  DataType,
  DataTypeInfo,
  DeepCopyOptions,
  DeepCopyResult,
  DeserializationOptions,
  DeserializationResult,
  SerializationFormat,
  SerializationOptions,
  SerializationResult,
} from '@/core/serialization/types';

// エラー
export { SerializationError } from '@/core/serialization/JsonProvider';

// データ型検出
export {
  analyzeValue,
  detectDataType,
} from '@/core/serialization/DataTypeDetector';

// シリアライゼーション
export {
  deserialize,
  serialize,
  stringifyCompact,
} from '@/core/serialization/JsonProvider';

// 深いコピー
export { deepCopy } from '@/core/serialization/DeepCopyProvider';
