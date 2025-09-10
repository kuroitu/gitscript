/**
 * シリアライゼーション機能のエクスポート
 * 
 * GitScriptライブラリのシリアライゼーション機能を提供するモジュール
 */

// 型定義
export type {
    SerializationFormat,
    DataType,
    DataTypeInfo,
    SerializationOptions,
    DeserializationOptions,
    DeepCopyOptions,
    SerializationResult,
    DeserializationResult,
    DeepCopyResult
} from './types';

export {
    SerializationFormat,
    DataType
} from './types';

// エラー
export { SerializationError } from './JsonProvider';

// データ型検出
export {
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
} from './DataTypeDetector';

// シリアライゼーション
export {
    stringifyCompact,
    serialize,
    deserialize
} from './JsonProvider';

// 深いコピー
export {
    deepCopy
} from './DeepCopyProvider';

