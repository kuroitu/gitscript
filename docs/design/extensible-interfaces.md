# 拡張可能なインターフェース設計

## 概要

GitScript は、ユーザーが独自の実装を提供できる拡張可能なインターフェースを提供します。
これにより、基本的な機能をカスタマイズし、特定の用途に最適化した実装を選択できます。

## 設計原則

1. **インターフェース分離**: 各機能を独立したインターフェースとして定義
2. **実装の交換可能性**: 異なる実装を動的に切り替え可能
3. **型安全性**: TypeScript の型システムによる安全な拡張
4. **パフォーマンス**: インターフェースのオーバーヘッドを最小化

## コアインターフェース

### 1. Repository Interface（リポジトリインターフェース）

```typescript
interface IRepository {
    // 基本情報
    readonly rootPath: string;
    readonly config: GitConfig;
    readonly currentBranch: string;
    readonly head: string;

    // 初期化・終了
    initialize(): Promise<void>;
    shutdown(): Promise<void>;

    // 状態管理
    getStatus(): Promise<RepositoryStatus>;
    refresh(): Promise<void>;

    // ブランチ管理
    createBranch(name: string, startPoint?: string): Promise<Branch>;
    deleteBranch(name: string): Promise<void>;
    switchBranch(name: string): Promise<void>;
    listBranches(): Promise<Branch[]>;

    // コミット管理
    createCommit(message: string, author: Author): Promise<Commit>;
    getCommit(hash: string): Promise<Commit | null>;
    listCommits(options?: CommitListOptions): Promise<Commit[]>;

    // ファイル管理
    addFile(path: string): Promise<void>;
    removeFile(path: string): Promise<void>;
    getFile(path: string, commit?: string): Promise<string | null>;

    // 差分・履歴
    getDiff(options: DiffOptions): Promise<Diff[]>;
    getHistory(options: HistoryOptions): Promise<CommitHistoryEntry[]>;
}

interface RepositoryStatus {
    workingDirectory: Map<string, FileStatus>;
    stagingArea: Map<string, FileStatus>;
    currentBranch: string;
    head: string;
    isClean: boolean;
}

interface FileStatus {
    path: string;
    status: "untracked" | "modified" | "staged" | "deleted" | "renamed";
    hash?: string;
    oldPath?: string;
}
```

### 2. Storage Interface（ストレージインターフェース）

```typescript
interface IStorage {
    // オブジェクト管理
    saveObject(hash: string, content: string): Promise<void>;
    getObject(hash: string): Promise<string | null>;
    hasObject(hash: string): Promise<boolean>;
    deleteObject(hash: string): Promise<void>;

    // 参照管理
    saveRef(name: string, hash: string): Promise<void>;
    getRef(name: string): Promise<string | null>;
    deleteRef(name: string): Promise<void>;
    listRefs(): Promise<Map<string, string>>;

    // バックアップ・復元
    createBackup(): Promise<string>;
    restoreBackup(backupId: string): Promise<void>;
    listBackups(): Promise<BackupInfo[]>;

    // 統計情報
    getStats(): Promise<StorageStats>;
    optimize(): Promise<void>;
}

interface BackupInfo {
    id: string;
    timestamp: Date;
    size: number;
    description?: string;
}

interface StorageStats {
    totalObjects: number;
    totalSize: number;
    compressionRatio: number;
    lastOptimized: Date;
}
```

### 3. Hash Interface（ハッシュインターフェース）

```typescript
interface IHash {
    // ハッシュ計算
    calculate(content: string): string;
    calculateFromStream(stream: ReadableStream): Promise<string>;

    // ハッシュ検証
    validate(hash: string): boolean;
    equals(hash1: string, hash2: string): boolean;

    // アルゴリズム情報
    readonly algorithm: string;
    readonly length: number;
    readonly isSecure: boolean;

    // パフォーマンス
    benchmark(size: number): Promise<HashBenchmark>;
}

interface HashBenchmark {
    algorithm: string;
    size: number;
    timeMs: number;
    throughputMBps: number;
}
```

### 4. Serialization Interface（シリアライゼーションインターフェース）

```typescript
interface ISerialization {
    // シリアライゼーション
    serialize<T>(obj: T): string;
    deserialize<T>(data: string, type: new () => T): T;

    // ストリーム対応
    serializeToStream<T>(obj: T): ReadableStream;
    deserializeFromStream<T>(stream: ReadableStream, type: new () => T): Promise<T>;

    // 形式情報
    readonly format: string;
    readonly mimeType: string;
    readonly isBinary: boolean;

    // 検証
    validate(data: string): boolean;
    getSchema(): any;
}
```

### 5. Command Interface（コマンドインターフェース）

```typescript
interface ICommand {
    // コマンド実行
    execute(args: string[], options: Map<string, any>): Promise<CommandResult>;

    // ヘルプ情報
    getHelp(): string;
    getUsage(): string;

    // コマンド情報
    readonly name: string;
    readonly description: string;
    readonly options: CommandOption[];
    readonly aliases: string[];

    // バリデーション
    validate(args: string[], options: Map<string, any>): Promise<ValidationResult>;
}

interface CommandResult {
    success: boolean;
    output: string;
    error?: string;
    exitCode: number;
    metadata?: any;
}

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
```

### 6. Event Interface（イベントインターフェース）

```typescript
interface IEventBus {
    // イベント管理
    emit(event: string, data: any): Promise<void>;
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;
    once(event: string, handler: EventHandler): void;

    // イベント情報
    listEvents(): string[];
    getEventHandlers(event: string): EventHandler[];

    // ライフサイクル
    start(): Promise<void>;
    stop(): Promise<void>;
}

interface EventHandler {
    (event: string, data: any): Promise<void>;
    priority?: number;
    filter?: (data: any) => boolean;
}
```

## 実装の選択と設定

### 1. 実装の登録

```typescript
interface ImplementationRegistry {
    // 実装の登録
    register<T>(interface: new () => T, implementation: new () => T): void;
    registerInstance<T>(interface: new () => T, instance: T): void;

    // 実装の取得
    get<T>(interface: new () => T): T;
    getInstance<T>(interface: new () => T): T;

    // 実装の一覧
    listImplementations<T>(interface: new () => T): string[];

    // 設定
    configure<T>(interface: new () => T, config: any): void;
}
```

### 2. 設定による実装選択

```typescript
interface ImplementationConfig {
    [interfaceName: string]: {
        implementation: string;
        config: any;
        dependencies: string[];
    };
}

// 設定例
const config: ImplementationConfig = {
    IStorage: {
        implementation: "FileSystemStorage",
        config: {
            basePath: "/path/to/repo",
            compression: true,
        },
        dependencies: [],
    },
    IHash: {
        implementation: "SHA256Hash",
        config: {
            algorithm: "sha256",
        },
        dependencies: [],
    },
    ISerialization: {
        implementation: "JSONSerialization",
        config: {
            pretty: false,
            validate: true,
        },
        dependencies: [],
    },
};
```

### 3. 動的な実装切り替え

```typescript
class RepositoryManager {
    private registry: ImplementationRegistry;

    constructor(config: ImplementationConfig) {
        this.registry = new ImplementationRegistry();
        this.loadConfig(config);
    }

    private loadConfig(config: ImplementationConfig): void {
        for (const [interfaceName, implConfig] of Object.entries(config)) {
            const implementation = this.createImplementation(implConfig);
            this.registry.register(interfaceName, implementation);
        }
    }

    // 実行時に実装を切り替え
    switchImplementation<T>(interface: new () => T, implementation: new () => T): void {
        this.registry.register(interface, implementation);
    }

    // リポジトリの作成
    createRepository(path: string): IRepository {
        const storage = this.registry.get<IStorage>(IStorage);
        const hash = this.registry.get<IHash>(IHash);
        const serialization = this.registry.get<ISerialization>(ISerialization);

        return new Repository(path, storage, hash, serialization);
    }
}
```

## 使用例

```typescript
// カスタムストレージ実装
class DatabaseStorage implements IStorage {
    constructor(private db: Database) {}
    // 実装詳細...
}

// カスタムハッシュ実装
class BLAKE3Hash implements IHash {
    readonly algorithm = "blake3";
    readonly length = 32;
    readonly isSecure = true;
    // 実装詳細...
}

// 実装の登録と使用
const registry = new ImplementationRegistry();
registry.register(IStorage, DatabaseStorage);
registry.register(IHash, BLAKE3Hash);

const repository = new Repository("/path/to/repo", registry);
```
