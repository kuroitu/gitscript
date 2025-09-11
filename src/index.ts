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
  isBuffer,
  isNullOrUndefined,
  isString,
  validateArray,
  validateBuffer,
  validateString,
} from '@/core/utils';

// 型定義のエクスポート
export type { Author, Commit, DataDelta, ObjectSnapshot } from '@/types';

// エラークラスのエクスポート
export * from '@/types/Errors';

// メインのGitScriptクラス（今後実装予定）
// export { GitScript } from './api/GitScript';
