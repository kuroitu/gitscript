/**
 * ObjectDeltaCalculator のテスト
 *
 * Phase 2.1: JavaScript オブジェクトの差分計算
 */

import { calculateObjectDelta } from '@/delta/ObjectDeltaCalculator';
import { CircularReferenceError } from '@/types/Errors';
import { describe, expect, it } from 'vitest';

describe('calculateObjectDelta', () => {
  describe('基本的なオブジェクト差分計算', () => {
    it('同じオブジェクトの差分は空であるべき', () => {
      const obj = { a: 1, b: 'test', c: true };
      const result = calculateObjectDelta(obj, obj);

      expect(result.delta.changeCount).toBe(0);
      expect(result.delta.addedCount).toBe(0);
      expect(result.delta.removedCount).toBe(0);
      expect(result.delta.modifiedCount).toBe(0);
      expect(Object.keys(result.delta.changes)).toHaveLength(0);
    });

    it('プロパティが追加された場合の差分を正しく計算する', () => {
      const oldObj = { a: 1, b: 'test' };
      const newObj = { a: 1, b: 'test', c: true };
      const result = calculateObjectDelta(oldObj, newObj);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.addedCount).toBe(1);
      expect(result.delta.removedCount).toBe(0);
      expect(result.delta.modifiedCount).toBe(0);

      const change = result.delta.changes.c;
      expect(change.type).toBe('added');
      expect(change.newValue).toBe(true);
      expect(change.oldValue).toBeUndefined();
    });

    it('プロパティが削除された場合の差分を正しく計算する', () => {
      const oldObj = { a: 1, b: 'test', c: true };
      const newObj = { a: 1, b: 'test' };
      const result = calculateObjectDelta(oldObj, newObj);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.addedCount).toBe(0);
      expect(result.delta.removedCount).toBe(1);
      expect(result.delta.modifiedCount).toBe(0);

      const change = result.delta.changes.c;
      expect(change.type).toBe('removed');
      expect(change.oldValue).toBe(true);
      expect(change.newValue).toBeUndefined();
    });

    it('プロパティが変更された場合の差分を正しく計算する', () => {
      const oldObj = { a: 1, b: 'test', c: true };
      const newObj = { a: 2, b: 'test', c: true };
      const result = calculateObjectDelta(oldObj, newObj);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.addedCount).toBe(0);
      expect(result.delta.removedCount).toBe(0);
      expect(result.delta.modifiedCount).toBe(1);

      const change = result.delta.changes.a;
      expect(change.type).toBe('modified');
      expect(change.oldValue).toBe(1);
      expect(change.newValue).toBe(2);
    });

    it('複数の変更が同時に発生した場合の差分を正しく計算する', () => {
      const oldObj = { a: 1, b: 'test', c: true };
      const newObj = { a: 2, b: 'test', d: 'new' };
      const result = calculateObjectDelta(oldObj, newObj);

      expect(result.delta.changeCount).toBe(3);
      expect(result.delta.addedCount).toBe(1);
      expect(result.delta.removedCount).toBe(1);
      expect(result.delta.modifiedCount).toBe(1);

      expect(result.delta.changes.a.type).toBe('modified');
      expect(result.delta.changes.c.type).toBe('removed');
      expect(result.delta.changes.d.type).toBe('added');
    });
  });

  describe('ネストしたオブジェクトの差分計算', () => {
    it('ネストしたオブジェクトの変更を正しく検出する', () => {
      const oldObj = {
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark' },
      };
      const newObj = {
        user: { name: 'Jane', age: 30 },
        settings: { theme: 'dark' },
      };
      const result = calculateObjectDelta(oldObj, newObj);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.modifiedCount).toBe(1);

      const userChange = result.delta.changes.user;
      expect(userChange.type).toBe('modified');
      expect(userChange.nestedDelta).toBeDefined();
      expect(userChange.nestedDelta?.changes.name.type).toBe('modified');
      expect(userChange.nestedDelta?.changes.name.oldValue).toBe('John');
      expect(userChange.nestedDelta?.changes.name.newValue).toBe('Jane');
    });

    it('ネストしたオブジェクトが追加された場合を正しく処理する', () => {
      const oldObj = { a: 1 };
      const newObj = {
        a: 1,
        nested: { b: 2, c: 3 },
      };
      const result = calculateObjectDelta(oldObj, newObj);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.addedCount).toBe(1);

      const nestedChange = result.delta.changes.nested;
      expect(nestedChange.type).toBe('added');
      expect(nestedChange.newValue).toEqual({ b: 2, c: 3 });
    });
  });

  describe('配列の差分計算', () => {
    it('配列の要素が追加された場合を正しく処理する', () => {
      const oldArray = [1, 2, 3];
      const newArray = [1, 2, 3, 4];
      const result = calculateObjectDelta(oldArray, newArray);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.addedCount).toBe(1);

      const change = result.delta.changes['[3]'];
      expect(change.type).toBe('added');
      expect(change.newValue).toBe(4);
    });

    it('配列の要素が削除された場合を正しく処理する', () => {
      const oldArray = [1, 2, 3, 4];
      const newArray = [1, 2, 3];
      const result = calculateObjectDelta(oldArray, newArray);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.removedCount).toBe(1);

      const change = result.delta.changes['[3]'];
      expect(change.type).toBe('removed');
      expect(change.oldValue).toBe(4);
    });

    it('配列の要素が変更された場合を正しく処理する', () => {
      const oldArray = [1, 2, 3];
      const newArray = [1, 5, 3];
      const result = calculateObjectDelta(oldArray, newArray);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.modifiedCount).toBe(1);

      const change = result.delta.changes['[1]'];
      expect(change.type).toBe('modified');
      expect(change.oldValue).toBe(2);
      expect(change.newValue).toBe(5);
    });
  });

  describe('プリミティブ値の差分計算', () => {
    it('数値の変更を正しく検出する', () => {
      const result = calculateObjectDelta(42, 100);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.modifiedCount).toBe(1);

      const change = result.delta.changes['__value__'];
      expect(change.type).toBe('modified');
      expect(change.oldValue).toBe(42);
      expect(change.newValue).toBe(100);
    });

    it('文字列の変更を正しく検出する', () => {
      const result = calculateObjectDelta('hello', 'world');

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.modifiedCount).toBe(1);

      const change = result.delta.changes['__value__'];
      expect(change.type).toBe('modified');
      expect(change.oldValue).toBe('hello');
      expect(change.newValue).toBe('world');
    });

    it('同じプリミティブ値の差分は空であるべき', () => {
      const result = calculateObjectDelta('test', 'test');

      expect(result.delta.changeCount).toBe(0);
    });
  });

  describe('型変更の差分計算', () => {
    it('異なる型間の変更を正しく検出する', () => {
      const result = calculateObjectDelta(42, '42');

      expect(result.delta.changeCount).toBe(2);
      expect(result.delta.modifiedCount).toBe(2);

      expect(result.delta.changes['__type__'].type).toBe('modified');
      expect(result.delta.changes['__type__'].oldValue).toBe('number');
      expect(result.delta.changes['__type__'].newValue).toBe('string');

      expect(result.delta.changes['__value__'].type).toBe('modified');
      expect(result.delta.changes['__value__'].oldValue).toBe(42);
      expect(result.delta.changes['__value__'].newValue).toBe('42');
    });
  });

  describe('オプション設定のテスト', () => {
    it('無視するプロパティを正しく処理する', () => {
      const options = {
        ignoreProperties: ['timestamp'],
      };

      const oldObj = { a: 1, timestamp: Date.now() };
      const newObj = { a: 1, timestamp: Date.now() + 1000 };
      const result = calculateObjectDelta(oldObj, newObj, options);

      expect(result.delta.changeCount).toBe(0);
    });

    it('カスタム比較関数を正しく使用する', () => {
      const options = {
        customComparator: (
          key: string,
          oldValue: unknown,
          newValue: unknown,
        ) => {
          if (key === 'id') {
            return String(oldValue) === String(newValue);
          }
          return false;
        },
      };

      const oldObj = { id: 123, name: 'John' };
      const newObj = { id: '123', name: 'John' };
      const result = calculateObjectDelta(oldObj, newObj, options);

      expect(result.delta.changeCount).toBe(0);
    });

    it('深い比較を無効にした場合の動作', () => {
      const options = {
        deep: false,
      };

      const oldObj = { nested: { a: 1 } };
      const newObj = { nested: { a: 2 } };
      const result = calculateObjectDelta(oldObj, newObj, options);

      expect(result.delta.changeCount).toBe(1);
      expect(result.delta.modifiedCount).toBe(1);

      const change = result.delta.changes.nested;
      expect(change.type).toBe('modified');
      expect(change.nestedDelta).toBeUndefined();
    });
  });

  describe('配列の差分計算', () => {
    it('順序を考慮した配列の差分計算', () => {
      const oldArray = [1, 2, 3];
      const newArray = [1, 4, 3, 5];
      const result = calculateObjectDelta(oldArray, newArray);

      expect(result.delta.changeCount).toBe(2);
      expect(result.delta.modifiedCount).toBe(1); // [1] が 2 -> 4 に変更
      expect(result.delta.addedCount).toBe(1); // [3] に 5 が追加

      const change1 = result.delta.changes['[1]'];
      expect(change1.type).toBe('modified');
      expect(change1.oldValue).toBe(2);
      expect(change1.newValue).toBe(4);

      const change2 = result.delta.changes['[3]'];
      expect(change2.type).toBe('added');
      expect(change2.newValue).toBe(5);
    });

    it('順序を考慮しない配列の差分計算 - 要素の追加', () => {
      const oldArray = [1, 2, 3];
      const newArray = [1, 2, 3, 4];
      const result = calculateObjectDelta(oldArray, newArray, {
        arrayOrderMatters: false,
      });

      expect(result.delta.changeCount).toBe(2);
      expect(result.delta.addedCount).toBe(1); // 4 が追加
      expect(result.delta.modifiedCount).toBe(1); // 長さが変更

      const lengthChange = result.delta.changes['__length__'];
      expect(lengthChange.type).toBe('modified');
      expect(lengthChange.oldValue).toBe(3);
      expect(lengthChange.newValue).toBe(4);

      const addedChange = result.delta.changes['[3]'];
      expect(addedChange.type).toBe('added');
      expect(addedChange.newValue).toBe(4);
    });

    it('順序を考慮しない配列の差分計算 - 要素の削除', () => {
      const oldArray = [1, 2, 3, 4];
      const newArray = [1, 2, 3];
      const result = calculateObjectDelta(oldArray, newArray, {
        arrayOrderMatters: false,
      });

      expect(result.delta.changeCount).toBe(2);
      expect(result.delta.removedCount).toBe(1); // 4 が削除
      expect(result.delta.modifiedCount).toBe(1); // 長さが変更

      const lengthChange = result.delta.changes['__length__'];
      expect(lengthChange.type).toBe('modified');
      expect(lengthChange.oldValue).toBe(4);
      expect(lengthChange.newValue).toBe(3);

      const removedChange = result.delta.changes['[3]'];
      expect(removedChange.type).toBe('removed');
      expect(removedChange.oldValue).toBe(4);
    });

    it('順序を考慮しない配列の差分計算 - 重複要素の処理', () => {
      const oldArray = [1, 2, 2, 3];
      const newArray = [1, 2, 3];
      const result = calculateObjectDelta(oldArray, newArray, {
        arrayOrderMatters: false,
      });

      expect(result.delta.changeCount).toBe(2);
      expect(result.delta.removedCount).toBe(1); // 2 が1つ削除
      expect(result.delta.modifiedCount).toBe(1); // 長さが変更

      const lengthChange = result.delta.changes['__length__'];
      expect(lengthChange.type).toBe('modified');
      expect(lengthChange.oldValue).toBe(4);
      expect(lengthChange.newValue).toBe(3);
    });

    it('順序を考慮しない配列の差分計算 - 同じ要素の並び替え', () => {
      const oldArray = [1, 2, 3];
      const newArray = [3, 1, 2];
      const result = calculateObjectDelta(oldArray, newArray, {
        arrayOrderMatters: false,
      });

      // 要素は同じなので、長さの変更のみ
      expect(result.delta.changeCount).toBe(0);
      expect(result.delta.addedCount).toBe(0);
      expect(result.delta.removedCount).toBe(0);
      expect(result.delta.modifiedCount).toBe(0);
    });
  });

  describe('パフォーマンスとエラーハンドリング', () => {
    it('計算時間を正しく記録する', () => {
      const result = calculateObjectDelta({ a: 1 }, { a: 2 });

      expect(result.duration).toBeGreaterThan(0);
      expect(typeof result.duration).toBe('number');
    });

    it('総プロパティ数を正しくカウントする', () => {
      const oldObj = { a: 1, b: 2, c: 3 };
      const newObj = { d: 4, e: 5 };
      const result = calculateObjectDelta(oldObj, newObj);

      expect(result.totalProperties).toBe(5); // 3 + 2
    });

    it('エラーが発生した場合の処理', () => {
      // 無効なオブジェクトでエラーを発生させる
      const invalidObj = null;
      const normalObj = { b: 2 };

      const result = calculateObjectDelta(invalidObj, normalObj);

      // エラーが発生しない場合でも、正常に処理されることを確認
      expect(result.delta).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
    });

    it('CircularReferenceError型が正しく定義されている', () => {
      // CircularReferenceErrorが正しく定義されていることを確認
      const error = new CircularReferenceError('test');
      expect(error.name).toBe('CircularReferenceError');
      expect(error.message).toContain('Circular reference detected');
      expect(error.code).toBe('CIRCULAR_REFERENCE_ERROR');
    });
  });
});
