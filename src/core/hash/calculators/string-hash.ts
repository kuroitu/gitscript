import { calculateSha1, calculateSha1FromMultiple } from '@/core/crypto';

/**
 * 文字列からSHA-1ハッシュを計算する
 * @param content ハッシュ化する文字列
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromString(content: string): string {
  return calculateSha1(content);
}

/**
 * 複数の文字列を結合してハッシュを計算する
 * @param contents 結合する文字列の配列
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromStrings(contents: string[]): string {
  return calculateSha1FromMultiple(contents);
}
