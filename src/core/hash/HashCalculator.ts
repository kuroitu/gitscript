import {
  calculateSha1,
  calculateSha1FromMultiple,
} from '@/core/crypto/CryptoProvider';
import { stringifyCompact } from '@/core/serialization/JsonProvider';
import {
  validateArray,
  validateBuffer,
  validateString,
} from '@/core/utils/validators';

/**
 * 文字列からSHA-1ハッシュを計算する
 * @param content ハッシュ化する文字列
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHash(content: string): string {
  validateString(content, 'content');
  return calculateSha1(content);
}

/**
 * オブジェクトからSHA-1ハッシュを計算する
 * @param obj ハッシュ化するオブジェクト
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromObject(obj: unknown): string {
  // nullやundefinedを適切に処理
  let content: string;
  if (obj === null) {
    content = 'null';
  } else if (obj === undefined) {
    content = 'undefined';
  } else {
    const serialized = stringifyCompact(obj);
    // JSON.stringifyがundefinedを返した場合（関数など）の処理
    content = serialized === undefined ? '[Function]' : serialized;
  }
  return calculateHash(content);
}

/**
 * バッファからSHA-1ハッシュを計算する
 * @param buffer ハッシュ化するバッファ
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromBuffer(buffer: Buffer): string {
  validateBuffer(buffer, 'buffer');
  return calculateSha1(buffer);
}

/**
 * 複数の文字列を結合してハッシュを計算する
 * @param contents 結合する文字列の配列
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromMultiple(contents: string[]): string {
  validateArray<string>(contents, 'contents');
  return calculateSha1FromMultiple(contents);
}
