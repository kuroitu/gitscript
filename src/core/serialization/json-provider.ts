import { SerializationError } from '@/core/serialization/errors';
import { isNativeError } from '@/core/utils';

/**
 * オブジェクトをコンパクトなJSON文字列にシリアライズする
 * @param obj シリアライズするオブジェクト
 * @returns コンパクトなJSON文字列
 * @throws SerializationError シリアライズに失敗した場合
 */
export function stringifyCompact(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 0);
  } catch (error) {
    throw new SerializationError(
      `Failed to stringify object: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * JSON文字列をオブジェクトにデシリアライズする
 * @param data デシリアライズするJSON文字列
 * @returns デシリアライズされたオブジェクト
 * @throws SerializationError デシリアライズに失敗した場合
 */
export function deserialize(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch (error) {
    throw new SerializationError(
      `Failed to deserialize: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}
