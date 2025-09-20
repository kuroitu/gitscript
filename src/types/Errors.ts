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

/**
 * オブジェクトが見つからないエラー
 */
export class ObjectNotFoundError extends GitScriptError {
  /**
   * コンストラクタ
   * @param hash オブジェクトのハッシュ
   */
  constructor(hash: string) {
    super(`Object not found: ${hash}`, 'OBJECT_NOT_FOUND');
    this.name = 'ObjectNotFoundError';
  }
}

/**
 * コミットが見つからないエラー
 */
export class CommitNotFoundError extends GitScriptError {
  /**
   * コンストラクタ
   * @param hash コミットのハッシュ
   */
  constructor(hash: string) {
    super(`Commit not found: ${hash}`, 'COMMIT_NOT_FOUND');
    this.name = 'CommitNotFoundError';
  }
}

/**
 * 無効なハッシュエラー
 */
export class InvalidHashError extends GitScriptError {
  /**
   * コンストラクタ
   * @param hash ハッシュ
   */
  constructor(hash: string) {
    super(`Invalid hash format: ${hash}`, 'INVALID_HASH');
    this.name = 'InvalidHashError';
  }
}

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
