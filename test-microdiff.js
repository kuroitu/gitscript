// microdiffの機能テスト
import microdiff from 'microdiff';

// テストデータ
const oldObj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'swimming'],
  address: {
    city: 'Tokyo',
    country: 'Japan',
  },
};

const newObj = {
  name: 'John',
  age: 31,
  hobbies: ['reading', 'swimming', 'cooking'],
  address: {
    city: 'Osaka',
    country: 'Japan',
  },
};

// 差分計算
const diff = microdiff(oldObj, newObj);
console.log('差分結果:');
console.log(JSON.stringify(diff, null, 2));

// オプションの確認
console.log('\n利用可能なオプション:');
console.log('microdiff options:', Object.keys(microdiff));
