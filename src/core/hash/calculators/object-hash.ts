import {
  calculateHashFromString,
  calculateHashFromStrings,
} from '@/core/hash/calculators/string-hash';
import { stringifyCompact } from '@/core/serialization';
import { isNull, isUndefined } from '@/core/utils';

/**
 * オブジェクトからSHA-1ハッシュを計算する
 * @param obj ハッシュ化するオブジェクト
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromObject(obj: object): string {
  const content = convertObjectsToStrings([obj]);
  return calculateHashFromString(content[0]);
}

/**
 * 複数のオブジェクトを結合してハッシュを計算する
 * @param objects 結合するオブジェクトの配列
 * @returns SHA-1ハッシュ（40文字の16進数文字列）
 */
export function calculateHashFromObjects(objects: object[]): string {
  const content = convertObjectsToStrings(objects);
  return calculateHashFromStrings(content);
}

/**
 * オブジェクトを文字列に変換する
 * @param objects 結合するオブジェクトの配列
 * @returns 文字列の配列
 */
function convertObjectsToStrings(objects: object[]): string[] {
  return objects.map((obj) => {
    if (isNull(obj)) {
      return 'null';
    } else if (isUndefined(obj)) {
      return 'undefined';
    } else {
      const serialized = stringifyCompact(obj);
      return isUndefined(serialized) ? '[Function]' : serialized;
    }
  });
}
