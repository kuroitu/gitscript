import { GitScriptError } from '@/types/errors/base';

/**
 * リポジトリが見つからないエラー
 */
export class RepositoryNotFoundError extends GitScriptError {
  /**
   * コンストラクタ
   * @param path リポジトリのパス
   */
  constructor(path: string) {
    super(`Repository not found at: ${path}`, 'REPOSITORY_NOT_FOUND');
    this.name = 'RepositoryNotFoundError';
  }
}
