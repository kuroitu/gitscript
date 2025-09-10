/**
 * データ型検出機能
 * 
 * JavaScriptオブジェクトの型を詳細に検出し、
 * シリアライゼーションに必要な情報を提供する
 */

import { DataType, DataTypeInfo } from './types';

/**
 * データ型を検出する
 * @param value 検出する値
 * @returns データ型情報
 */
export function detectDataType(value: unknown): DataTypeInfo {
    const startTime = performance.now();
    
    try {
        const typeInfo = analyzeValue(value);
        const duration = performance.now() - startTime;
        
        return {
            ...typeInfo,
            // パフォーマンス情報は型定義に含まれていないため、ここでは追加しない
        };
    } catch (error) {
        throw new Error(`Failed to detect data type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * 値の詳細分析を行う
 * @param value 分析する値
 * @returns データ型情報
 */
function analyzeValue(value: unknown): DataTypeInfo {
    // null チェック
    if (value === null) {
        return { type: DataType.null };
    }
    
    // undefined チェック
    if (value === undefined) {
        return { type: DataType.undefined };
    }
    
    // プリミティブ型のチェック
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return { type: DataType.primitive };
    }
    
    // BigInt チェック
    if (typeof value === 'bigint') {
        return { type: DataType.bigint };
    }
    
    // Symbol チェック
    if (typeof value === 'symbol') {
        return { type: DataType.symbol };
    }
    
    // Function チェック
    if (typeof value === 'function') {
        return {
            type: DataType.function,
            details: {
                parameterCount: value.length
            }
        };
    }
    
    // Buffer チェック
    if (Buffer.isBuffer(value)) {
        return {
            type: DataType.buffer,
            details: {
                bufferSize: value.length
            }
        };
    }
    
    // Date チェック
    if (value instanceof Date) {
        return { type: DataType.date };
    }
    
    // RegExp チェック
    if (value instanceof RegExp) {
        return { type: DataType.regexp };
    }
    
    // Array チェック
    if (Array.isArray(value)) {
        return {
            type: DataType.array,
            details: {
                elementCount: value.length
            }
        };
    }
    
    // Set チェック
    if (value instanceof Set) {
        return {
            type: DataType.set,
            details: {
                setSize: value.size
            }
        };
    }
    
    // Map チェック
    if (value instanceof Map) {
        return {
            type: DataType.map,
            details: {
                mapSize: value.size
            }
        };
    }
    
    // 通常のオブジェクト
    if (typeof value === 'object') {
        const propertyCount = Object.keys(value).length;
        return {
            type: DataType.object,
            details: {
                propertyCount
            }
        };
    }
    
    // その他の型（通常は到達しない）
    return { type: DataType.primitive };
}

/**
 * 値が特定の型かどうかをチェックする
 * @param value チェックする値
 * @param expectedType 期待する型
 * @returns 型が一致するかどうか
 */
export function isType(value: unknown, expectedType: DataType): boolean {
    const typeInfo = detectDataType(value);
    return typeInfo.type === expectedType;
}

/**
 * 値がプリミティブ型かどうかをチェックする
 * @param value チェックする値
 * @returns プリミティブ型かどうか
 */
export function isPrimitive(value: unknown): boolean {
    return isType(value, DataType.primitive);
}

/**
 * 値がオブジェクト型かどうかをチェックする
 * @param value チェックする値
 * @returns オブジェクト型かどうか
 */
export function isObject(value: unknown): boolean {
    return isType(value, DataType.object);
}

/**
 * 値が配列型かどうかをチェックする
 * @param value チェックする値
 * @returns 配列型かどうか
 */
export function isArray(value: unknown): boolean {
    return isType(value, DataType.array);
}

/**
 * 値がSet型かどうかをチェックする
 * @param value チェックする値
 * @returns Set型かどうか
 */
export function isSet(value: unknown): boolean {
    return isType(value, DataType.set);
}

/**
 * 値がMap型かどうかをチェックする
 * @param value チェックする値
 * @returns Map型かどうか
 */
export function isMap(value: unknown): boolean {
    return isType(value, DataType.map);
}

/**
 * 値がDate型かどうかをチェックする
 * @param value チェックする値
 * @returns Date型かどうか
 */
export function isDate(value: unknown): boolean {
    return isType(value, DataType.date);
}

/**
 * 値がRegExp型かどうかをチェックする
 * @param value チェックする値
 * @returns RegExp型かどうか
 */
export function isRegExp(value: unknown): boolean {
    return isType(value, DataType.regexp);
}

/**
 * 値がFunction型かどうかをチェックする
 * @param value チェックする値
 * @returns Function型かどうか
 */
export function isFunction(value: unknown): boolean {
    return isType(value, DataType.function);
}

/**
 * 値がSymbol型かどうかをチェックする
 * @param value チェックする値
 * @returns Symbol型かどうか
 */
export function isSymbol(value: unknown): boolean {
    return isType(value, DataType.symbol);
}

/**
 * 値がBuffer型かどうかをチェックする
 * @param value チェックする値
 * @returns Buffer型かどうか
 */
export function isBuffer(value: unknown): boolean {
    return isType(value, DataType.buffer);
}

/**
 * 値がBigInt型かどうかをチェックする
 * @param value チェックする値
 * @returns BigInt型かどうか
 */
export function isBigInt(value: unknown): boolean {
    return isType(value, DataType.bigint);
}
