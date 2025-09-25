import { GitScriptError } from '@/types/errors/base';

/**
 * シリアライゼーション関連のエラー
 */
export class SerializationError extends GitScriptError {
  /**
   * コンストラクタ
   * @param message メッセージ
   * @param cause 原因
   */
  constructor(message: string, cause?: Error) {
    super(`Serialization error: ${message}`, 'SERIALIZATION_ERROR', cause);
    this.name = 'SerializationError';
  }
}
