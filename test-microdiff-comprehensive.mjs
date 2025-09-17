// microdiffの包括的な機能テスト
import microdiff from 'microdiff';

console.log('=== microdiff 包括的機能テスト ===\n');

// 1. 基本的なオブジェクト差分
console.log('1. 基本的なオブジェクト差分:');
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 3, c: 4 };
const basicDiff = microdiff(obj1, obj2);
console.log(JSON.stringify(basicDiff, null, 2));

// 2. ネストしたオブジェクト
console.log('\n2. ネストしたオブジェクト:');
const nested1 = { user: { name: 'John', age: 30 } };
const nested2 = { user: { name: 'Jane', age: 30 } };
const nestedDiff = microdiff(nested1, nested2);
console.log(JSON.stringify(nestedDiff, null, 2));

// 3. 配列の差分
console.log('\n3. 配列の差分:');
const arr1 = [1, 2, 3];
const arr2 = [1, 4, 3, 5];
const arrayDiff = microdiff(arr1, arr2);
console.log(JSON.stringify(arrayDiff, null, 2));

// 4. Set の差分（オブジェクトとして扱う）
console.log('\n4. Set の差分:');
const set1 = new Set([1, 2, 3]);
const set2 = new Set([1, 4, 3]);
const setDiff = microdiff(set1, set2);
console.log(JSON.stringify(setDiff, null, 2));

// 5. Map の差分（オブジェクトとして扱う）
console.log('\n5. Map の差分:');
const map1 = new Map([['a', 1], ['b', 2]]);
const map2 = new Map([['a', 1], ['b', 3], ['c', 4]]);
const mapDiff = microdiff(map1, map2);
console.log(JSON.stringify(mapDiff, null, 2));

// 6. 複雑なネスト構造
console.log('\n6. 複雑なネスト構造:');
const complex1 = {
  users: [
    { id: 1, name: 'John', tags: ['admin', 'user'] },
    { id: 2, name: 'Jane', tags: ['user'] }
  ],
  settings: { theme: 'dark', lang: 'en' }
};
const complex2 = {
  users: [
    { id: 1, name: 'John', tags: ['admin', 'user', 'moderator'] },
    { id: 2, name: 'Jane', tags: ['user'] },
    { id: 3, name: 'Bob', tags: ['user'] }
  ],
  settings: { theme: 'light', lang: 'en' }
};
const complexDiff = microdiff(complex1, complex2);
console.log(JSON.stringify(complexDiff, null, 2));

// 7. オプションのテスト
console.log('\n7. オプションのテスト:');
const optionsTest1 = { a: 1, b: 2, c: 3 };
const optionsTest2 = { a: 1, b: 3, c: 3, d: 4 };
const optionsDiff = microdiff(optionsTest1, optionsTest2, {
  cyclesFix: true,
  ignoreArrays: false,
  ignoreKeys: ['c'] // cを無視
});
console.log('ignoreKeys適用:', JSON.stringify(optionsDiff, null, 2));

// 8. 配列の順序を考慮しない場合
console.log('\n8. 配列の順序を考慮しない場合:');
const orderTest1 = [1, 2, 3];
const orderTest2 = [3, 1, 2];
const orderDiff = microdiff(orderTest1, orderTest2, {
  ignoreArrays: true
});
console.log('ignoreArrays適用:', JSON.stringify(orderDiff, null, 2));
