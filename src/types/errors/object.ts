import { GitScriptError } from '@/types/errors/base';

/**
 * オブジェクトが見つからないエラー
 */
export class ObjectNotFoundError extends GitScriptError {
  /**
   * コンストラクタ
   * @param hash オブジェクトのハッシュ
   */
  constructor(hash: string) {
    super(`Object not found: ${hash}`, 'OBJECT_NOT_FOUND');
    this.name = 'ObjectNotFoundError';
  }
}
