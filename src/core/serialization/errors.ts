import { GitScriptError } from '@/types/errors/base';

/**
 * データ型検出エラー
 */
export class DataTypeDetectionError extends GitScriptError {
  /**
   * コンストラクタ
   * @param message メッセージ
   * @param originalError 原因
   */
  constructor(message: string, originalError?: Error) {
    const fullMessage = originalError
      ? `Failed to detect data type: ${message} (${originalError.message})`
      : `Failed to detect data type: ${message}`;
    super(fullMessage, 'DATA_TYPE_DETECTION_ERROR', originalError);
    this.name = 'DataTypeDetectionError';
  }
}

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
