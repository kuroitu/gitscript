/**
 * GitScript - Gitライクな履歴管理システム
 *
 * JavaScript/TypeScriptオブジェクトの履歴管理を提供するライブラリ
 */

// ハッシュ機能のエクスポート
export * from '@/core/hash';

// 暗号化機能のエクスポート
export * from '@/core/crypto';

// シリアライゼーション機能のエクスポート
export {
  analyzeValue,
  deepCopy,
  deserialize,
  detectDataType,
  serialize,
  stringifyCompact,
} from '@/core/serialization';

// ユーティリティ機能のエクスポート
export {
  isArray,
  isBigInt,
  isBoolean,
  isBuffer,
  isDate,
  isFunction,
  isMap,
  isNativeError,
  isNull,
  isNullOrUndefined,
  isNumber,
  isObject,
  isPrimitive,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUndefined,
  validateArray,
  validateBuffer,
  validateRange,
  validateString,
} from '@/core/utils';

// 型定義のエクスポート
export * from '@/core/serialization/types';
export * from '@/types/ObjectDelta';

// 差分計算機能のエクスポート
export * from '@/delta';

// エラークラスのエクスポート
export { SerializationError } from '@/core/serialization/errors';
export * from '@/types/errors';

// メインのGitScriptクラス（今後実装予定）
// export { GitScript } from './api/GitScript';
