# 設定システム設計

## 概要

GitScript は、柔軟で拡張可能な設定システムを提供します。
ユーザーは、基本的な動作から高度なカスタマイズまで、様々なレベルで設定を調整できます。

## 設計原則

1. **階層性**: グローバル → ユーザー → リポジトリ → コマンドの順で設定を継承
2. **型安全性**: TypeScript の型システムによる設定の検証
3. **拡張性**: プラグインやカスタム実装による設定の拡張
4. **検証**: 設定値の妥当性チェックとエラーハンドリング

## 設定の階層構造

### 1. 設定レベル

```typescript
enum ConfigLevel {
  GLOBAL = 'global', // システム全体
  USER = 'user', // ユーザー固有
  REPOSITORY = 'repository', // リポジトリ固有
  COMMAND = 'command', // コマンド固有
}

interface ConfigScope {
  level: ConfigLevel;
  path?: string; // リポジトリパス（repository level）
  command?: string; // コマンド名（command level）
}
```

### 2. 設定の継承

```typescript
interface ConfigInheritance {
  // 設定の取得（継承を考慮）
  get<T>(key: string, scope?: ConfigScope): T | null;

  // 設定の設定
  set<T>(key: string, value: T, scope?: ConfigScope): void;

  // 設定の削除
  unset(key: string, scope?: ConfigScope): void;

  // 設定の一覧
  list(scope?: ConfigScope): Map<string, any>;

  // 設定の検証
  validate(scope?: ConfigScope): ValidationResult;
}
```

## コア設定スキーマ

### 1. 基本設定

```typescript
interface CoreConfig {
  // ユーザー情報
  user: {
    name: string;
  };

  // リポジトリ設定
  repository: {
    defaultBranch: string;
    ignoreCase: boolean;
    autocrlf: 'true' | 'false' | 'input';
  };

  // エディタ設定
  core: {
    editor: string;
    pager: string;
    editor: string;
  };

  // ログ設定
  log: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'text' | 'json' | 'structured';
    output: 'console' | 'file' | 'both';
    file?: string;
  };
}
```

### 2. ストレージ設定

```typescript
interface StorageConfig {
  // ストレージタイプ
  type: 'filesystem' | 'database' | 'cloud' | 'custom';

  // ファイルシステム設定
  filesystem?: {
    basePath: string;
    compression: boolean;
    encryption: boolean;
    encryptionKey?: string;
  };

  // データベース設定
  database?: {
    type: 'sqlite' | 'postgresql' | 'mysql' | 'mongodb';
    connectionString: string;
    options?: any;
  };

  // クラウド設定
  cloud?: {
    provider: 'aws' | 'azure' | 'gcp' | 'custom';
    bucket: string;
    region: string;
    credentials: any;
  };

  // カスタム設定
  custom?: {
    implementation: string;
    config: any;
  };
}
```

### 3. ハッシュ設定

```typescript
interface HashConfig {
  // アルゴリズム
  algorithm: 'sha1' | 'sha256' | 'blake3' | 'custom';

  // カスタムアルゴリズム
  custom?: {
    implementation: string;
    config: any;
  };

  // パフォーマンス設定
  performance: {
    useWorker: boolean;
    workerCount: number;
    chunkSize: number;
  };
}
```

### 4. シリアライゼーション設定

```typescript
interface SerializationConfig {
  // 形式
  format: 'json' | 'messagepack' | 'protobuf' | 'custom';

  // JSON設定
  json?: {
    pretty: boolean;
    validate: boolean;
    schema?: any;
  };

  // MessagePack設定
  messagepack?: {
    compression: boolean;
    binary: boolean;
  };

  // Protocol Buffers設定
  protobuf?: {
    schema: string;
    validate: boolean;
  };

  // カスタム設定
  custom?: {
    implementation: string;
    config: any;
  };
}
```

### 5. プラグイン設定

```typescript
interface PluginConfig {
  // プラグインの有効/無効
  enabled: boolean;

  // プラグイン固有の設定
  config: any;

  // 依存関係
  dependencies: string[];

  // 優先度
  priority: number;

  // 条件付き有効化
  conditions?: {
    os?: string[];
    nodeVersion?: string;
    repository?: string;
  };
}
```

## 設定の管理

### 1. 設定マネージャー

```typescript
interface ConfigManager {
  // 設定の読み込み
  load(scope?: ConfigScope): Promise<void>;

  // 設定の保存
  save(scope?: ConfigScope): Promise<void>;

  // 設定の取得
  get<T>(key: string, scope?: ConfigScope): T | null;
  getRequired<T>(key: string, scope?: ConfigScope): T;

  // 設定の設定
  set<T>(key: string, value: T, scope?: ConfigScope): void;

  // 設定の削除
  unset(key: string, scope?: ConfigScope): void;

  // 設定の検証
  validate(scope?: ConfigScope): Promise<ValidationResult>;

  // 設定のリセット
  reset(scope?: ConfigScope): void;

  // 設定のエクスポート
  export(scope?: ConfigScope): string;

  // 設定のインポート
  import(config: string, scope?: ConfigScope): void;
}
```

### 2. 設定の検証

```typescript
interface ConfigValidator {
  // スキーマの登録
  registerSchema(key: string, schema: any): void;

  // 設定の検証
  validate(key: string, value: any): ValidationResult;

  // スキーマの取得
  getSchema(key: string): any;

  // デフォルト値の取得
  getDefault(key: string): any;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}
```

### 3. 設定の永続化

```typescript
interface ConfigStorage {
  // 設定の読み込み
  load(scope: ConfigScope): Promise<Map<string, any>>;

  // 設定の保存
  save(scope: ConfigScope, config: Map<string, any>): Promise<void>;

  // 設定の削除
  delete(scope: ConfigScope): Promise<void>;

  // 設定の存在確認
  exists(scope: ConfigScope): Promise<boolean>;

  // 設定の一覧
  list(): Promise<ConfigScope[]>;
}
```

## 設定ファイルの形式

### 1. JSON 形式

```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "repository": {
    "defaultBranch": "main",
    "ignoreCase": false
  },
  "storage": {
    "type": "filesystem",
    "filesystem": {
      "basePath": "/path/to/repo",
      "compression": true
    }
  },
  "plugins": {
    "custom-command": {
      "enabled": true,
      "config": {
        "command": "my-command"
      }
    }
  }
}
```

### 2. YAML 形式

```yaml
user:
  name: John Doe
  email: john@example.com

repository:
  defaultBranch: main
  ignoreCase: false

storage:
  type: filesystem
  filesystem:
    basePath: /path/to/repo
    compression: true

plugins:
  custom-command:
    enabled: true
    config:
      command: my-command
```

### 3. TOML 形式

```toml
[user]
name = "John Doe"
email = "john@example.com"

[repository]
defaultBranch = "main"
ignoreCase = false

[storage]
type = "filesystem"

[storage.filesystem]
basePath = "/path/to/repo"
compression = true

[plugins.custom-command]
enabled = true

[plugins.custom-command.config]
command = "my-command"
```

## 使用例

```typescript
// 設定マネージャーの初期化
const configManager = new ConfigManager();

// 設定の読み込み
await configManager.load();

// 設定の取得
const userName = configManager.get<string>('user.name');
const defaultBranch = configManager.get<string>('repository.defaultBranch', {
  level: ConfigLevel.REPOSITORY,
  path: '/path/to/repo',
});

// 設定の設定
configManager.set('user.name', 'Jane Doe');
configManager.set('storage.type', 'database', {
  level: ConfigLevel.REPOSITORY,
  path: '/path/to/repo',
});

// 設定の保存
await configManager.save();

// 設定の検証
const validation = await configManager.validate();
if (!validation.valid) {
  console.error('設定にエラーがあります:', validation.errors);
}
```
