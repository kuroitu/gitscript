# GitScript

JavaScript オブジェクトに対して Git ライクな履歴管理機能を提供する TypeScript ライブラリです。

## 概要

GitScript は、JavaScript オブジェクト（オブジェクト、配列、Set、Map など）に対して Git のような履歴管理機能を提供します。差分管理による効率的なストレージ使用と、Git の概念と一貫した操作感を実現します。

## 特徴

- **オブジェクト履歴管理**: JavaScript オブジェクトの変更履歴を効率的に管理
- **差分管理**: 変更部分のみを保存することでストレージ効率を最適化
- **Git ライクな操作**: 既存の Git の概念と一貫した操作感
- **型安全性**: TypeScript による型安全な実装
- **ミニマム設計**: 必要最小限の機能から始めて段階的に拡張

## インストール

```bash
npm install gitscript
```

## 基本的な使用例

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
  email: 'john@example.com',
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

## 対応データ型

- **オブジェクト**: ネストしたオブジェクトの変更追跡
- **配列**: 要素の追加・削除・変更の効率的な差分計算
- **Set**: 要素の追加・削除の追跡
- **Map**: キー・値の変更追跡
- **プリミティブ**: 文字列、数値、真偽値などの基本型

## アーキテクチャ

```
API Layer
└── Programmatic API

Core Layer
├── Object Repository
├── Commit Manager
└── Object Manager

Storage Layer
├── SHA-1 Hash
├── JSON Serialization
└── Object Delta Manager

Data Layer
├── JavaScript Objects Store
├── Configuration
└── Object Snapshots
```

## API メソッド一覧

| メソッド | 説明                           |
| -------- | ------------------------------ |
| `init`   | オブジェクトリポジトリの初期化 |
| `add`    | オブジェクトのステージング     |
| `commit` | 変更のコミット                 |
| `status` | 状態の確認                     |
| `log`    | コミット履歴の表示             |
| `show`   | 特定コミットの詳細表示         |

## ストレージ構造

```
.gitscript/
├── objects/          # JavaScriptオブジェクトストア
│   ├── snapshots/    # オブジェクトスナップショット
│   ├── deltas/       # オブジェクト差分
│   └── commits/      # コミットオブジェクト
├── index             # ステージングエリア
├── config.json       # 設定ファイル
└── HEAD              # 現在のコミット
```

## 開発状況

現在、ミニマム構成での実装を進めています。

### 実装予定フェーズ

- **Phase 1**: 基本データ構造（型定義、ハッシュ、シリアライゼーション）
- **Phase 2**: オブジェクト差分管理（差分計算、適用、復元）
- **Phase 3**: コア機能（リポジトリ、ステージング、コミット）
- **Phase 4**: API 層（プログラム API）

## 制限事項

### 現在の制限

- ブランチ機能は含まない
- マージ機能は含まない
- リモートリポジトリ機能は含まない
- 高度なフック機能は含まない

### 将来の拡張予定

- プラグインシステム
- 拡張可能なインターフェース
- 高度な設定オプション
- ブランチ・マージ機能

## 設計書

詳細な設計については、[docs/design/](./docs/design/) ディレクトリを参照してください。

- [ミニマム構成設計](./docs/design/minimal-architecture.md)
- [オブジェクト差分管理設計](./docs/design/object-delta-compression.md)
- [API 設計](./docs/design/api-design.md)
- [実装計画](./docs/design/implementation-plan.md)

## ライセンス

MIT License

## 貢献

プロジェクトへの貢献を歓迎します。詳細については、[CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ロードマップ

- [ ] v0.1.0: 基本的な CRUD 操作と差分管理
- [ ] v0.2.0: パフォーマンス最適化とエラーハンドリング改善
- [ ] v0.3.0: プラグインシステムと拡張可能なインターフェース
- [ ] v1.0.0: ブランチ・マージ機能とリモートリポジトリ対応

## 関連プロジェクト

- [Git](https://git-scm.com/) - 分散バージョン管理システム
- [NodeGit](https://github.com/nodegit/nodegit) - Git の Node.js バインディング
- [isomorphic-git](https://isomorphic-git.org/) - JavaScript で実装された Git

## サポート

問題や質問がある場合は、[Issues](https://github.com/your-username/gitscript/issues) で報告してください。
