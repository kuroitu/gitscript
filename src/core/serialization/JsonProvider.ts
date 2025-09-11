/**
 * JSON操作の低級レイヤ
 *
 * JSON.stringify/parseの直接使用を避け、
 * 例外ハンドリングを行うラッパー層
 */

import { detectDataType } from '@/core/serialization/DataTypeDetector';
import {
  DeserializationOptions,
  DeserializationResult,
  FunctionHandling,
  SerializationFormat,
  SerializationOptions,
  SerializationResult,
  SymbolHandling,
  UndefinedHandling,
} from '@/core/serialization/types';
import { isFunction, isSymbol, isUndefined } from '@/core/utils';
import { GitScriptError } from '@/types';
import { isNativeError } from 'util/types';

/**
 * シリアライゼーション関連のエラー
 */
export class SerializationError extends GitScriptError {
  constructor(message: string, cause?: Error) {
    super(`Serialization error: ${message}`, 'SERIALIZATION_ERROR');
    this.name = 'SerializationError';
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * オブジェクトをコンパクトなJSON文字列にシリアライズする（スペースなし）
 * @param obj シリアライズするオブジェクト
 * @returns コンパクトなJSON文字列
 * @throws SerializationError シリアライズに失敗した場合
 */
export function stringifyCompact(obj: unknown): string {
  try {
    const result = JSON.stringify(obj, null, 0);
    // JSON.stringifyがundefinedを返す場合（例: undefined, Symbol）は"null"として扱う
    return isUndefined(result) ? 'null' : result;
  } catch (error) {
    throw new SerializationError(
      `Failed to stringify object: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * オブジェクトをJSON文字列にシリアライズする
 * @param obj シリアライズするオブジェクト
 * @param options シリアライゼーションオプション
 * @returns シリアライゼーション結果
 * @throws SerializationError シリアライズに失敗した場合
 */
export function serialize(
  obj: unknown,
  options: SerializationOptions = {},
): SerializationResult {
  const startTime = performance.now();

  try {
    const format = options.format || SerializationFormat.compact;
    const typeInfo = detectDataType(obj);

    let data: string;

    switch (format) {
      case SerializationFormat.compact:
        data = stringifyCompact(obj);
        break;
      case SerializationFormat.pretty:
        data = stringifyPretty(obj, options.indent || 2);
        break;
      case SerializationFormat.json:
      default:
        data = stringifyWithOptions(obj, options);
        break;
    }

    const duration = performance.now() - startTime;

    return {
      data,
      format,
      typeInfo,
      duration,
    };
  } catch (error) {
    throw new SerializationError(
      `Failed to serialize object: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * JSON文字列をオブジェクトにデシリアライズする
 * @param data デシリアライズするJSON文字列
 * @param options デシリアライゼーションオプション
 * @returns デシリアライゼーション結果
 * @throws SerializationError デシリアライズに失敗した場合
 */
export function deserialize<T = unknown>(
  data: string,
  options: DeserializationOptions = {},
): DeserializationResult<T> {
  const startTime = performance.now();

  try {
    const obj = JSON.parse(data, options.reviver) as T;
    const typeInfo = detectDataType(obj);
    const duration = performance.now() - startTime;

    return {
      data: obj,
      typeInfo,
      duration,
    };
  } catch (error) {
    throw new SerializationError(
      `Failed to deserialize data: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * オブジェクトを整形されたJSON文字列にシリアライズする
 * @param obj シリアライズするオブジェクト
 * @param indent インデントのスペース数
 * @returns 整形されたJSON文字列
 */
function stringifyPretty(obj: unknown, indent: number): string {
  try {
    const result = JSON.stringify(obj, null, indent);
    return isUndefined(result) ? 'null' : result;
  } catch (error) {
    throw new SerializationError(
      `Failed to stringify object with pretty format: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * オプション付きでオブジェクトをJSON文字列にシリアライズする
 * @param obj シリアライズするオブジェクト
 * @param options シリアライゼーションオプション
 * @returns JSON文字列
 */
function stringifyWithOptions(
  obj: unknown,
  options: SerializationOptions,
): string {
  try {
    const replacer = createReplacer(options);
    const result = JSON.stringify(obj, replacer, options.indent);
    return isUndefined(result) ? 'null' : result;
  } catch (error) {
    throw new SerializationError(
      `Failed to stringify object with options: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * リプレーサー関数を作成する
 * @param options シリアライゼーションオプション
 * @returns リプレーサー関数
 */
function createReplacer(
  options: SerializationOptions,
): (key: string, value: unknown) => unknown {
  return (key: string, value: unknown): unknown => {
    // カスタムリプレーサーが指定されている場合はそれを使用
    if (options.replacer) {
      const customResult = options.replacer(key, value);
      if (!isUndefined(customResult)) {
        return customResult;
      }
    }

    // 特殊な型の処理
    if (isFunction(value)) {
      return handleFunction(value as (...args: unknown[]) => unknown, options);
    }

    if (isSymbol(value)) {
      return handleSymbol(value, options);
    }

    if (isUndefined(value)) {
      return handleUndefined(value, options);
    }

    return value;
  };
}

/**
 * 関数の処理
 * @param _value 関数値
 * @param options シリアライゼーションオプション
 * @returns 処理された値
 */
function handleFunction(
  _value: (...args: unknown[]) => unknown,
  options: SerializationOptions,
): unknown {
  switch (options.functionHandling || FunctionHandling.ignore) {
    case FunctionHandling.error:
      throw new SerializationError('Function values cannot be serialized');
    case FunctionHandling.replace:
      return '[Function]';
    case FunctionHandling.ignore:
    default:
      return undefined;
  }
}

/**
 * Symbolの処理
 * @param value Symbol値
 * @param options シリアライゼーションオプション
 * @returns 処理された値
 */
function handleSymbol(value: symbol, options: SerializationOptions): unknown {
  switch (options.symbolHandling || SymbolHandling.ignore) {
    case SymbolHandling.error:
      throw new SerializationError('Symbol values cannot be serialized');
    case SymbolHandling.replace:
      return '[Symbol]';
    case SymbolHandling.ignore:
    default:
      return undefined;
  }
}

/**
 * undefinedの処理
 * @param _value undefined値
 * @param options シリアライゼーションオプション
 * @returns 処理された値
 */
function handleUndefined(
  _value: undefined,
  options: SerializationOptions,
): unknown {
  switch (options.undefinedHandling || UndefinedHandling.ignore) {
    case UndefinedHandling.error:
      throw new SerializationError('Undefined values cannot be serialized');
    case UndefinedHandling.replace:
      return null;
    case UndefinedHandling.ignore:
    default:
      return undefined;
  }
}
