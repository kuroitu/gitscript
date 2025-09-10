import { Author } from '@/types/Author';

/**
 * コミットオブジェクト
 */
export interface Commit {
  /** コミットハッシュ */
  hash: string;
  /** コミットメッセージ */
  message: string;
  /** 作成日時 */
  timestamp: Date;
  /** 作成者情報 */
  author: Author;
  /** 変更されたオブジェクトのハッシュ */
  objects: string[];
}
