// ネストしたオブジェクトの差分を詳しく調べる
import microdiff from 'microdiff';

const oldObj = { user: { name: 'John', age: 30 } };
const newObj = { user: { name: 'Jane', age: 30 } };
const result = microdiff(oldObj, newObj);

console.log('ネストしたオブジェクトの差分:');
console.log(JSON.stringify(result, null, 2));

// パスを確認
result.forEach((change, index) => {
  console.log(`\n変更 ${index + 1}:`);
  console.log(`パス: ${JSON.stringify(change.path)}`);
  console.log(`タイプ: ${change.type}`);
  console.log(`古い値: ${change.oldValue}`);
  console.log(`新しい値: ${change.value}`);
});
