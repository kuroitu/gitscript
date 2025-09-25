import { GitScriptError } from '@/types';

/**
 * 無効なハッシュエラー
 */
export class InvalidHashError extends GitScriptError {
  /**
   * コンストラクタ
   * @param hash ハッシュ
   */
  constructor(hash: string) {
    super(`Invalid hash format: ${hash}`, 'INVALID_HASH');
    this.name = 'InvalidHashError';
  }
}
