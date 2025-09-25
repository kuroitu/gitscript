import { GitScriptError } from '@/types';

/**
 * 暗号化関連のエラー
 */
export class CryptoError extends GitScriptError {
  /**
   * コンストラクタ
   * @param message メッセージ
   * @param cause 原因
   */
  constructor(message: string, cause?: Error) {
    super(`Crypto error: ${message}`, 'CRYPTO_ERROR', cause);
    this.name = 'CryptoError';
  }
}
