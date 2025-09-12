import {
  calculateHash,
  calculateHashFromObject,
} from '@/core/hash/HashCalculator';
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
 * ハッシュの形式を検証し、無効な場合はエラーを投げる
 * @param hash 検証するハッシュ文字列
 * @returns 検証されたハッシュ文字列
 * @throws Error 無効なハッシュ形式の場合
 */
export function validateHash(hash: string): string {
  if (!isValidHash(hash)) {
    throw new Error(`Invalid hash format: ${hash}`);
  }
  return hash;
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

/**
 * ハッシュの整合性を検証する
 * @param hash 検証するハッシュ
 * @param content 元のコンテンツ
 * @returns ハッシュがコンテンツと一致するかどうか
 */
export function verifyHashIntegrity(hash: string, content: string): boolean {
  if (!isValidHash(hash)) {
    return false;
  }

  const calculatedHash = calculateHash(content);
  return hash.toLowerCase() === calculatedHash.toLowerCase();
}

/**
 * オブジェクトのハッシュ整合性を検証する
 * @param hash 検証するハッシュ
 * @param obj 元のオブジェクト
 * @returns ハッシュがオブジェクトと一致するかどうか
 */
export function verifyObjectHashIntegrity(hash: string, obj: unknown): boolean {
  if (!isValidHash(hash)) {
    return false;
  }

  const calculatedHash = calculateHashFromObject(obj);
  return hash.toLowerCase() === calculatedHash.toLowerCase();
}
