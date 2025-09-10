/**
 * DataTypeDetector のテスト
 */

import { describe, it, expect } from 'vitest';
import {
    detectDataType,
    isType,
    isPrimitive,
    isObject,
    isArray,
    isSet,
    isMap,
    isDate,
    isRegExp,
    isFunction,
    isSymbol,
    isBuffer,
    isBigInt
} from '@/core/serialization/DataTypeDetector';
import { DataType } from '@/core/serialization/types';

describe('DataTypeDetector', () => {
    describe('detectDataType', () => {
        it('should detect null type', () => {
            const result = detectDataType(null);
            expect(result.type).toBe(DataType.null);
        });

        it('should detect undefined type', () => {
            const result = detectDataType(undefined);
            expect(result.type).toBe(DataType.undefined);
        });

        it('should detect primitive types', () => {
            expect(detectDataType('hello').type).toBe(DataType.primitive);
            expect(detectDataType(42).type).toBe(DataType.primitive);
            expect(detectDataType(true).type).toBe(DataType.primitive);
        });

        it('should detect bigint type', () => {
            const result = detectDataType(BigInt(123));
            expect(result.type).toBe(DataType.bigint);
        });

        it('should detect symbol type', () => {
            const result = detectDataType(Symbol('test'));
            expect(result.type).toBe(DataType.symbol);
        });

        it('should detect function type with parameter count', () => {
            const func = (a: number, b: string) => a + b;
            const result = detectDataType(func);
            expect(result.type).toBe(DataType.function);
            expect(result.details?.parameterCount).toBe(2);
        });

        it('should detect buffer type with size', () => {
            const buffer = Buffer.from('hello');
            const result = detectDataType(buffer);
            expect(result.type).toBe(DataType.buffer);
            expect(result.details?.bufferSize).toBe(5);
        });

        it('should detect date type', () => {
            const result = detectDataType(new Date());
            expect(result.type).toBe(DataType.date);
        });

        it('should detect regexp type', () => {
            const result = detectDataType(/test/);
            expect(result.type).toBe(DataType.regexp);
        });

        it('should detect array type with element count', () => {
            const result = detectDataType([1, 2, 3]);
            expect(result.type).toBe(DataType.array);
            expect(result.details?.elementCount).toBe(3);
        });

        it('should detect set type with size', () => {
            const result = detectDataType(new Set([1, 2, 3]));
            expect(result.type).toBe(DataType.set);
            expect(result.details?.setSize).toBe(3);
        });

        it('should detect map type with size', () => {
            const result = detectDataType(new Map([['a', 1], ['b', 2]]));
            expect(result.type).toBe(DataType.map);
            expect(result.details?.mapSize).toBe(2);
        });

        it('should detect object type with property count', () => {
            const result = detectDataType({ a: 1, b: 2, c: 3 });
            expect(result.type).toBe(DataType.object);
            expect(result.details?.propertyCount).toBe(3);
        });
    });

    describe('type checking functions', () => {
        it('should check primitive types', () => {
            expect(isPrimitive('hello')).toBe(true);
            expect(isPrimitive(42)).toBe(true);
            expect(isPrimitive(true)).toBe(true);
            expect(isPrimitive(null)).toBe(false);
            expect(isPrimitive(undefined)).toBe(false);
        });

        it('should check object types', () => {
            expect(isObject({})).toBe(true);
            expect(isObject([])).toBe(false);
            expect(isObject(null)).toBe(false);
        });

        it('should check array types', () => {
            expect(isArray([])).toBe(true);
            expect(isArray([1, 2, 3])).toBe(true);
            expect(isArray({})).toBe(false);
        });

        it('should check set types', () => {
            expect(isSet(new Set())).toBe(true);
            expect(isSet(new Set([1, 2, 3]))).toBe(true);
            expect(isSet([])).toBe(false);
        });

        it('should check map types', () => {
            expect(isMap(new Map())).toBe(true);
            expect(isMap(new Map([['a', 1]]))).toBe(true);
            expect(isMap({})).toBe(false);
        });

        it('should check date types', () => {
            expect(isDate(new Date())).toBe(true);
            expect(isDate('2023-01-01')).toBe(false);
        });

        it('should check regexp types', () => {
            expect(isRegExp(/test/)).toBe(true);
            expect(isRegExp('test')).toBe(false);
        });

        it('should check function types', () => {
            expect(isFunction(() => {})).toBe(true);
            expect(isFunction(function() {})).toBe(true);
            expect(isFunction('function')).toBe(false);
        });

        it('should check symbol types', () => {
            expect(isSymbol(Symbol('test'))).toBe(true);
            expect(isSymbol('symbol')).toBe(false);
        });

        it('should check buffer types', () => {
            expect(isBuffer(Buffer.from('test'))).toBe(true);
            expect(isBuffer('test')).toBe(false);
        });

        it('should check bigint types', () => {
            expect(isBigInt(BigInt(123))).toBe(true);
            expect(isBigInt(123)).toBe(false);
        });
    });

    describe('isType', () => {
        it('should check specific types', () => {
            expect(isType('hello', DataType.primitive)).toBe(true);
            expect(isType([1, 2, 3], DataType.array)).toBe(true);
            expect(isType({}, DataType.object)).toBe(true);
            expect(isType(null, DataType.null)).toBe(true);
            expect(isType(undefined, DataType.undefined)).toBe(true);
        });

        it('should return false for incorrect types', () => {
            expect(isType('hello', DataType.array)).toBe(false);
            expect(isType([1, 2, 3], DataType.object)).toBe(false);
            expect(isType({}, DataType.primitive)).toBe(false);
        });
    });
});
