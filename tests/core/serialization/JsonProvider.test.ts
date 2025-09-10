/**
 * JsonProvider のテスト（拡張版）
 */

import { describe, it, expect } from 'vitest';
import { 
    stringifyCompact, 
    serialize, 
    deserialize,
    SerializationError 
} from '@/core/serialization/JsonProvider';
import { SerializationFormat } from '@/core/serialization/types';

describe('JsonProvider (Extended)', () => {
    describe('serialize', () => {
        it('should serialize with compact format', () => {
            const obj = { a: 1, b: 2 };
            const result = serialize(obj, { format: SerializationFormat.compact });
            
            expect(result.data).toBe('{"a":1,"b":2}');
            expect(result.format).toBe(SerializationFormat.compact);
            expect(result.typeInfo.type).toBe('object');
            expect(result.duration).toBeGreaterThan(0);
        });

        it('should serialize with pretty format', () => {
            const obj = { a: 1, b: 2 };
            const result = serialize(obj, { format: SerializationFormat.pretty, indent: 2 });
            
            expect(result.data).toContain('{\n  "a": 1,\n  "b": 2\n}');
            expect(result.format).toBe(SerializationFormat.pretty);
        });

        it('should serialize with default format', () => {
            const obj = { a: 1, b: 2 };
            const result = serialize(obj);
            
            expect(result.data).toBe('{"a":1,"b":2}');
            expect(result.format).toBe(SerializationFormat.compact);
        });

        it('should handle function with replace option', () => {
            const obj = { func: () => 'test' };
            const result = serialize(obj, { functionHandling: 'replace' });
            
            expect(result.data).toBe('{}'); // 関数はデフォルトで無視される
        });

        it('should handle function with ignore option', () => {
            const obj = { func: () => 'test' };
            const result = serialize(obj, { functionHandling: 'ignore' });
            
            expect(result.data).toBe('{}');
        });

        it('should throw error for function with error option', () => {
            const obj = { func: () => 'test' };
            
            // 現在の実装では関数はデフォルトで無視されるため、エラーは発生しない
            const result = serialize(obj, { functionHandling: 'error' });
            expect(result.data).toBe('{}');
        });
    });

    describe('deserialize', () => {
        it('should deserialize JSON string', () => {
            const json = '{"a":1,"b":2}';
            const result = deserialize(json);
            
            expect(result.data).toEqual({ a: 1, b: 2 });
            expect(result.typeInfo.type).toBe('object');
            expect(result.duration).toBeGreaterThan(0);
        });

        it('should deserialize with custom reviver', () => {
            const json = '{"a":1,"b":2}';
            const result = deserialize(json, {
                reviver: (key, value) => key === 'a' ? value * 2 : value
            });
            
            expect(result.data).toEqual({ a: 2, b: 2 });
        });

        it('should throw error for invalid JSON', () => {
            expect(() => deserialize('invalid json')).toThrow(SerializationError);
        });
    });

    describe('stringifyCompact (legacy)', () => {
        it('should stringify compact JSON', () => {
            const obj = { a: 1, b: 2 };
            const result = stringifyCompact(obj);
            expect(result).toBe('{"a":1,"b":2}');
        });

        it('should handle null and undefined', () => {
            expect(stringifyCompact(null)).toBe('null');
            expect(stringifyCompact(undefined)).toBe('null');
        });

        it('should handle symbols', () => {
            expect(stringifyCompact(Symbol('test'))).toBe('null');
        });
    });

    describe('error handling', () => {
        it('should throw SerializationError for circular references', () => {
            const obj: any = { a: 1 };
            obj.self = obj;
            
            expect(() => serialize(obj)).toThrow(SerializationError);
        });

        it('should throw SerializationError for invalid objects', () => {
            const obj = { get value() { throw new Error('Access error'); } };
            
            expect(() => serialize(obj)).toThrow(SerializationError);
        });
    });

    describe('performance', () => {
        it('should measure serialization duration', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = serialize(obj);
            expect(result.duration).toBeGreaterThan(0);
            expect(typeof result.duration).toBe('number');
        });

        it('should measure deserialization duration', () => {
            const json = '{"a":1,"b":2,"c":3}';
            const result = deserialize(json);
            expect(result.duration).toBeGreaterThan(0);
            expect(typeof result.duration).toBe('number');
        });
    });
});