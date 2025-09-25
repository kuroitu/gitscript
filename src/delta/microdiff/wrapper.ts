import { isNativeError } from '@/core/utils';
import { DeltaCalculationError } from '@/delta/errors';
import { MicrodiffOptions, MicrodiffResult } from '@/delta/microdiff/types';
import microdiff from 'microdiff';

/**
 * オブジェクトの差分を計算
 *
 * @param oldObject 変更前のオブジェクト
 * @param newObject 変更後のオブジェクト
 * @param options オプション
 * @returns 差分の結果
 */
export function calculateDiff(
  oldObject: Record<string, unknown> | unknown[],
  newObject: Record<string, unknown> | unknown[],
  options: MicrodiffOptions = {},
): MicrodiffResult {
  try {
    return microdiff(oldObject, newObject, options);
  } catch (error) {
    throw new DeltaCalculationError(
      'Failed to calculate diff using microdiff',
      isNativeError(error) ? error : undefined,
    );
  }
}
