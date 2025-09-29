/**
 * src/index.ts のテスト
 */

import * as GitScript from '@/index';
import { describe, expect, it } from 'vitest';

describe('GitScript Main Entry Point', () => {
  describe('exports', () => {
    it('should export core functions', () => {
      // ハッシュ機能
      expect(GitScript.calculateHashFromString).toBeDefined();
      expect(GitScript.calculateHashFromObject).toBeDefined();
      expect(GitScript.isValidHash).toBeDefined();
      expect(typeof GitScript.calculateHashFromString).toBe('function');
      expect(typeof GitScript.calculateHashFromObject).toBe('function');
      expect(typeof GitScript.isValidHash).toBe('function');

      // 暗号化機能
      expect(GitScript.calculateSha1).toBeDefined();
      expect(GitScript.calculateSha1FromMultiple).toBeDefined();
      expect(GitScript.isCryptoAvailable).toBeDefined();
      expect(typeof GitScript.calculateSha1).toBe('function');
      expect(typeof GitScript.calculateSha1FromMultiple).toBe('function');
      expect(typeof GitScript.isCryptoAvailable).toBe('function');

      // シリアライゼーション機能
      expect(GitScript.deepCopy).toBeDefined();
      expect(GitScript.deserialize).toBeDefined();
      expect(GitScript.stringifyCompact).toBeDefined();
      expect(typeof GitScript.deepCopy).toBe('function');
      expect(typeof GitScript.deserialize).toBe('function');
      expect(typeof GitScript.stringifyCompact).toBe('function');
    });

    it('should export patch functions', () => {
      // パッチ適用機能
      expect(GitScript.useApplyPatch).toBeDefined();
      expect(GitScript.createPatch).toBeDefined();
      expect(GitScript.convertPatchToMicrodiffResult).toBeDefined();
      expect(typeof GitScript.useApplyPatch).toBe('function');
      expect(typeof GitScript.createPatch).toBe('function');
      expect(typeof GitScript.convertPatchToMicrodiffResult).toBe('function');

      // ネストされた値アクセス機能
      expect(GitScript.getNestedValue).toBeDefined();
      expect(GitScript.setNestedValue).toBeDefined();
      expect(GitScript.deleteNestedValue).toBeDefined();
      expect(typeof GitScript.getNestedValue).toBe('function');
      expect(typeof GitScript.setNestedValue).toBe('function');
      expect(typeof GitScript.deleteNestedValue).toBe('function');
    });

    it('should export utility functions', () => {
      // 型ガード関数
      expect(GitScript.isString).toBeDefined();
      expect(GitScript.isNumber).toBeDefined();
      expect(GitScript.isBoolean).toBeDefined();
      expect(GitScript.isArray).toBeDefined();
      expect(GitScript.isObject).toBeDefined();
      expect(GitScript.isNull).toBeDefined();
      expect(GitScript.isUndefined).toBeDefined();
      expect(GitScript.isNullOrUndefined).toBeDefined();
      expect(GitScript.isPrimitive).toBeDefined();
      expect(GitScript.isFunction).toBeDefined();
      expect(GitScript.isSymbol).toBeDefined();
      expect(GitScript.isBigInt).toBeDefined();
      expect(GitScript.isBuffer).toBeDefined();
      expect(GitScript.isDate).toBeDefined();
      expect(GitScript.isMap).toBeDefined();
      expect(GitScript.isSet).toBeDefined();
      expect(GitScript.isRegExp).toBeDefined();
      expect(GitScript.isNativeError).toBeDefined();
      expect(typeof GitScript.isString).toBe('function');
      expect(typeof GitScript.isNumber).toBe('function');
      expect(typeof GitScript.isBoolean).toBe('function');
      expect(typeof GitScript.isArray).toBe('function');
      expect(typeof GitScript.isObject).toBe('function');
      expect(typeof GitScript.isNull).toBe('function');
      expect(typeof GitScript.isUndefined).toBe('function');
      expect(typeof GitScript.isNullOrUndefined).toBe('function');
      expect(typeof GitScript.isPrimitive).toBe('function');
      expect(typeof GitScript.isFunction).toBe('function');
      expect(typeof GitScript.isSymbol).toBe('function');
      expect(typeof GitScript.isBigInt).toBe('function');
      expect(typeof GitScript.isBuffer).toBe('function');
      expect(typeof GitScript.isDate).toBe('function');
      expect(typeof GitScript.isMap).toBe('function');
      expect(typeof GitScript.isSet).toBe('function');
      expect(typeof GitScript.isRegExp).toBe('function');
      expect(typeof GitScript.isNativeError).toBe('function');
    });

    it('should export validation functions', () => {
      expect(GitScript.validateString).toBeDefined();
      expect(GitScript.validateArray).toBeDefined();
      expect(GitScript.validateBuffer).toBeDefined();
      expect(GitScript.validateRange).toBeDefined();
      expect(typeof GitScript.validateString).toBe('function');
      expect(typeof GitScript.validateArray).toBe('function');
      expect(typeof GitScript.validateBuffer).toBe('function');
      expect(typeof GitScript.validateRange).toBe('function');
    });

    it('should export error classes', () => {
      expect(GitScript.GitScriptError).toBeDefined();
      expect(GitScript.ArgumentError).toBeDefined();
      expect(GitScript.CryptoError).toBeDefined();
      expect(GitScript.SerializationError).toBeDefined();
      expect(typeof GitScript.GitScriptError).toBe('function');
      expect(typeof GitScript.ArgumentError).toBe('function');
      expect(typeof GitScript.CryptoError).toBe('function');
      expect(typeof GitScript.SerializationError).toBe('function');
    });
  });

  describe('functionality', () => {
    it('should work with crypto functions', () => {
      const hash = GitScript.calculateSha1('test');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40); // SHA-1 hash length
    });

    it('should work with hash functions', () => {
      const hash = GitScript.calculateHashFromString('test');
      expect(typeof hash).toBe('string');
      expect(GitScript.isValidHash(hash)).toBe(true);
    });

    it('should work with serialization functions', () => {
      const obj = { a: 1, b: 2 };
      const serialized = GitScript.stringifyCompact(obj);
      expect(serialized).toBe('{"a":1,"b":2}');

      const deserialized = GitScript.deserialize(serialized);
      expect(deserialized).toEqual(obj);
    });

    it('should work with patch functions', () => {
      const source = { user: { name: 'Alice', age: 30 } };
      const patch = GitScript.createPatch(source, { user: { name: 'Bob', age: 31 } });
      expect(patch).toBeDefined();

      const applyPatch = GitScript.useApplyPatch();
      const result = applyPatch.applyPatch(source, patch);
      expect(result).toEqual({ user: { name: 'Bob', age: 31 } });
    });

    it('should work with nested value access', () => {
      const obj = { user: { name: 'Alice', age: 30 } };
      
      const name = GitScript.getNestedValue(obj, ['user', 'name']);
      expect(name).toBe('Alice');

      GitScript.setNestedValue(obj, ['user', 'name'], 'Bob');
      expect(obj.user.name).toBe('Bob');

      GitScript.deleteNestedValue(obj, ['user', 'age']);
      expect(obj.user.age).toBeUndefined();
    });

    it('should work with deep copy function', () => {
      const obj = { a: 1, b: { c: 2 } };
      const copied = GitScript.deepCopy(obj);
      expect(copied.data).toEqual(obj);
      expect(copied.data).not.toBe(obj);
      expect(copied.data.b).not.toBe(obj.b);
    });

    it('should work with utility functions', () => {
      expect(GitScript.isString('test')).toBe(true);
      expect(GitScript.isNumber(123)).toBe(true);
      expect(GitScript.isBoolean(true)).toBe(true);
      expect(GitScript.isArray([1, 2, 3])).toBe(true);
      expect(GitScript.isObject({})).toBe(true);
      expect(GitScript.isNull(null)).toBe(true);
      expect(GitScript.isUndefined(undefined)).toBe(true);
      expect(GitScript.isNullOrUndefined(null)).toBe(true);
      expect(GitScript.isNullOrUndefined(undefined)).toBe(true);
      expect(GitScript.isPrimitive('test')).toBe(true);
      expect(GitScript.isFunction(() => {})).toBe(true);
      expect(GitScript.isSymbol(Symbol('test'))).toBe(true);
      expect(GitScript.isBigInt(BigInt(123))).toBe(true);
      expect(GitScript.isBuffer(Buffer.from('test'))).toBe(true);
      expect(GitScript.isDate(new Date())).toBe(true);
      expect(GitScript.isMap(new Map())).toBe(true);
      expect(GitScript.isSet(new Set())).toBe(true);
      expect(GitScript.isRegExp(/test/)).toBe(true);
      expect(GitScript.isNativeError(new Error())).toBe(true);
    });

    it('should work with validation functions', () => {
      expect(() => GitScript.validateString('test')).not.toThrow();
      expect(() => GitScript.validateArray([1, 2, 3])).not.toThrow();
      expect(() => GitScript.validateBuffer(Buffer.from('test'))).not.toThrow();
      expect(() => GitScript.validateRange(5, 0, 10)).not.toThrow();
    });

    it('should work with error classes', () => {
      const error = new GitScript.GitScriptError('test', 'TEST_ERROR');
      expect(error.message).toBe('test');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('GitScriptError');
    });
  });

  describe('integration', () => {
    it('should work with complete workflow', () => {
      // データの作成
      const data = { message: 'Hello World', timestamp: Date.now() };

      // シリアライゼーション
      const serialized = GitScript.stringifyCompact(data);
      expect(serialized).toContain('Hello World');

      // ハッシュ計算
      const hash = GitScript.calculateHashFromString(serialized);
      expect(GitScript.isValidHash(hash)).toBe(true);

      // デシリアライゼーション
      const deserialized = GitScript.deserialize(serialized);
      expect(deserialized).toEqual(data);

      // 深いコピー
      const copied = GitScript.deepCopy(data);
      expect(copied.data).toEqual(data);
      expect(copied.data).not.toBe(data);

      // パッチ適用
      const modifiedData = { message: 'Hello Universe', timestamp: Date.now() };
      const patch = GitScript.createPatch(data, modifiedData);
      const applyPatch = GitScript.useApplyPatch();
      const patched = applyPatch.applyPatch(data, patch);
      expect(patched).toEqual(modifiedData);

    });
  });
});
