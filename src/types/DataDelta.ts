import {
    ArrayOperationType,
    DataType,
    MapOperation as MapOperationType,
    PrimitiveOperation,
    PropertyOperation,
    SetOperation as SetOperationType,
} from '@/types/constants';

/**
 * プリミティブ型
 */
export type PrimitiveType = string | number | boolean | null | undefined;

/**
 * プリミティブ差分
 */
export interface PrimitiveDelta {
    /** プリミティブ型 */
    type: typeof DataType.Primitive;
    /** プリミティブ操作 */
    operation: PrimitiveOperation;
    /** プリミティブ値 */
    value?: PrimitiveType;
}

/**
 * プロパティ差分
 */
export interface PropertyDelta {
    /** プロパティ操作 */
    operation: PropertyOperation;
    /** プロパティ値 */
    value?: unknown;
    /** プロパティ差分 */
    delta?: DataDelta;
}

/**
 * オブジェクト差分
 */
export interface ObjectDelta {
    /** オブジェクト型 */
    type: typeof DataType.Object;
    /** プロパティ操作 */
    operations: Map<string, PropertyDelta>;
}

/**
 * 配列操作
 */
export interface ArrayOperation {
    /** 配列操作 */
    type: ArrayOperationType;
    /** インデックス */
    index: number;
    /** 配列値 */
    value?: unknown;
    /** 配列差分 */
    delta?: DataDelta;
    /** 新しいインデックス */
    newIndex?: number;
}

/**
 * 配列差分
 */
export interface ArrayDelta {
    /** 配列型 */
    type: typeof DataType.Array;
    /** 配列操作 */
    operations: ArrayOperation[];
}

/**
 * Set操作
 */
export interface SetDeltaOperation {
    /** セット操作 */
    operation: SetOperationType;
    /** セット値 */
    value: unknown;
}

/**
 * Set差分
 */
export interface SetDelta {
    /** セット型 */
    type: typeof DataType.Set;
    /** セット操作 */
    operations: SetDeltaOperation[];
}

/**
 * Map操作
 */
export interface MapDeltaOperation {
    /** マップ操作 */
    operation: MapOperationType;
    /** マップキー */
    key: unknown;
    /** マップ値 */
    value?: unknown;
    /** マップ差分 */
    delta?: DataDelta;
}

/**
 * Map差分
 */
export interface MapDelta {
    /** マップ型 */
    type: typeof DataType.Map;
    /** マップ操作 */
    operations: MapDeltaOperation[];
}

/**
 * 統合差分型
 */
export interface DataDelta {
    /** データ差分型 */
    type: DataType;
    /** データ */
    data: PrimitiveDelta | ObjectDelta | ArrayDelta | SetDelta | MapDelta;
    /** タイムスタンプ */
    timestamp: Date;
    /** バージョン */
    version: number;
}
