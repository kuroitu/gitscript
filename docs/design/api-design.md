# API 設計

## 概要

GitScript の API は、Git の概念と一貫した操作感を保ちながら、JavaScript オブジェクトの履歴管理を提供します。

## コア API

### Repository インターフェース

```typescript
interface Repository {
  // 基本操作
  init(path: string): Promise<void>;
  add(id: string, data: any): Promise<void>;
  commit(message: string, author?: Author): Promise<string>;
  status(): Promise<RepositoryStatus>;

  // 履歴操作
  log(options?: LogOptions): Promise<Commit[]>;
  show(commitHash: string): Promise<CommitDetails>;
}
```

### データ型

```typescript
interface Author {
  name: string;
}

interface RepositoryStatus {
  staged: Map<string, any>;
  unstaged: Map<string, any>;
  currentCommit: string | null;
}

interface Commit {
  hash: string;
  message: string;
  timestamp: Date;
  author: Author;
  objects: string[];
}

interface CommitDetails extends Commit {
  changes: ObjectChange[];
}

interface ObjectChange {
  id: string;
  type: 'added' | 'modified' | 'deleted';
  data?: any;
  delta?: DataDelta;
}

interface LogOptions {
  limit?: number;
  since?: Date;
  until?: Date;
  author?: string;
}
```

## 使用例

### 基本的な使用例

```typescript
import { GitScript } from 'gitscript';

// リポジトリの初期化
const repo = await GitScript.init('/path/to/repo');

// オブジェクトのステージング
await repo.add('user-1', {
  name: 'John Doe',
  age: 30,
  hobbies: ['reading', 'coding'],
});

// コミット
const commitHash = await repo.commit('Add user data', {
  name: 'John Doe',
});

// 状態の確認
const status = await repo.status();
console.log(status);

// 履歴の表示
const history = await repo.log({ limit: 10 });
console.log(history);

// 特定コミットの詳細
const details = await repo.show(commitHash);
console.log(details);
```

### オブジェクトの更新

```typescript
// オブジェクトの更新
await repo.add('user-1', {
  name: 'John Doe',
  age: 31, // 年齢を更新
  hobbies: ['reading', 'coding', 'gaming'], // 趣味を追加
});

// 変更をコミット
const commitHash2 = await repo.commit('Update user age and hobbies');
```

## 高度な使用例

### バッチ操作

```typescript
// 複数のオブジェクトを一度にステージング
await repo.addBatch([
  { id: 'user-1', data: userData1 },
  { id: 'user-2', data: userData2 },
  { id: 'user-3', data: userData3 },
]);

// 一括コミット
const commitHash = await repo.commit('Add multiple users');
```

### 非同期操作

```typescript
// 並列処理
const [status, history] = await Promise.all([
  repo.status(),
  repo.log({ limit: 5 }),
]);
```

## エラーハンドリング

### エラー型

```typescript
class GitScriptError extends Error {
  code: string;
  details?: any;
}

class RepositoryNotFoundError extends GitScriptError {
  code = 'REPOSITORY_NOT_FOUND';
}

class ObjectNotFoundError extends GitScriptError {
  code = 'OBJECT_NOT_FOUND';
}

class CommitNotFoundError extends GitScriptError {
  code = 'COMMIT_NOT_FOUND';
}
```

### エラーハンドリング例

```typescript
try {
  await repo.add('user-1', userData);
  await repo.commit('Add user data');
} catch (error) {
  if (error instanceof RepositoryNotFoundError) {
    console.error('リポジトリが見つかりません');
  } else if (error instanceof GitScriptError) {
    console.error(`エラー: ${error.message} (${error.code})`);
  } else {
    console.error('予期しないエラー:', error);
  }
}
```

## 設定

### 設定ファイル

```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "core": {
    "defaultBranch": "main",
    "ignoreCase": false
  },
  "delta": {
    "enabled": true,
    "maxChainDepth": 10
  }
}
```

### 設定の読み込み

```typescript
// 設定の読み込み
const config = await GitScript.loadConfig('/path/to/repo');

// 設定の更新
await GitScript.updateConfig('/path/to/repo', {
  user: {
    name: 'Jane Doe',
    email: 'jane@example.com',
  },
});
```

## 拡張性

### カスタムシリアライザー

```typescript
interface CustomSerializer {
  serialize(data: any): string;
  deserialize(data: string): any;
}

// カスタムシリアライザーの登録
GitScript.registerSerializer('custom', new CustomSerializer());
```

### カスタムハッシュアルゴリズム

```typescript
interface CustomHash {
  calculate(data: string): string;
}

// カスタムハッシュの登録
GitScript.registerHash('custom', new CustomHash());
```

## パフォーマンス考慮

### メモリ効率

```typescript
// 大きなオブジェクトの効率的な処理
const largeObject = {
  /* 大きなデータ */
};
await repo.add('large-data', largeObject);

// ストリーミング処理（将来実装予定）
// await repo.addStream("stream-data", dataStream);
```

### キャッシュ戦略

```typescript
// 頻繁にアクセスするオブジェクトのキャッシュ
const cachedObject = await repo.getCached('frequent-access');
```

## テスト

### 単体テスト例

```typescript
import { GitScript } from 'gitscript';

describe('GitScript', () => {
  let repo: Repository;

  beforeEach(async () => {
    repo = await GitScript.init('/tmp/test-repo');
  });

  it('should add and commit objects', async () => {
    await repo.add('test-1', { value: 42 });
    const commitHash = await repo.commit('Test commit');

    expect(commitHash).toBeDefined();

    const status = await repo.status();
    expect(status.staged.size).toBe(0);
  });

  it('should show commit history', async () => {
    await repo.add('test-1', { value: 42 });
    await repo.commit('First commit');

    await repo.add('test-1', { value: 43 });
    await repo.commit('Second commit');

    const history = await repo.log();
    expect(history).toHaveLength(2);
  });
});
```
