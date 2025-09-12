/**
 * GitScript基底エラー
 */
export class GitScriptError extends Error {
  public readonly cause?: Error;

  constructor(
    message: string,
    public readonly code?: string,
    cause?: Error,
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
  constructor(path: string) {
    super(`Repository not found at: ${path}`, 'REPOSITORY_NOT_FOUND');
    this.name = 'RepositoryNotFoundError';
  }
}

/**
 * オブジェクトが見つからないエラー
 */
export class ObjectNotFoundError extends GitScriptError {
  constructor(hash: string) {
    super(`Object not found: ${hash}`, 'OBJECT_NOT_FOUND');
    this.name = 'ObjectNotFoundError';
  }
}

/**
 * コミットが見つからないエラー
 */
export class CommitNotFoundError extends GitScriptError {
  constructor(hash: string) {
    super(`Commit not found: ${hash}`, 'COMMIT_NOT_FOUND');
    this.name = 'CommitNotFoundError';
  }
}

/**
 * 無効なハッシュエラー
 */
export class InvalidHashError extends GitScriptError {
  constructor(hash: string) {
    super(`Invalid hash format: ${hash}`, 'INVALID_HASH');
    this.name = 'InvalidHashError';
  }
}

/**
 * ステージングエリアエラー
 */
export class StagingAreaError extends GitScriptError {
  constructor(message: string) {
    super(message, 'STAGING_AREA_ERROR');
    this.name = 'StagingAreaError';
  }
}

/**
 * 型エラー
 */
export class TypeError extends GitScriptError {
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
  constructor(message: string, cause?: Error) {
    super(message, 'ARGUMENT_ERROR', cause);
    this.name = 'ArgumentError';
  }
}

/**
 * データ型検出エラー
 */
export class DataTypeDetectionError extends GitScriptError {
  constructor(message: string, originalError?: Error) {
    const fullMessage = originalError
      ? `Failed to detect data type: ${message} (${originalError.message})`
      : `Failed to detect data type: ${message}`;
    super(fullMessage, 'DATA_TYPE_DETECTION_ERROR', originalError);
    this.name = 'DataTypeDetectionError';
  }
}
