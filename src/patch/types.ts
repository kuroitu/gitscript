import { MicrodiffResult } from '@/patch/microdiff';

/**
 * パッチ
 */
export interface Patch {
  /** microdiffの結果 */
  diff: MicrodiffResult;
}
