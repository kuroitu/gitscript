import { MicrodiffResult } from '@/patch/microdiff';
import { Patch } from '@/patch/types';

/**
 * パッチをmicrodiffの結果に変換
 * @param patch パッチ
 * @returns microdiffの結果
 */
export function convertPatchToMicrodiffResult(patch: Patch): MicrodiffResult {
  return patch.diff;
}

/**
 * microdiffの結果をパッチに変換
 * @param microdiffResult microdiffの結果
 * @returns パッチ
 */
export function convertMicrodiffResultToPatch(
  microdiffResult: MicrodiffResult,
): Patch {
  return {
    diff: microdiffResult,
  };
}
