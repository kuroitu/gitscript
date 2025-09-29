/**
 * src/index.ts のテスト
 */

import * as GitScript from '@/index';
import { describe, expect, it } from 'vitest';

describe('GitScript Main Entry Point', () => {
  describe('exports', () => {
    it('should export crypto functions', () => {
      expect(GitScript.calculateSha1).toBeDefined();
      expect(GitScript.calculateSha1FromMultiple).toBeDefined();
      expect(GitScript.isCryptoAvailable).toBeDefined();
      expect(typeof GitScript.calculateSha1).toBe('function');
      expect(typeof GitScript.calculateSha1FromMultiple).toBe('function');
      expect(typeof GitScript.isCryptoAvailable).toBe('function');
    });

    it('should export hash functions', () => {
      expect(GitScript.calculateHash).toBeDefined();
      expect(GitScript.validateHash).toBeDefined();
      expect(GitScript.isValidHash).toBeDefined();
      expect(typeof GitScript.calculateHash).toBe('function');
      expect(typeof GitScript.validateHash).toBe('function');
      expect(typeof GitScript.isValidHash).toBe('function');
    });

    it('should export serialization functions', () => {
      expect(GitScript.serialize).toBeDefined();
      expect(GitScript.deserialize).toBeDefined();
      expect(GitScript.deepCopy).toBeDefined();
      expect(GitScript.detectDataType).toBeDefined();
      expect(GitScript.analyzeValue).toBeDefined();
      expect(typeof GitScript.serialize).toBe('function');
      expect(typeof GitScript.deserialize).toBe('function');
      expect(typeof GitScript.deepCopy).toBe('function');
      expect(typeof GitScript.detectDataType).toBe('function');
      expect(typeof GitScript.analyzeValue).toBe('function');
    });

    it('should export utility functions', () => {
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
      expect(GitScript.DataTypeDetectionError).toBeDefined();
      expect(typeof GitScript.GitScriptError).toBe('function');
      expect(typeof GitScript.ArgumentError).toBe('function');
      expect(typeof GitScript.CryptoError).toBe('function');
      expect(typeof GitScript.SerializationError).toBe('function');
      expect(typeof GitScript.DataTypeDetectionError).toBe('function');
    });

    it('should export types and constants', () => {
      expect(GitScript.DataType).toBeDefined();
      expect(GitScript.CircularReferenceHandling).toBeDefined();
      expect(GitScript.FunctionHandling).toBeDefined();
      expect(GitScript.SymbolHandling).toBeDefined();
      expect(GitScript.UndefinedHandling).toBeDefined();
      expect(GitScript.SerializationFormat).toBeDefined();
    });
  });

  describe('functionality', () => {
    it('should work with crypto functions', () => {
      const hash = GitScript.calculateSha1('test');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(40); // SHA-1 hash length
    });

    it('should work with hash functions', () => {
      const hash = GitScript.calculateHash('test');
      expect(typeof hash).toBe('string');
      expect(GitScript.isValidHash(hash)).toBe(true);
    });

    it('should work with serialization functions', () => {
      const obj = { a: 1, b: 2 };
      const serialized = GitScript.serialize(obj);
      expect(serialized.data).toBe('{"a":1,"b":2}');

      const deserialized = GitScript.deserialize(serialized.data);
      expect(deserialized.data).toEqual(obj);
    });

    it('should work with deep copy function', () => {
      const obj = { a: 1, b: { c: 2 } };
      const copied = GitScript.deepCopy(obj);
      expect(copied.data).toEqual(obj);
      expect(copied.data).not.toBe(obj);
      expect(copied.data.b).not.toBe(obj.b);
    });

    it('should work with data type detection', () => {
      const typeInfo = GitScript.detectDataType('test');
      expect(typeInfo.type).toBe('primitive');
      expect(typeInfo.details).toBeUndefined(); // primitive型ではdetailsはundefined
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
      const serialized = GitScript.serialize(data);
      expect(serialized.data).toContain('Hello World');

      // ハッシュ計算
      const hash = GitScript.calculateHash(serialized.data);
      expect(GitScript.isValidHash(hash)).toBe(true);

      // デシリアライゼーション
      const deserialized = GitScript.deserialize(serialized.data);
      expect(deserialized.data).toEqual(data);

      // 深いコピー
      const copied = GitScript.deepCopy(data);
      expect(copied.data).toEqual(data);
      expect(copied.data).not.toBe(data);

      // 型検出
      const typeInfo = GitScript.detectDataType(data);
      expect(typeInfo.type).toBe('object');
    });
  });
});
