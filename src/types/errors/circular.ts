import { GitScriptError } from '@/types/errors/base';

/**
 * 循環参照エラー
 */
export class CircularReferenceError extends GitScriptError {
  /**
   * コンストラクタ
   * @param objectPath オブジェクトのパス
   */
  constructor(objectPath?: string) {
    const message = objectPath
      ? `Circular reference detected at: ${objectPath}`
      : 'Circular reference detected';
    super(message, 'CIRCULAR_REFERENCE_ERROR');
    this.name = 'CircularReferenceError';
  }
}
