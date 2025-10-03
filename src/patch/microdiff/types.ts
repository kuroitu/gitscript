import { Difference } from 'microdiff';

/**
 * microdiffのオプション
 */
export interface MicrodiffOptions {
  /** 循環参照の処理 */
  cyclesFix?: boolean;
}

/** microdiffの変更タイプ */
export const MicrodiffChangeType = {
  /** 作成 */
  Create: 'CREATE',
  /** 削除 */
  Remove: 'REMOVE',
  /** 変更 */
  Change: 'CHANGE',
} as const;
export type MicrodiffChangeType =
  (typeof MicrodiffChangeType)[keyof typeof MicrodiffChangeType];

/** microdiffのソース */
export type MicrodiffSource = Record<string, unknown> | unknown[];

/** microdiffのパス */
export type MicrodiffPath = Difference['path'];

/** microdiffの変更オブジェクト */
export type MicrodiffChange = Difference;

/** microdiffの結果 */
export type MicrodiffResult = MicrodiffChange[];
