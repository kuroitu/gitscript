import {
  isArray,
  isBoolean,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from '@/core';
import {
  MicrodiffChange,
  MicrodiffChangeType,
  MicrodiffOptions,
  MicrodiffPath,
  MicrodiffResult,
  MicrodiffSource,
} from '@/patch/microdiff/types';
import {
  DifferenceChange,
  DifferenceCreate,
  DifferenceRemove,
} from 'microdiff';

/**
 * 値がMicrodiffOptionsかどうかをチェックする
 * @param value チェックする値
 * @returns MicrodiffOptionsの場合true
 */
export function isMicrodiffOptions(value: unknown): value is MicrodiffOptions {
  const options = value as MicrodiffOptions;
  return (
    !!options &&
    isObject(options) &&
    (isUndefined(options.cyclesFix) || isBoolean(options.cyclesFix))
  );
}

/**
 * 値がMicrodiffChangeTypeかどうかをチェックする
 * @param value チェックする値
 * @returns MicrodiffChangeTypeの場合true
 */
export function isMicrodiffChangeType(
  value: unknown,
): value is MicrodiffChangeType {
  return Object.values(MicrodiffChangeType).some((type) => type === value);
}

/**
 * 値がMicrodiffPathかどうかをチェックする
 * @param value チェックする値
 * @returns MicrodiffPathの場合true
 */
export function isMicrodiffPath(value: unknown): value is MicrodiffPath {
  return isArray(value) && value.every((v) => isString(v) || isNumber(v));
}

/**
 * 値がMicrodiffSourceかどうかをチェックする
 * @param value チェックする値
 * @returns MicrodiffSourceの場合true
 */
export function isMicrodiffSource(value: unknown): value is MicrodiffSource {
  return isObject(value) || isArray(value);
}

/**
 * 値がMicrodiffChangeかどうかをチェックする
 * @param value チェックする値
 * @returns MicrodiffChangeの場合true
 */
export function isMicrodiffChange(value: unknown): value is MicrodiffChange {
  return (
    isDifferenceCreate(value) ||
    isDifferenceRemove(value) ||
    isDifferenceChange(value)
  );
}

/**
 * 値がMicrodiffResultかどうかをチェックする
 * @param value チェックする値
 * @returns MicrodiffResultの場合true
 */
export function isMicrodiffResult(value: unknown): value is MicrodiffResult {
  return isArray(value) && value.every((v) => isMicrodiffChange(v));
}

/**
 * 値がDifferenceCreateかどうかをチェックする
 * @param value チェックする値
 * @returns DifferenceCreateの場合true
 */
function isDifferenceCreate(value: unknown): value is DifferenceCreate {
  const create = value as DifferenceCreate;
  return (
    !!create &&
    create.type === MicrodiffChangeType.Create &&
    isMicrodiffPath(create.path) &&
    !isUndefined(create.value)
  );
}

/**
 * 値がDifferenceRemoveかどうかをチェックする
 * @param value チェックする値
 * @returns DifferenceRemoveの場合true
 */
function isDifferenceRemove(value: unknown): value is DifferenceRemove {
  const remove = value as DifferenceRemove;
  return (
    !!remove &&
    remove.type === MicrodiffChangeType.Remove &&
    isMicrodiffPath(remove.path) &&
    !isUndefined(remove.oldValue)
  );
}

/**
 * 値がDifferenceChangeかどうかをチェックする
 * @param value チェックする値
 * @returns DifferenceChangeの場合true
 */
function isDifferenceChange(value: unknown): value is DifferenceChange {
  const change = value as DifferenceChange;
  return (
    !!change &&
    change.type === MicrodiffChangeType.Change &&
    isMicrodiffPath(change.path) &&
    !isUndefined(change.value) &&
    !isUndefined(change.oldValue)
  );
}
