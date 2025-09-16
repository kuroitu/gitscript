/**
 * オブジェクト差分計算器
 *
 * Phase 2.1: JavaScript オブジェクトの差分計算
 *
 * 2つのオブジェクト間の差分を計算し、プロパティレベルの変更を検出します。
 * ネストしたオブジェクトの再帰的な処理もサポートします。
 */

import { isArray, isObject, isPrimitive } from '@/core/utils/typeGuards';
import {
  DeltaCalculationOptions,
  DeltaCalculationResult,
  ObjectDelta,
  PropertyChange,
} from '@/types/ObjectDelta';

/**
 * オブジェクト差分計算器クラス
 */
export class ObjectDeltaCalculator {
  private options: Required<DeltaCalculationOptions>;

  constructor(options: DeltaCalculationOptions = {}) {
    this.options = {
      deep: true,
      arrayOrderMatters: true,
      ignoreProperties: [],
      customComparator: () => false,
      ...options,
    };
  }

  /**
   * 2つのオブジェクト間の差分を計算します
   *
   * @param oldObject 変更前のオブジェクト
   * @param newObject 変更後のオブジェクト
   * @returns 差分計算の結果
   */
  calculate(oldObject: unknown, newObject: unknown): DeltaCalculationResult {
    const startTime = performance.now();

    try {
      const delta = this.calculateDelta(oldObject, newObject);
      const duration = performance.now() - startTime;

      return {
        delta,
        duration,
        totalProperties: this.countTotalProperties(oldObject, newObject),
      };
    } catch (error) {
      const duration = performance.now() - startTime;

      return {
        delta: this.createEmptyDelta(),
        duration,
        totalProperties: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 差分を計算する内部メソッド
   */
  private calculateDelta(oldObject: unknown, newObject: unknown, visited = new WeakSet()): ObjectDelta {
    // 循環参照の検出
    if (isObject(oldObject) && visited.has(oldObject)) {
      throw new Error('Circular reference detected');
    }
    if (isObject(newObject) && visited.has(newObject)) {
      throw new Error('Circular reference detected');
    }

    // プリミティブ値の比較
    if (isPrimitive(oldObject) || isPrimitive(newObject)) {
      return this.calculatePrimitiveDelta(oldObject, newObject);
    }

    // 配列の比較
    if (isArray(oldObject) && isArray(newObject)) {
      return this.calculateArrayDelta(oldObject, newObject, visited);
    }

    // オブジェクトの比較
    if (isObject(oldObject) && isObject(newObject)) {
      return this.calculateObjectDelta(oldObject, newObject, visited);
    }

    // 型が異なる場合
    return this.calculateTypeChangeDelta(oldObject, newObject);
  }

  /**
   * プリミティブ値の差分を計算
   */
  private calculatePrimitiveDelta(
    oldValue: unknown,
    newValue: unknown,
  ): ObjectDelta {
    const changes: Record<string, PropertyChange> = {};

    if (oldValue !== newValue) {
      // 型が異なる場合は型変更として扱う
      if (typeof oldValue !== typeof newValue) {
        changes['__type__'] = {
          type: 'modified',
          oldValue: typeof oldValue,
          newValue: typeof newValue,
        };
      }
      
      changes['__value__'] = {
        type: 'modified',
        oldValue,
        newValue,
      };
    }

    return this.createDeltaFromChanges(changes);
  }

  /**
   * 配列の差分を計算
   */
  private calculateArrayDelta(
    oldArray: unknown[],
    newArray: unknown[],
    visited = new WeakSet(),
  ): ObjectDelta {
    const changes: Record<string, PropertyChange> = {};

    if (!this.options.arrayOrderMatters) {
      // 順序を考慮しない場合の簡易比較
      if (oldArray.length !== newArray.length) {
        changes['__length__'] = {
          type: 'modified',
          oldValue: oldArray.length,
          newValue: newArray.length,
        };
      }
      return this.createDeltaFromChanges(changes);
    }

    // 順序を考慮した詳細比較
    const maxLength = Math.max(oldArray.length, newArray.length);

    for (let i = 0; i < maxLength; i++) {
      const oldItem = oldArray[i];
      const newItem = newArray[i];

      if (i >= oldArray.length) {
        // 新しいアイテムが追加された
        changes[`[${i}]`] = {
          type: 'added',
          newValue: newItem,
        };
      } else if (i >= newArray.length) {
        // アイテムが削除された
        changes[`[${i}]`] = {
          type: 'removed',
          oldValue: oldItem,
        };
      } else if (!this.areValuesEqual(oldItem, newItem, visited)) {
        // アイテムが変更された
        const nestedDelta = this.options.deep
          ? this.calculateDelta(oldItem, newItem, visited)
          : undefined;

        changes[`[${i}]`] = {
          type: 'modified',
          oldValue: oldItem,
          newValue: newItem,
          nestedDelta,
        };
      }
    }

    return this.createDeltaFromChanges(changes);
  }

  /**
   * オブジェクトの差分を計算
   */
  private calculateObjectDelta(
    oldObject: Record<string, unknown>,
    newObject: Record<string, unknown>,
    visited = new WeakSet(),
  ): ObjectDelta {
    const changes: Record<string, PropertyChange> = {};
    const allKeys = new Set([
      ...Object.keys(oldObject),
      ...Object.keys(newObject),
    ]);

    for (const key of allKeys) {
      // 無視するプロパティをスキップ
      if (this.options.ignoreProperties.includes(key)) {
        continue;
      }

      const oldValue = oldObject[key];
      const newValue = newObject[key];

      // カスタム比較関数を使用
      if (this.options.customComparator(key, oldValue, newValue)) {
        continue;
      }

      if (!(key in oldObject)) {
        // プロパティが追加された
        changes[key] = {
          type: 'added',
          newValue,
        };
      } else if (!(key in newObject)) {
        // プロパティが削除された
        changes[key] = {
          type: 'removed',
          oldValue,
        };
      } else if (!this.areValuesEqual(oldValue, newValue, visited)) {
        // プロパティが変更された
        const nestedDelta = this.options.deep
          ? this.calculateDelta(oldValue, newValue, visited)
          : undefined;

        changes[key] = {
          type: 'modified',
          oldValue,
          newValue,
          nestedDelta,
        };
      }
    }

    return this.createDeltaFromChanges(changes);
  }

  /**
   * 型変更の差分を計算
   */
  private calculateTypeChangeDelta(
    oldValue: unknown,
    newValue: unknown,
  ): ObjectDelta {
    const changes: Record<string, PropertyChange> = {};

    changes['__type__'] = {
      type: 'modified',
      oldValue: typeof oldValue,
      newValue: typeof newValue,
    };

    changes['__value__'] = {
      type: 'modified',
      oldValue,
      newValue,
    };

    return this.createDeltaFromChanges(changes);
  }

  /**
   * 2つの値が等しいかどうかを判定
   */
  private areValuesEqual(oldValue: unknown, newValue: unknown, visited = new WeakSet()): boolean {
    // 厳密等価性チェック
    if (oldValue === newValue) {
      return true;
    }

    // null/undefined のチェック
    if (oldValue == null || newValue == null) {
      return oldValue === newValue;
    }

    // 循環参照の検出
    if (isObject(oldValue) && visited.has(oldValue)) {
      throw new Error('Circular reference detected');
    }

    // オブジェクトの深い比較
    if (this.options.deep && isObject(oldValue) && isObject(newValue)) {
      visited.add(oldValue);
      try {
        const delta = this.calculateDelta(oldValue, newValue);
        return delta.changeCount === 0;
      } finally {
        visited.delete(oldValue);
      }
    }

    return false;
  }

  /**
   * 変更情報からObjectDeltaを作成
   */
  private createDeltaFromChanges(
    changes: Record<string, PropertyChange>,
  ): ObjectDelta {
    const addedCount = Object.values(changes).filter(
      (c) => c.type === 'added',
    ).length;
    const removedCount = Object.values(changes).filter(
      (c) => c.type === 'removed',
    ).length;
    const modifiedCount = Object.values(changes).filter(
      (c) => c.type === 'modified',
    ).length;

    return {
      changes,
      changeCount: addedCount + removedCount + modifiedCount,
      addedCount,
      removedCount,
      modifiedCount,
    };
  }

  /**
   * 空の差分を作成
   */
  private createEmptyDelta(): ObjectDelta {
    return {
      changes: {},
      changeCount: 0,
      addedCount: 0,
      removedCount: 0,
      modifiedCount: 0,
    };
  }

  /**
   * 総プロパティ数をカウント
   */
  private countTotalProperties(oldObject: unknown, newObject: unknown): number {
    let count = 0;

    if (isObject(oldObject)) {
      count += Object.keys(oldObject).length;
    }

    if (isObject(newObject)) {
      count += Object.keys(newObject).length;
    }

    return count;
  }
}
