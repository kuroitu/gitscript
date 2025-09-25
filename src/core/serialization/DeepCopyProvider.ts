/**
 * 深いコピー機能
 *
 * 純粋なオブジェクト（関数やシンボルを含まない）の深いコピーを提供し、
 * 循環参照を適切に処理する
 */

import { detectDataType } from '@/core/serialization/detector';
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
  const startTime = performance.now();

  try {
    // 純粋なオブジェクトの場合は直接lodashのcloneDeepを使用
    const copied = cloneDeep(obj);
    const duration = performance.now() - startTime;

    return {
      data: copied as T,
      typeInfo: detectDataType(copied),
      duration,
    };
  } catch (error) {
    throw new SerializationError(
      `Failed to deep copy object: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}
