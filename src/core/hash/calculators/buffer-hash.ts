import { calculateSha1, calculateSha1FromMultiple } from '@/core/crypto';
import { validateArray, validateBuffer } from '@/core/utils';

/**
 * バッファからSHA-1ハッシュを計算する
 * @param buffer ハッシュ化するバッファ
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromBuffer(buffer: Buffer): string {
  validateBuffer(buffer, 'buffer');
  return calculateSha1(buffer);
}

/**
 * 複数のバッファを結合してハッシュを計算する
 * @param buffers 結合するバッファの配列
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromBuffers(buffers: Buffer[]): string {
  validateArray<Buffer>(buffers, 'buffers');
  return calculateSha1FromMultiple(buffers);
}
