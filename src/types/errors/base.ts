/**
 * GitScript基底エラー
 */
export class GitScriptError extends Error {
  /**
   * コンストラクタ
   * @param message エラーのメッセージ
   * @param code エラーのコード
   * @param cause エラーの原因
   */
  constructor(
    message: string,
    public readonly code?: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'GitScriptError';
    this.cause = cause;
  }
}
