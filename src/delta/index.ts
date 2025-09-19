/**
 * 差分計算モジュール
 *
 * Phase 2.1-2.2: オブジェクト・配列・Set・Map の差分計算
 *
 * microdiffライブラリを使用した差分計算機能を提供します。
 */

export { calculateArrayDelta } from '@/delta/ArrayDeltaCalculator';
export { calculateObjectDelta } from '@/delta/ObjectDeltaCalculator';
export {
  calculateMapDelta,
  calculateSetDelta,
} from '@/delta/SetMapDeltaCalculator';

// microdiffラッパーのエクスポート
export {
  calculateDiff,
  filterValidChanges,
  getFirstKey,
  getLastKey,
  isValidChange,
  pathToString,
  type MicrodiffChange,
  type MicrodiffOptions,
  type MicrodiffResult,
} from '@/delta/MicrodiffWrapper';

// 共通ユーティリティのエクスポート
export {
  convertArrayPathToChangeKey,
  convertMicrodiffChangeToPropertyChange,
  convertObjectPathToChangeKey,
  convertSetMapPathToChangeKey,
  createDeltaFromChanges,
  handleDeltaCalculationError,
} from '@/delta/DeltaUtils';

// 型定義の再エクスポート
export { DeltaCalculationError } from '@/types';
export type {
  ChangeKey,
  DeltaCalculationOptions,
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
} from '@/types';
