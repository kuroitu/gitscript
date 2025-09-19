/**
 * DeltaUtils のテスト
 */

import {
  convertArrayPathToChangeKey,
  convertMicrodiffChangeToPropertyChange,
  convertObjectPathToChangeKey,
  convertSetMapPathToChangeKey,
  createDeltaFromChanges,
  handleDeltaCalculationError,
} from '@/delta/DeltaUtils';
import { DeltaCalculationError, PropertyChangeType } from '@/types';
import { describe, expect, it } from 'vitest';

describe('DeltaUtils', () => {
  describe('convertMicrodiffChangeToPropertyChange', () => {
    it('CREATEタイプの変更を正しく変換する', () => {
      const change = {
        type: 'CREATE' as const,
        path: ['user', 'name'],
        value: 'John',
      };
      const result = convertMicrodiffChangeToPropertyChange(change);
      expect(result.type).toBe(PropertyChangeType.Added);
      expect(result.newValue).toBe('John');
      expect(result.oldValue).toBeUndefined();
    });

    it('REMOVEタイプの変更を正しく変換する', () => {
      const change = {
        type: 'REMOVE' as const,
        path: ['user', 'age'],
        oldValue: 30,
      };
      const result = convertMicrodiffChangeToPropertyChange(change);
      expect(result.type).toBe(PropertyChangeType.Removed);
      expect(result.oldValue).toBe(30);
      expect(result.newValue).toBeUndefined();
    });

    it('CHANGEタイプの変更を正しく変換する', () => {
      const change = {
        type: 'CHANGE' as const,
        path: ['user', 'name'],
        oldValue: 'John',
        value: 'Jane',
      };
      const result = convertMicrodiffChangeToPropertyChange(change);
      expect(result.type).toBe(PropertyChangeType.Modified);
      expect(result.oldValue).toBe('John');
      expect(result.newValue).toBe('Jane');
    });

    it('未知のタイプの場合はMODIFIEDとして扱う', () => {
      const change = {
        type: 'UNKNOWN' as any,
        path: ['user', 'name'],
        oldValue: 'John',
        value: 'Jane',
      };
      const result = convertMicrodiffChangeToPropertyChange(change);
      expect(result.type).toBe(PropertyChangeType.Modified);
      expect(result.oldValue).toBe('John');
      expect(result.newValue).toBe('Jane');
    });
  });

  describe('createDeltaFromChanges', () => {
    it('変更情報からObjectDeltaを正しく作成する', () => {
      const changes = {
        name: {
          type: PropertyChangeType.Modified,
          oldValue: 'John',
          newValue: 'Jane',
        },
        age: {
          type: PropertyChangeType.Added,
          newValue: 30,
        },
        email: {
          type: PropertyChangeType.Removed,
          oldValue: 'john@example.com',
        },
      };
      const result = createDeltaFromChanges(changes);
      expect(result.changes).toBe(changes);
      expect(result.changeCount).toBe(3);
      expect(result.addedCount).toBe(1);
      expect(result.removedCount).toBe(1);
      expect(result.modifiedCount).toBe(1);
    });

    it('変更がない場合は空のObjectDeltaを作成する', () => {
      const changes = {};
      const result = createDeltaFromChanges(changes);
      expect(result.changes).toBe(changes);
      expect(result.changeCount).toBe(0);
      expect(result.addedCount).toBe(0);
      expect(result.removedCount).toBe(0);
      expect(result.modifiedCount).toBe(0);
    });

    it('複数の同じタイプの変更を正しくカウントする', () => {
      const changes = {
        a: { type: PropertyChangeType.Added, newValue: 1 },
        b: { type: PropertyChangeType.Added, newValue: 2 },
        c: { type: PropertyChangeType.Removed, oldValue: 3 },
        d: { type: PropertyChangeType.Removed, oldValue: 4 },
        e: { type: PropertyChangeType.Modified, oldValue: 5, newValue: 6 },
        f: { type: PropertyChangeType.Modified, oldValue: 7, newValue: 8 },
      };
      const result = createDeltaFromChanges(changes);
      expect(result.changeCount).toBe(6);
      expect(result.addedCount).toBe(2);
      expect(result.removedCount).toBe(2);
      expect(result.modifiedCount).toBe(2);
    });
  });

  describe('convertObjectPathToChangeKey', () => {
    it('空のパスは__root__を返す', () => {
      const result = convertObjectPathToChangeKey([]);
      expect(result).toBe('__root__');
    });

    it('単一の数値パスは配列形式で返す', () => {
      const result = convertObjectPathToChangeKey([0]);
      expect(result).toBe('[0]');
    });

    it('単一の文字列パスはそのまま返す', () => {
      const result = convertObjectPathToChangeKey(['name']);
      expect(result).toBe('name');
    });

    it('ネストしたパスの最後の要素を返す', () => {
      const result = convertObjectPathToChangeKey(['user', 'profile', 'name']);
      expect(result).toBe('name');
    });

    it('ネストしたパスの最後が数値の場合は配列形式で返す', () => {
      const result = convertObjectPathToChangeKey(['users', 0, 'name']);
      expect(result).toBe('name');
    });

    it('複雑なネストパスを正しく処理する', () => {
      const result = convertObjectPathToChangeKey([
        'data',
        'items',
        2,
        'details',
        'value',
      ]);
      expect(result).toBe('value');
    });
  });

  describe('convertArrayPathToChangeKey', () => {
    it('空のパスは__root__を返す', () => {
      const result = convertArrayPathToChangeKey([]);
      expect(result).toBe('__root__');
    });

    it('単一の数値パスは配列形式で返す', () => {
      const result = convertArrayPathToChangeKey([0]);
      expect(result).toBe('[0]');
    });

    it('ネストした配列の最初のインデックスを返す', () => {
      const result = convertArrayPathToChangeKey([1, 2, 3]);
      expect(result).toBe('[1]');
    });

    it('複雑なネスト配列パスを正しく処理する', () => {
      const result = convertArrayPathToChangeKey([0, 'items', 1, 'value']);
      expect(result).toBe('[0]');
    });
  });

  describe('convertSetMapPathToChangeKey', () => {
    it('空のパスは__root__を返す', () => {
      const result = convertSetMapPathToChangeKey([]);
      expect(result).toBe('__root__');
    });

    it('最初の要素を文字列として返す', () => {
      const result = convertSetMapPathToChangeKey(['key1']);
      expect(result).toBe('key1');
    });

    it('数値キーを文字列として返す', () => {
      const result = convertSetMapPathToChangeKey([123]);
      expect(result).toBe('123');
    });

    it('複雑なパスの最初の要素を返す', () => {
      const result = convertSetMapPathToChangeKey([
        'item_0',
        'nested',
        'value',
      ]);
      expect(result).toBe('item_0');
    });
  });

  describe('handleDeltaCalculationError', () => {
    it('DeltaCalculationErrorの場合はそのまま再throwする', () => {
      const originalError = new DeltaCalculationError('Original error');
      expect(() => {
        handleDeltaCalculationError(originalError, 'test operation');
      }).toThrow(originalError);
    });

    it('Errorオブジェクトの場合はDeltaCalculationErrorでラップする', () => {
      const originalError = new Error('Original error');
      expect(() => {
        handleDeltaCalculationError(originalError, 'test operation');
      }).toThrow(DeltaCalculationError);
    });

    it('文字列エラーの場合はErrorオブジェクトに変換してラップする', () => {
      expect(() => {
        handleDeltaCalculationError('String error', 'test operation');
      }).toThrow(DeltaCalculationError);
    });

    it('その他の値の場合はErrorオブジェクトに変換してラップする', () => {
      expect(() => {
        handleDeltaCalculationError(123, 'test operation');
      }).toThrow(DeltaCalculationError);
    });

    it('エラーメッセージに操作名が含まれる', () => {
      try {
        handleDeltaCalculationError(new Error('Original'), 'calculate delta');
      } catch (error) {
        expect(error).toBeInstanceOf(DeltaCalculationError);
        expect((error as DeltaCalculationError).message).toContain(
          'Failed to calculate delta',
        );
      }
    });
  });
});
