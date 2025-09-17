// microdiffの動作を詳しく調べる
import microdiff from 'microdiff';

console.log('=== microdiff 動作デバッグ ===\n');

// 1. ネストしたオブジェクトのテスト
console.log('1. ネストしたオブジェクト:');
const nested1 = { user: { name: 'John', age: 30 } };
const nested2 = { user: { name: 'Jane', age: 30 } };
const nestedDiff = microdiff(nested1, nested2);
console.log('差分結果:', JSON.stringify(nestedDiff, null, 2));

// 2. ignoreKeysのテスト
console.log('\n2. ignoreKeysのテスト:');
const ignore1 = { a: 1, b: 'test' };
const ignore2 = { a: 1, b: 'updated' };
const ignoreDiff = microdiff(ignore1, ignore2, { ignoreKeys: ['b'] });
console.log('ignoreKeys適用:', JSON.stringify(ignoreDiff, null, 2));

// 3. 配列の順序を考慮しない場合
console.log('\n3. 配列の順序を考慮しない場合:');
const order1 = [1, 2, 3];
const order2 = [3, 1, 2];
const orderDiff = microdiff(order1, order2, { ignoreArrays: true });
console.log('ignoreArrays適用:', JSON.stringify(orderDiff, null, 2));

// 4. 配列の順序を考慮する場合
console.log('\n4. 配列の順序を考慮する場合:');
const orderDiff2 = microdiff(order1, order2, { ignoreArrays: false });
console.log('ignoreArrays=false:', JSON.stringify(orderDiff2, null, 2));
