/**
 * 暗号化機能の低級レイヤ
 *
 * 外部ライブラリ（crypto）の直接使用を避け、
 * 例外ハンドリングを行うラッパー層
 */

import { isBuffer } from '@/core/utils';
import { GitScriptError } from '@/types';
import { createHash as nodeCreateHash } from 'crypto';
import { isNativeError } from 'util/types';

/**
 * 暗号化関連のエラー
 */
export class CryptoError extends GitScriptError {
  constructor(message: string, cause?: Error) {
    super(`Crypto error: ${message}`, 'CRYPTO_ERROR');
    this.name = 'CryptoError';
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * SHA-1ハッシュを計算する
 * @param data ハッシュ化するデータ
 * @param encoding データのエンコーディング（デフォルト: 'utf8'）
 * @returns SHA-1ハッシュ（16進数文字列）
 * @throws CryptoError ハッシュ計算に失敗した場合
 */
export function calculateSha1(
  data: string | Buffer,
  encoding: BufferEncoding = 'utf8',
): string {
  try {
    const hash = nodeCreateHash('sha1');

    if (isBuffer(data)) {
      hash.update(data);
    } else {
      hash.update(data, encoding);
    }

    return hash.digest('hex');
  } catch (error) {
    throw new CryptoError(
      `Failed to calculate SHA-1 hash: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * 複数のデータを結合してハッシュを計算する
 * @param dataList 結合するデータの配列
 * @param separator データ間の区切り文字（デフォルト: '\0'）
 * @param encoding データのエンコーディング（デフォルト: 'utf8'）
 * @returns SHA-1ハッシュ（16進数文字列）
 * @throws CryptoError ハッシュ計算に失敗した場合
 */
export function calculateSha1FromMultiple(
  dataList: (string | Buffer)[],
  separator = '\0',
  encoding: BufferEncoding = 'utf8',
): string {
  try {
    const hash = nodeCreateHash('sha1');

    for (let i = 0; i < dataList.length; i++) {
      const data = dataList[i];

      if (isBuffer(data)) {
        hash.update(data);
      } else {
        hash.update(data, encoding);
      }

      // 最後の要素以外は区切り文字を追加
      if (i < dataList.length - 1) {
        hash.update(separator, encoding);
      }
    }

    return hash.digest('hex');
  } catch (error) {
    throw new CryptoError(
      `Failed to calculate SHA-1 hash from multiple data: ${isNativeError(error) ? error.message : 'Unknown error'}`,
      isNativeError(error) ? error : undefined,
    );
  }
}

/**
 * ハッシュ計算が利用可能かどうかをチェックする
 * @returns 利用可能な場合true
 */
export function isCryptoAvailable(): boolean {
  try {
    // 簡単なテストでcrypto機能が利用可能かチェック
    nodeCreateHash('sha1').update('test').digest('hex');
    return true;
  } catch {
    return false;
  }
}
