/**
 * MapDeltaCalculator のテスト
 */

import { calculateMapDelta } from '@/delta/MapDeltaCalculator';
import { describe, expect, it } from 'vitest';

describe('MapDeltaCalculator', () => {
  describe('calculateMapDelta', () => {
    it('同じMapの場合は変更なし', () => {
      const map1 = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const map2 = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = calculateMapDelta(map1, map2);
      expect(result.delta.changeCount).toBe(0);
    });

    it('値が変更された場合の差分を計算する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const newMap = new Map([
        ['a', 1],
        ['b', 4],
        ['c', 3],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
      expect(result.delta.changes['b']).toBeDefined();
      expect(result.delta.changes['b'].type).toBe('modified');
      expect(result.delta.changes['b'].oldValue).toBe(2);
      expect(result.delta.changes['b'].newValue).toBe(4);
    });

    it('キーが追加された場合の差分を計算する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const newMap = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
      expect(result.delta.changes['c']).toBeDefined();
      expect(result.delta.changes['c'].type).toBe('added');
      expect(result.delta.changes['c'].newValue).toBe(3);
      expect(result.delta.changes['__size__']).toBeDefined();
      expect(result.delta.changes['__size__'].oldValue).toBe(2);
      expect(result.delta.changes['__size__'].newValue).toBe(3);
    });

    it('キーが削除された場合の差分を計算する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const newMap = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
      expect(result.delta.changes['c']).toBeDefined();
      expect(result.delta.changes['c'].type).toBe('removed');
      expect(result.delta.changes['c'].oldValue).toBe(3);
      expect(result.delta.changes['__size__']).toBeDefined();
      expect(result.delta.changes['__size__'].oldValue).toBe(3);
      expect(result.delta.changes['__size__'].newValue).toBe(2);
    });

    it('複数のキーが変更された場合の差分を計算する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const newMap = new Map([
        ['a', 4],
        ['b', 5],
        ['c', 6],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBe(3);
      expect(result.delta.changes['a'].type).toBe('modified');
      expect(result.delta.changes['b'].type).toBe('modified');
      expect(result.delta.changes['c'].type).toBe('modified');
    });

    it('空のMapから要素が追加された場合の差分を計算する', () => {
      const oldMap = new Map();
      const newMap = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
      expect(result.delta.changes['a']).toBeDefined();
      expect(result.delta.changes['b']).toBeDefined();
      expect(result.delta.changes['c']).toBeDefined();
      expect(result.delta.changes['__size__']).toBeDefined();
      expect(result.delta.changes['__size__'].oldValue).toBe(0);
      expect(result.delta.changes['__size__'].newValue).toBe(3);
    });

    it('要素がすべて削除された場合の差分を計算する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const newMap = new Map();
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
      expect(result.delta.changes['a']).toBeDefined();
      expect(result.delta.changes['b']).toBeDefined();
      expect(result.delta.changes['c']).toBeDefined();
      expect(result.delta.changes['__size__']).toBeDefined();
      expect(result.delta.changes['__size__'].oldValue).toBe(3);
      expect(result.delta.changes['__size__'].newValue).toBe(0);
    });

    it('数値キーのMapの差分を計算する', () => {
      const oldMap = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ]);
      const newMap = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'four'],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
      // 数値キーは'key_3'形式に変換される可能性がある
      const hasKey3 =
        result.delta.changes['3'] || result.delta.changes['key_3'];
      expect(hasKey3).toBeDefined();
      expect(hasKey3.type).toBe('modified');
    });

    it('オブジェクト値のMapの差分を計算する', () => {
      const obj1 = { name: 'John', age: 30 };
      const obj2 = { name: 'Jane', age: 25 };
      const obj3 = { name: 'Bob', age: 35 };

      const oldMap = new Map([
        ['user1', obj1],
        ['user2', obj2],
      ]);
      const newMap = new Map([
        ['user1', obj1],
        ['user2', obj3],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.changes['user2']).toBeDefined();
    });

    it('混合型キーのMapの差分を計算する', () => {
      const oldMap = new Map<unknown, unknown>([
        ['string', 1],
        [123, 'number'],
        [true, 'boolean'],
        [null, 'null'],
      ]);
      const newMap = new Map<unknown, unknown>([
        ['string', 2],
        [123, 'number'],
        [true, 'boolean'],
        [null, 'null'],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.changes['string']).toBeDefined();
    });

    it('大きなMapでも正常に動作する', () => {
      const oldMap = new Map(
        Array.from({ length: 1000 }, (_, i) => [i, `value${i}`]),
      );
      const newMap = new Map(
        Array.from({ length: 1000 }, (_, i) =>
          i === 500 ? [i, `modified${i}`] : [i, `value${i}`],
        ),
      );

      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
      // 数値キーは'key_500'形式に変換される可能性がある
      const hasKey500 =
        result.delta.changes['500'] || result.delta.changes['key_500'];
      expect(hasKey500).toBeDefined();
    });

    it('計算時間とプロパティ数を記録する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const newMap = new Map([
        ['a', 1],
        ['b', 3],
      ]);
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.duration).toBeGreaterThan(0);
      expect(result.totalProperties).toBe(4); // 2 + 2
    });

    it('オプションを正しく適用する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const newMap = new Map([
        ['a', 1],
        ['b', 3],
      ]);
      const result = calculateMapDelta(oldMap, newMap, {
        ignoreProperties: ['__size__'],
      });
      expect(result.delta.changeCount).toBeGreaterThan(0);
    });

    it('Mapの順序は影響しない', () => {
      const map1 = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const map2 = new Map([
        ['c', 3],
        ['a', 1],
        ['b', 2],
      ]); // 順序が異なる
      const result = calculateMapDelta(map1, map2);
      expect(result.delta.changeCount).toBe(0);
    });

    it('キーと値の両方が変更された場合の差分を計算する', () => {
      const oldMap = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const newMap = new Map([
        ['a', 1],
        ['c', 3],
      ]); // 'b'が削除され、'c'が追加
      const result = calculateMapDelta(oldMap, newMap);
      expect(result.delta.changeCount).toBeGreaterThan(0);
      expect(result.delta.changes['b']).toBeDefined();
      expect(result.delta.changes['b'].type).toBe('removed');
      expect(result.delta.changes['c']).toBeDefined();
      expect(result.delta.changes['c'].type).toBe('added');
    });
  });
});
