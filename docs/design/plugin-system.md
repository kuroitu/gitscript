# プラグインシステム設計

## 概要

GitScript は、ユーザーが独自の機能を追加できるプラグインシステムを提供します。
これにより、基本的な履歴管理機能を拡張し、特定の用途に特化した機能を実装できます。

## 設計原則

1. **疎結合**: プラグインは互いに独立して動作
2. **拡張性**: 任意のタイミングでプラグインを追加・削除可能
3. **型安全性**: TypeScript の型システムを活用した安全な拡張
4. **パフォーマンス**: プラグインのオーバーヘッドを最小化

## プラグインの種類

### 1. Storage Plugin（ストレージプラグイン）

```typescript
interface StoragePlugin {
  name: string;
  version: string;

  // オブジェクトの保存・取得
  saveObject(hash: string, content: string): Promise<void>;
  getObject(hash: string): Promise<string | null>;
  hasObject(hash: string): Promise<boolean>;

  // 参照の管理
  saveRef(name: string, hash: string): Promise<void>;
  getRef(name: string): Promise<string | null>;
  listRefs(): Promise<Map<string, string>>;
}
```

### 2. Hash Plugin（ハッシュプラグイン）

```typescript
interface HashPlugin {
  name: string;
  algorithm: string;

  // ハッシュの計算
  calculate(content: string): string;
  validate(hash: string): boolean;

  // ハッシュの比較
  equals(hash1: string, hash2: string): boolean;
}
```

### 3. Serialization Plugin（シリアライゼーションプラグイン）

```typescript
interface SerializationPlugin {
  name: string;
  format: string;

  // オブジェクトのシリアライゼーション
  serialize<T>(obj: T): string;
  deserialize<T>(data: string, type: new () => T): T;

  // 形式の検証
  validate(data: string): boolean;
}
```

### 4. Command Plugin（コマンドプラグイン）

```typescript
interface CommandPlugin {
  name: string;
  commands: Command[];

  // コマンドの実行
  execute(command: string, args: string[]): Promise<CommandResult>;

  // ヘルプ情報
  getHelp(command: string): string;
}

interface Command {
  name: string;
  description: string;
  usage: string;
  options: CommandOption[];
  handler: (
    args: string[],
    options: Map<string, any>,
  ) => Promise<CommandResult>;
}

interface CommandOption {
  name: string;
  type: 'string' | 'boolean' | 'number';
  required: boolean;
  description: string;
  defaultValue?: any;
}
```

### 5. Hook Plugin（フックプラグイン）

```typescript
interface HookPlugin {
  name: string;
  hooks: Hook[];

  // フックの登録
  registerHook(hook: Hook): void;

  // フックの実行
  executeHook(event: string, context: any): Promise<void>;
}

interface Hook {
  event: string;
  handler: (context: any) => Promise<void>;
  priority: number;
}
```

## プラグインマネージャー

```typescript
interface PluginManager {
  // プラグインの管理
  registerPlugin(plugin: Plugin): void;
  unregisterPlugin(name: string): void;
  getPlugin<T extends Plugin>(name: string): T | null;
  listPlugins(): Plugin[];

  // プラグインの初期化・終了
  initialize(): Promise<void>;
  shutdown(): Promise<void>;

  // プラグインの設定
  configurePlugin(name: string, config: any): void;
  getPluginConfig(name: string): any;
}

interface Plugin {
  name: string;
  version: string;
  dependencies: string[];

  // ライフサイクル
  initialize(context: PluginContext): Promise<void>;
  shutdown(): Promise<void>;

  // 設定
  configure(config: any): void;
  getConfig(): any;
}

interface PluginContext {
  repository: Repository;
  config: GitConfig;
  eventBus: EventBus;
  logger: Logger;
}
```

## 拡張ポイント

### 1. ストレージ拡張

- ローカルファイルシステム
- データベース（SQLite、PostgreSQL 等）
- クラウドストレージ（S3、Azure Blob 等）
- 分散ストレージ（IPFS 等）

### 2. ハッシュアルゴリズム拡張

- SHA-1（Git 互換）
- SHA-256（より安全）
- BLAKE3（高速）
- カスタムハッシュ

### 3. シリアライゼーション拡張

- JSON（デフォルト）
- MessagePack（効率的）
- Protocol Buffers（型安全）
- カスタム形式

### 4. コマンド拡張

- 基本的な Git コマンド
- カスタムコマンド
- 外部ツール連携
- ワークフロー自動化

### 5. フック拡張

- コミット前フック
- プッシュ前フック
- マージ前フック
- カスタムイベント

## 使用例

```typescript
// プラグインの登録
const pluginManager = new PluginManager();

// ストレージプラグイン
pluginManager.registerPlugin(new FileSystemStoragePlugin({ basePath: "/path/to/repo" }));

// ハッシュプラグイン
pluginManager.registerPlugin(new SHA256HashPlugin());

// コマンドプラグイン
pluginManager.registerPlugin(new CustomCommandPlugin({ commands: [...] }));

// フックプラグイン
pluginManager.registerPlugin(new HookPlugin({ hooks: [...] }));

// 初期化
await pluginManager.initialize();
```

## 設定システム

```typescript
interface PluginConfig {
  [pluginName: string]: {
    enabled: boolean;
    config: any;
    dependencies: string[];
  };
}

interface GitScriptConfig extends GitConfig {
  plugins: PluginConfig;
  storage: {
    type: string;
    config: any;
  };
  hash: {
    algorithm: string;
    config: any;
  };
  serialization: {
    format: string;
    config: any;
  };
}
```
