import { InvalidHashError } from '@/core/hash/errors';
import { isValidHash } from '@/core/hash/validate';
import { validateRange } from '@/core/utils';

/**
 * ハッシュの短縮形式を生成する
 * @param hash 完全なハッシュ
 * @param length 短縮する長さ（デフォルト: 7）
 * @returns 短縮されたハッシュ
 */
export function shortenHash(hash: string, length = 7): string {
  if (!isValidHash(hash)) {
    throw new InvalidHashError(`Invalid hash format: ${hash}`);
  }

  validateRange(length, 4, 40, 'length');

  return hash.substring(0, length);
}
