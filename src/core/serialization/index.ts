/**
 * シリアライゼーション機能のエクスポート
 *
 * GitScriptライブラリのシリアライゼーション機能を提供するモジュール
 */

// 型定義
export type {
  DeepCopyOptions,
  DeepCopyResult,
} from '@/core/serialization/types';

// エラー
export { SerializationError } from '@/core/serialization/errors';

// シリアライゼーション
export {
  deserialize,
  stringifyCompact,
} from '@/core/serialization/JsonProvider';

// 深いコピー
export { deepCopy } from '@/core/serialization/DeepCopyProvider';
