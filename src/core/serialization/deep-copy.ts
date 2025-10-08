import { SerializationError } from '@/core/serialization/errors';
import { DeepCopyResult } from '@/core/serialization/types';
import { isNativeError } from '@/core/utils';
import { cloneDeep } from 'lodash';

/**
 * オブジェクトの深いコピーを作成する
 * @param obj コピーするオブジェクト
 * @returns 深いコピーの結果
 */
export function deepCopy<T = unknown>(obj: T): DeepCopyResult<T> {
  try {
    // 純粋なオブジェクトの場合は直接lodashのcloneDeepを使用
    const copied = cloneDeep(obj);

    return {
      data: copied as T,
    };
  } catch (error) {
    throw new SerializationError(
      `Failed to deep copy object: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}
