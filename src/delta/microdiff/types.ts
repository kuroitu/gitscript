import { Difference } from 'microdiff';

/**
 * microdiffのオプション
 */
export interface MicrodiffOptions {
  /** 循環参照の処理 */
  cyclesFix?: boolean;
  /** 配列の順序を無視するかどうか */
  ignoreArrays?: boolean;
  /** 無視するキーの配列 */
  ignoreKeys?: string[];
}

/** microdiffの変更タイプ */
export const MicrodiffChangeType = {
  Create: 'CREATE',
  Remove: 'REMOVE',
  Change: 'CHANGE',
} as const;
export type MicrodiffChangeType = (typeof MicrodiffChangeType)[keyof typeof MicrodiffChangeType];

/** microdiffの変更オブジェクト */
export type MicrodiffChange = Difference;

/** microdiffの結果 */
export type MicrodiffResult = MicrodiffChange[];

/** microdiffのパス */
export type MicrodiffPath = Difference['path'];
