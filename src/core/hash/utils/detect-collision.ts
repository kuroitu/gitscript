import { isValidHash } from '@/core/hash/validate';

/**
 * ハッシュの衝突を検出する
 * @param hashes 検証するハッシュの配列
 * @returns 衝突しているハッシュのペア、衝突がない場合はnull
 */
export function detectHashCollision(hashes: string[]): [string, string] | null {
  if (hashes.length <= 1) {
    return null;
  }

  const seen = new Map<string, string>();

  for (const hash of hashes) {
    if (!isValidHash(hash)) {
      continue;
    }

    const lowerHash = hash.toLowerCase();
    const existingHash = seen.get(lowerHash);

    if (existingHash !== undefined) {
      return [existingHash, hash];
    }

    seen.set(lowerHash, hash);
  }

  return null;
}
