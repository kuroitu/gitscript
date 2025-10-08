import { GitScriptError } from '@/types/errors/base';

/**
 * ステージングエリアエラー
 */
export class StagingAreaError extends GitScriptError {
  /**
   * コンストラクタ
   * @param message メッセージ
   */
  constructor(message: string) {
    super(message, 'STAGING_AREA_ERROR');
    this.name = 'StagingAreaError';
  }
}
