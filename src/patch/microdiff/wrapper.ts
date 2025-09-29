import { isNativeError } from '@/core';
import { DeltaCalculationError } from '@/patch/errors';
import {
  MicrodiffOptions,
  MicrodiffResult,
  MicrodiffSource,
} from '@/patch/microdiff/types';
import microdiff from 'microdiff';

/**
 * オブジェクトの差分を計算
 *
 * @param oldSource 変更前のオブジェクト
 * @param newSource 変更後のオブジェクト
 * @param options オプション
 * @returns 差分の結果
 */
export function calculateDiff(
  oldSource: MicrodiffSource,
  newSource: MicrodiffSource,
  options: MicrodiffOptions = {},
): MicrodiffResult {
  try {
    return microdiff(oldSource, newSource, options);
  } catch (error) {
    throw new DeltaCalculationError(
      'Failed to calculate diff using microdiff',
      isNativeError(error) ? error : undefined,
    );
  }
}
