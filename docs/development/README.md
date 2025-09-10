# 開発ドキュメント

GitScriptプロジェクトの開発に関するドキュメントです。

## 目次

- [ブランチ戦略](./branch-strategy.md) - ブランチ戦略と開発ワークフロー
- [コントリビューションガイド](../CONTRIBUTING.md) - プロジェクトへの貢献方法
- [コーディング規約](./coding-standards.md) - コーディング規約とスタイルガイド
- [テストガイド](./testing-guide.md) - テストの書き方と実行方法
- [リリースプロセス](./release-process.md) - リリースの手順

## 開発環境のセットアップ

### 前提条件

- Node.js 18.0.0以上
- npm または yarn
- Git

### セットアップ手順

1. リポジトリをクローン

```bash
git clone https://github.com/kuroitu/gitscript.git
cd gitscript
```

2. 依存関係をインストール

```bash
npm install
```

3. 開発サーバーを起動

```bash
npm run dev
```

4. テストを実行

```bash
npm test
```

## 開発ワークフロー

1. Issueを作成または既存のIssueを確認
2. ブランチを作成
3. 機能を実装
4. テストを追加
5. プルリクエストを作成
6. コードレビューを受ける
7. マージ

詳細は[ブランチ戦略](./branch-strategy.md)を参照してください。

## プロジェクト構造

```
gitscript/
├── src/                    # ソースコード
│   ├── core/              # コア機能
│   ├── types/             # 型定義
│   └── index.ts           # エントリーポイント
├── tests/                 # テストコード
├── docs/                  # ドキュメント
│   ├── design/            # 設計ドキュメント
│   └── development/       # 開発ドキュメント
├── .github/               # GitHub設定
│   ├── ISSUE_TEMPLATE/    # Issueテンプレート
│   └── pull_request_template.md
└── package.json           # プロジェクト設定
```

## コマンド一覧

### 開発

```bash
npm run dev          # 開発モードでビルド
npm run build        # 本番用ビルド
npm run preview      # ビルド結果のプレビュー
```

### テスト

```bash
npm test             # テスト実行
npm run test:watch   # ウォッチモードでテスト
npm run test:ui      # UI付きテスト
npm run test:coverage # カバレッジ付きテスト
```

### コード品質

```bash
npm run lint         # リンター実行
npm run lint:fix     # リンター自動修正
npm run format       # フォーマッター実行
npm run format:check # フォーマットチェック
```

## 貢献方法

プロジェクトへの貢献を歓迎します。詳細は[CONTRIBUTING.md](../CONTRIBUTING.md)を参照してください。

## サポート

質問や問題がある場合は、[Issues](https://github.com/kuroitu/gitscript/issues)で報告してください。
