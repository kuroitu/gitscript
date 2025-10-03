import { GitScriptError } from '@/types';

/**
 * 差分計算エラー
 */
export class DeltaCalculationError extends GitScriptError {
  /**
   * コンストラクタ
   * @param message メッセージ
   * @param originalError 原因
   */
  constructor(message: string, originalError?: Error) {
    const fullMessage = originalError
      ? `Delta calculation failed: ${message} (${originalError.message})`
      : `Delta calculation failed: ${message}`;
    super(fullMessage, 'DELTA_CALCULATION_ERROR', originalError);
    this.name = 'DeltaCalculationError';
  }
}
