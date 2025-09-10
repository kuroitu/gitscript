# エラーテストのガイドライン

エラーメッセージの変更に柔軟に対応できるテストの書き方について説明します。

## 1. 基本的なエラーテスト

### ❌ 避けるべき書き方（メンテナンス性が悪い）

```typescript
// 完全なエラーメッセージをテスト
expect(() => calculateHash(123)).toThrow(
  "Expected string for parameter 'content', but got number",
);
```

### ✅ 推奨する書き方

#### エラータイプのみをテスト

```typescript
import { TypeError } from '@/types/Errors';

// エラーの種類のみをテスト（メッセージの変更に影響されない）
expect(() => calculateHash(123)).toThrow(TypeError);
```

#### エラーが投げられることのみをテスト

```typescript
// エラーが投げられることのみをテスト
expect(() => calculateHash(123)).toThrow();
```

#### 重要なキーワードのみをテスト

```typescript
import { expectErrorMessageContains } from './testHelpers';

// 重要なキーワードのみをテスト
expectErrorMessageContains(() => calculateHash(123), 'string', 'content');
```

## 2. ヘルパー関数の活用

### エラータイプのテスト

```typescript
import { expectErrorType } from './testHelpers';
import { InvalidHashError } from '@/types/Errors';

expectErrorType(() => shortenHash('invalid'), InvalidHashError);
```

### 部分一致のテスト

```typescript
import { expectErrorMessageContains } from './testHelpers';

expectErrorMessageContains(
  () => calculateHash(123),
  'string',
  'content',
  'number',
);
```

### 正規表現でのテスト

```typescript
import { expectErrorMessageMatches } from './testHelpers';

expectErrorMessageMatches(
  () => calculateHash(123),
  /Expected \w+ for parameter '\w+', but got \w+/,
);
```

## 3. テストの優先度

1. **エラータイプのテスト** - 最も重要で安定
2. **エラーが投げられることのテスト** - 基本的な動作確認
3. **部分一致のテスト** - 重要な情報が含まれることを確認
4. **完全一致のテスト** - 最後の手段（メンテナンス性が悪い）

## 4. 実際の使用例

### ハッシュ関連のエラー

```typescript
// 無効なハッシュ形式
expect(() => shortenHash('invalid')).toThrow(InvalidHashError);

// ハッシュが含まれることを確認
expect(() => shortenHash('invalid')).toThrow('invalid');
```

### 型関連のエラー

```typescript
// 型エラーが投げられることを確認
expect(() => calculateHash(123)).toThrow(TypeError);

// 重要なキーワードが含まれることを確認
expectErrorMessageContains(() => calculateHash(123), 'string', 'content');
```

### 引数関連のエラー

```typescript
// 引数エラーが投げられることを確認
expect(() => shortenHash('valid', 3)).toThrow(ArgumentError);

// パラメータ名が含まれることを確認
expectErrorMessageContains(() => shortenHash('valid', 3), 'length');
```

## 5. ベストプラクティス

1. **エラーメッセージの完全一致は避ける**
2. **エラータイプのテストを優先する**
3. **重要なキーワードのみをテストする**
4. **ヘルパー関数を活用する**
5. **テストの意図を明確にする**

## 6. エラーメッセージを変更する場合

1. エラーメッセージを変更
2. エラータイプのテストは変更不要
3. 部分一致のテストは必要に応じて調整
4. 完全一致のテストのみ修正が必要

この方法により、エラーメッセージの変更によるテストの修正を最小限に抑えることができます。
