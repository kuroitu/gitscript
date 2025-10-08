import { GitScriptError } from '@/types/errors/base';

/**
 * 型エラー
 */
export class TypeError extends GitScriptError {
  /**
   * コンストラクタ
   * @param expectedType 期待する型
   * @param actualValue 実際の値
   * @param parameterName パラメータ名
   */
  constructor(
    expectedType: string,
    actualValue: unknown,
    parameterName?: string,
  ) {
    const message = parameterName
      ? `Expected ${expectedType} for parameter '${parameterName}', but got ${typeof actualValue}`
      : `Expected ${expectedType}, but got ${typeof actualValue}`;
    super(message, 'TYPE_ERROR');
    this.name = 'TypeError';
  }
}
