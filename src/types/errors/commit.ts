import { GitScriptError } from '@/types/errors/base';

/**
 * コミットが見つからないエラー
 */
export class CommitNotFoundError extends GitScriptError {
  /**
   * コンストラクタ
   * @param hash コミットのハッシュ
   */
  constructor(hash: string) {
    super(`Commit not found: ${hash}`, 'COMMIT_NOT_FOUND');
    this.name = 'CommitNotFoundError';
  }
}
