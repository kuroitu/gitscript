/**
 * JSON操作の低級レイヤ
 * 
 * JSON.stringify/parseの直接使用を避け、
 * 例外ハンドリングを行うラッパー層
 */

import { GitScriptError } from '@/types/Errors';

/**
 * シリアライゼーション関連のエラー
 */
export class SerializationError extends GitScriptError {
    constructor(message: string, cause?: Error) {
        super(`Serialization error: ${message}`, 'SERIALIZATION_ERROR');
        this.name = 'SerializationError';
        if (cause) {
            this.cause = cause;
        }
    }
}

/**
 * オブジェクトをコンパクトなJSON文字列にシリアライズする（スペースなし）
 * @param obj シリアライズするオブジェクト
 * @returns コンパクトなJSON文字列
 * @throws SerializationError シリアライズに失敗した場合
 */
export function stringifyCompact(obj: unknown): string {
    try {
        return JSON.stringify(obj, null, 0);
    } catch (error) {
        throw new SerializationError(
            `Failed to stringify object: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error instanceof Error ? error : undefined
        );
    }
}
