import {
  calculateHashFromObject,
  calculateHashFromString,
} from '@/core/hash/calculators';
import { isValidHash } from '@/core/hash/validate/is-valid';
import { isObject } from '@/core/utils';

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

  const calculatedHash = calculateHashFromString(content);
  return hash.toLowerCase() === calculatedHash.toLowerCase();
}

/**
 * オブジェクトのハッシュ整合性を検証する
 * @param hash 検証するハッシュ
 * @param obj 元のオブジェクト
 * @returns ハッシュがオブジェクトと一致するかどうか
 */
export function verifyObjectHashIntegrity(hash: string, obj: unknown): boolean {
  if (!isValidHash(hash) || !isObject(obj)) {
    return false;
  }

  const calculatedHash = calculateHashFromObject(obj);
  return hash.toLowerCase() === calculatedHash.toLowerCase();
}
