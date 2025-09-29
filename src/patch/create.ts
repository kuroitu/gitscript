import { convertMicrodiffResultToPatch } from '@/patch/convert';
import { calculateDiff, MicrodiffSource } from '@/patch/microdiff';
import { Patch } from '@/patch/types';

/**
 * パッチを作成
 * @param oldSource 変更前のオブジェクト
 * @param newSource 変更後のオブジェクト
 * @returns パッチ
 */
export function createPatch(
  oldSource: MicrodiffSource,
  newSource: MicrodiffSource,
): Patch {
  const result = calculateDiff(oldSource, newSource);
  return convertMicrodiffResultToPatch(result);
}
