import { isString } from '@/core/utils';

/**
 * ハッシュの形式を検証する
 * @param hash 検証するハッシュ文字列
 * @returns 有効なハッシュ形式かどうか
 */
export function isValidHash(hash: string): boolean {
  if (!isString(hash)) {
    return false;
  }

  // SHA-1ハッシュは40文字の16進数文字列
  const sha1Regex = /^[a-f0-9]{40}$/i;
  return sha1Regex.test(hash);
}

/**
 * 短縮ハッシュの形式を検証する
 * @param shortHash 検証する短縮ハッシュ
 * @param minLength 最小長（デフォルト: 4）
 * @param maxLength 最大長（デフォルト: 40）
 * @returns 有効な短縮ハッシュ形式かどうか
 */
export function isValidShortHash(
  shortHash: string,
  minLength = 4,
  maxLength = 40,
): boolean {
  if (!isString(shortHash)) {
    return false;
  }

  if (shortHash.length < minLength || shortHash.length > maxLength) {
    return false;
  }

  const hexRegex = /^[a-f0-9]+$/i;
  return hexRegex.test(shortHash);
}
