import { isValidHash, isValidShortHash } from '@/core/hash/HashValidator';
import { validateRange } from '@/core/utils/validators';
import { InvalidHashError } from '@/types/Errors';

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

/**
 * 短縮ハッシュから完全なハッシュを検索する
 * @param shortHash 短縮ハッシュ
 * @param candidates 候補となる完全なハッシュの配列
 * @returns マッチする完全なハッシュ、見つからない場合はnull
 */
export function expandShortHash(shortHash: string, candidates: string[]): string | null {
    if (!isValidShortHash(shortHash)) {
        return null;
    }

    const lowerShortHash = shortHash.toLowerCase();

    for (const candidate of candidates) {
        if (!isValidHash(candidate)) {
            continue;
        }

        if (candidate.toLowerCase().startsWith(lowerShortHash)) {
            return candidate;
        }
    }

    return null;
}

/**
 * ハッシュの衝突を検出する
 * @param hashes 検証するハッシュの配列
 * @returns 衝突しているハッシュのペア、衝突がない場合はnull
 */
export function detectHashCollision(hashes: string[]): [string, string] | null {
    const seen = new Set<string>();

    for (const hash of hashes) {
        if (!isValidHash(hash)) {
            continue;
        }

        const lowerHash = hash.toLowerCase();
        if (seen.has(lowerHash)) {
            // 衝突を発見
            for (const seenHash of seen) {
                if (seenHash === lowerHash) {
                    return [seenHash, hash];
                }
            }
        }
        seen.add(lowerHash);
    }

    return null;
}

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