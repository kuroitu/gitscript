import { isValidHash, isValidShortHash } from '@/core/hash/validate';

/**
 * 短縮ハッシュから完全なハッシュを検索する
 * @param shortHash 短縮ハッシュ
 * @param candidates 候補となる完全なハッシュの配列
 * @returns マッチする完全なハッシュ、見つからない場合はnull
 */
export function expandShortHash(
  shortHash: string,
  candidates: string[],
): string | null {
  if (!isValidShortHash(shortHash)) {
    return null;
  }

  const lowerShortHash = shortHash.toLowerCase();

  return (
    candidates.find(
      (candidate) =>
        isValidHash(candidate) &&
        candidate.toLowerCase().startsWith(lowerShortHash),
    ) ?? null
  );
}
