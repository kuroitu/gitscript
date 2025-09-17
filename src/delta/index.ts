/**
 * 差分計算モジュール
 *
 * Phase 2.1-2.2: オブジェクト・配列・Set・Map の差分計算
 *
 * microdiffライブラリを使用した差分計算機能を提供します。
 */

export { calculateObjectDelta } from './ObjectDeltaCalculator';
export { calculateArrayDelta } from './ArrayDeltaCalculator';
export { calculateSetDelta, calculateMapDelta } from './SetMapDeltaCalculator';

// microdiffラッパーのエクスポート
export {
  calculateDiff,
  calculateObjectDiff,
  calculateArrayDiff,
  isValidChange,
  filterValidChanges,
  pathToString,
  getLastKey,
  getFirstKey,
  type MicrodiffChange,
  type MicrodiffOptions,
  type MicrodiffResult,
} from './MicrodiffWrapper';

// 型定義の再エクスポート
export type {
  DeltaCalculationOptions,
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
  ChangeKey,
} from '@/types/ObjectDelta';
