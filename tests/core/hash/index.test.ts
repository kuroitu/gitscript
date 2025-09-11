import {
  calculateHash,
  calculateHashFromBuffer,
  calculateHashFromMultiple,
  calculateHashFromObject,
} from '@/core/hash/HashCalculator';
import {
  compareHashes,
  detectHashCollision,
  expandShortHash,
  removeDuplicateHashes,
  shortenHash,
} from '@/core/hash/HashUtils';
import {
  isValidHash,
  verifyHashIntegrity,
  verifyObjectHashIntegrity,
} from '@/core/hash/HashValidator';
import { InvalidHashError, TypeError } from '@/types/Errors';
import { describe, expect, it } from 'vitest';

describe('Hash Module Integration', () => {
  it('should work together for complete hash workflow', () => {
    // 1. オブジェクトからハッシュを計算
    const obj = { name: 'test', value: 123, nested: { data: 'example' } };
    const hash = calculateHashFromObject(obj);

    // 2. ハッシュの形式を検証
    expect(isValidHash(hash)).toBe(true);

    // 3. オブジェクトの整合性を検証
    expect(verifyObjectHashIntegrity(hash, obj)).toBe(true);

    // 4. ハッシュを短縮
    const shortHash = shortenHash(hash, 8);
    expect(shortHash).toHaveLength(8);

    // 5. 短縮ハッシュから完全なハッシュを復元
    const expandedHash = expandShortHash(shortHash, [hash]);
    expect(expandedHash).toBe(hash);

    // 6. ハッシュの比較
    expect(compareHashes(hash, expandedHash!)).toBe(true);
  });

  it('should handle multiple objects and detect uniqueness', () => {
    const objects = [
      { id: 1, name: 'first' },
      { id: 2, name: 'second' },
      { id: 3, name: 'third' },
    ];

    // 各オブジェクトのハッシュを計算
    const hashes = objects.map((obj) => calculateHashFromObject(obj));

    // すべてのハッシュが有効であることを確認
    hashes.forEach((hash) => {
      expect(isValidHash(hash)).toBe(true);
    });

    // 重複がないことを確認
    const collision = detectHashCollision(hashes);
    expect(collision).toBeNull();

    // 重複を除去しても同じ数であることを確認
    const uniqueHashes = removeDuplicateHashes(hashes);
    expect(uniqueHashes).toHaveLength(hashes.length);
  });

  it('should handle string content workflow', () => {
    const content = 'This is a test content for hash calculation';

    // 1. 文字列からハッシュを計算
    const hash = calculateHash(content);

    // 2. ハッシュの形式を検証
    expect(isValidHash(hash)).toBe(true);

    // 3. 整合性を検証
    expect(verifyHashIntegrity(hash, content)).toBe(true);

    // 4. 同じ内容で再計算して一貫性を確認
    const hash2 = calculateHash(content);
    expect(compareHashes(hash, hash2)).toBe(true);
  });

  it('should handle buffer content workflow', () => {
    const buffer = Buffer.from('Binary content for testing', 'utf8');

    // 1. バッファからハッシュを計算
    const hash = calculateHashFromBuffer(buffer);

    // 2. ハッシュの形式を検証
    expect(isValidHash(hash)).toBe(true);

    // 3. 同じバッファで再計算して一貫性を確認
    const hash2 = calculateHashFromBuffer(buffer);
    expect(compareHashes(hash, hash2)).toBe(true);
  });

  it('should handle multiple string content workflow', () => {
    const contents = ['part1', 'part2', 'part3'];

    // 1. 複数文字列からハッシュを計算
    const hash = calculateHashFromMultiple(contents);

    // 2. ハッシュの形式を検証
    expect(isValidHash(hash)).toBe(true);

    // 3. 順序を変えて計算して異なるハッシュになることを確認
    const reversedContents = [...contents].reverse();
    const reversedHash = calculateHashFromMultiple(reversedContents);
    expect(compareHashes(hash, reversedHash)).toBe(false);
  });

  it('should handle error cases gracefully', () => {
    // 無効なハッシュでの操作
    const invalidHash = 'invalid-hash';

    expect(() => shortenHash(invalidHash)).toThrow(InvalidHashError);
    expect(() => compareHashes(invalidHash, 'valid-hash')).toThrow(
      InvalidHashError,
    );
    expect(verifyHashIntegrity(invalidHash, 'content')).toBe(false);

    // 無効な入力での計算
    expect(() => calculateHash(123 as any)).toThrow(TypeError);
    expect(() => calculateHashFromBuffer('not-buffer' as any)).toThrow(
      TypeError,
    );
    expect(() => calculateHashFromMultiple('not-array' as any)).toThrow(
      TypeError,
    );
  });
});
