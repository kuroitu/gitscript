import { GitScriptError } from '@/types/errors/base';

/**
 * 引数エラー
 */
export class ArgumentError extends GitScriptError {
  /**
   * コンストラクタ
   * @param message メッセージ
   * @param cause 原因
   */
  constructor(message: string, cause?: Error) {
    super(message, 'ARGUMENT_ERROR', cause);
    this.name = 'ArgumentError';
  }
}
