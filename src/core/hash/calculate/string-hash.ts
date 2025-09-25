import { calculateSha1, calculateSha1FromMultiple } from '@/core/crypto';
import { validateArray, validateString } from '@/core/utils';

/**
 * 文字列からSHA-1ハッシュを計算する
 * @param content ハッシュ化する文字列
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromString(content: string): string {
  validateString(content, 'content');
  return calculateSha1(content);
}

/**
 * 複数の文字列を結合してハッシュを計算する
 * @param contents 結合する文字列の配列
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromStrings(contents: string[]): string {
  validateArray<string>(contents, 'contents');
  return calculateSha1FromMultiple(contents);
}
