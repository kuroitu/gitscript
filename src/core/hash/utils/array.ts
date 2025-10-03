import { isValidHash } from '@/core/hash/validate';

/**
 * ハッシュの配列をソートする
 * @param hashes ソートするハッシュの配列
 * @returns ソートされたハッシュの配列
 */
export function sortHashes(hashes: string[]): string[] {
  return hashes
    .filter((hash) => isValidHash(hash))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

/**
 * 重複するハッシュを除去する
 * @param hashes 重複を除去するハッシュの配列
 * @returns 重複が除去されたハッシュの配列
 */
export function removeDuplicateHashes(hashes: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const hash of hashes) {
    if (!isValidHash(hash)) {
      continue;
    }

    const lowerHash = hash.toLowerCase();
    if (!seen.has(lowerHash)) {
      seen.add(lowerHash);
      result.push(hash);
    }
  }

  return result;
}

/**
 * ハッシュの配列から指定されたハッシュを検索する
 * @param hashes 検索対象のハッシュの配列
 * @param target 検索するハッシュ
 * @returns 見つかった場合はインデックス、見つからない場合は-1
 */
export function findHashIndex(hashes: string[], target: string): number {
  if (!isValidHash(target)) {
    return -1;
  }

  const lowerTarget = target.toLowerCase();

  for (let i = 0; i < hashes.length; i++) {
    if (isValidHash(hashes[i]) && hashes[i].toLowerCase() === lowerTarget) {
      return i;
    }
  }

  return -1;
}
