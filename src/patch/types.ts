import { MicrodiffResult } from '@/patch/microdiff';

/**
 * パッチ
 */
export interface Patch {
  diff: MicrodiffResult;
}
