import { ArgumentError } from '@/types';

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
