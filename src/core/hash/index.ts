/**
 * ハッシュ機能のエクスポート
 *
 * GitScriptライブラリのハッシュ機能を提供するモジュール
 */

// ハッシュ計算機能
export {
  calculateHash,
  calculateHashFromBuffer,
  calculateHashFromMultiple,
  calculateHashFromObject,
} from '@/core/hash/HashCalculator';

// ハッシュ検証機能
export {
  isValidHash,
  isValidShortHash,
  validateHash,
  verifyHashIntegrity,
  verifyObjectHashIntegrity,
} from '@/core/hash/HashValidator';

// ハッシュユーティリティ機能
export {
  compareHashes,
  detectHashCollision,
  expandShortHash,
  findHashIndex,
  removeDuplicateHashes,
  shortenHash,
  sortHashes,
} from '@/core/hash/HashUtils';
