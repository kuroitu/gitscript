import { isArray, isBuffer, isString } from '@/core/utils/typeGuards';
import { ArgumentError, TypeError } from '@/types/Errors';

/**
 * 型バリデーション用のユーティリティ関数
 *
 * 型チェックとエラー投げを組み合わせた関数群
 */

/**
 * 値が文字列であることを検証し、そうでなければエラーを投げる
 * @param value 検証する値
 * @param parameterName パラメータ名（エラーメッセージ用）
 * @returns 文字列として型アサーションされた値
 * @throws TypeError 値が文字列でない場合
 */
export function validateString(
  value: unknown,
  parameterName = 'value',
): string {
  if (!isString(value)) {
    throw new TypeError('string', value, parameterName);
  }
  return value;
}

/**
 * 値が配列であることを検証し、そうでなければエラーを投げる
 * @param value 検証する値
 * @param parameterName パラメータ名（エラーメッセージ用）
 * @returns 配列として型アサーションされた値
 * @throws TypeError 値が配列でない場合
 */
export function validateArray<T>(value: unknown, parameterName = 'value'): T[] {
  if (!isArray(value)) {
    throw new TypeError('array', value, parameterName);
  }
  return value as T[];
}

/**
 * 値がBufferであることを検証し、そうでなければエラーを投げる
 * @param value 検証する値
 * @param parameterName パラメータ名（エラーメッセージ用）
 * @returns Bufferとして型アサーションされた値
 * @throws TypeError 値がBufferでない場合
 */
export function validateBuffer(
  value: unknown,
  parameterName = 'value',
): Buffer {
  if (!isBuffer(value)) {
    throw new TypeError('Buffer', value, parameterName);
  }
  return value;
}

/**
 * 数値が指定された範囲内であることを検証する
 * @param value 検証する数値
 * @param min 最小値
 * @param max 最大値
 * @param parameterName パラメータ名（エラーメッセージ用）
 * @returns 検証された数値
 * @throws ArgumentError 値が範囲外の場合
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  parameterName = 'value',
): number {
  if (value < min || value > max) {
    throw new ArgumentError(
      `${parameterName} must be between ${min} and ${max}`,
    );
  }
  return value;
}
