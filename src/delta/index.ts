/**
 * 差分計算モジュール
 *
 * Phase 2.1-2.2: オブジェクト・配列・Set・Map・プリミティブ の差分計算
 *
 * microdiffライブラリを使用した差分計算機能を提供します。
 */

// ルート関数（推奨）
export { calculateDelta } from '@/delta/DeltaCalculator';

// 個別の差分計算器
export { calculateArrayDelta } from '@/delta/ArrayDeltaCalculator';
export { calculateMapDelta } from '@/delta/MapDeltaCalculator';
export { calculateObjectDelta } from '@/delta/ObjectDeltaCalculator';
export { calculatePrimitiveDelta } from '@/delta/PrimitiveDeltaCalculator';
export { calculateSetDelta } from '@/delta/SetDeltaCalculator';

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
} from '@/delta/microdiff/wrapper';

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
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
  PropertyChangeType,
} from '@/types';
