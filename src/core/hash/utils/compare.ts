import { InvalidHashError } from '@/core/hash/errors';
import { isValidHash } from '@/core/hash/validate';

/**
 * 2つのハッシュを比較する
 * @param hash1 比較するハッシュ1
 * @param hash2 比較するハッシュ2
 * @returns ハッシュが等しいかどうか
 */
export function compareHashes(hash1: string, hash2: string): boolean {
  if (!isValidHash(hash1)) {
    throw new InvalidHashError(`Invalid hash format: ${hash1}`);
  }
  if (!isValidHash(hash2)) {
    throw new InvalidHashError(`Invalid hash format: ${hash2}`);
  }

  return hash1.toLowerCase() === hash2.toLowerCase();
}
