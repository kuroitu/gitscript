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
} from '@/core/serialization/types';

// エラー
export { SerializationError } from '@/core/serialization/errors';

// データ型検出
export { detectDataType } from '@/core/serialization/detector';

// シリアライゼーション
export {
  deserialize,
  stringifyCompact,
} from '@/core/serialization/JsonProvider';

// 深いコピー
export { deepCopy } from '@/core/serialization/DeepCopyProvider';
