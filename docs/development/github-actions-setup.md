# GitHub Actions CI/CD セットアップ

GitScriptプロジェクトのGitHub Actions CI/CDパイプラインの設定について説明します。

## 概要

このプロジェクトでは、以下のGitHub Actionsワークフローを設定しています：

1. **CI** - 基本的な継続的インテグレーション
2. **Security Analysis** - セキュリティ監査
3. **Code Quality** - コード品質チェック
4. **Pull Request Checks** - プルリクエスト専用チェック

## ワークフロー詳細

### 1. CI (`ci.yml`)

**トリガー**: プッシュ、プルリクエスト（main/developブランチ）

**実行内容**:
- Node.js 18.x, 20.xでのマトリックステスト
- ESLintによるコード品質チェック
- Prettierによるフォーマットチェック
- TypeScript型チェック
- テスト実行
- カバレッジレポート生成

### 2. Security Analysis (`security.yml`)

**トリガー**: プッシュ、プルリクエスト、スケジュール（毎週月曜日）

**実行内容**:
- npm auditによる脆弱性チェック
- 依存関係レビュー
- ライセンスチェック

### 3. Code Quality (`code-quality.yml`)

**トリガー**: プッシュ、プルリクエスト（main/developブランチ）

**実行内容**:
- ESLint詳細レポート
- TypeScript厳密型チェック
- 未使用依存関係チェック
- バンドルサイズチェック
- 複雑度分析

### 4. Pull Request Checks (`pr-checks.yml`)

**トリガー**: プルリクエスト（作成、更新、再オープン）

**実行内容**:
- セマンティックプルリクエスト検証
- TODO/FIXMEコメントチェック
- console.logステートメントチェック
- ビルド検証
- カバレッジコメント

## ブランチ保護ルールの設定

GitHubリポジトリで以下のブランチ保護ルールを設定してください：

### mainブランチの保護設定

1. **Settings** → **Branches** → **Add rule**
2. **Branch name pattern**: `main`
3. **Protect matching branches**にチェック
4. 以下のオプションを有効化：

#### 必須設定
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: 1
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners**

- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - 以下のチェックを必須に設定：
    - `lint-and-test (18.x)`
    - `lint-and-test (20.x)`
    - `pr-validation`
    - `build-check`

- ✅ **Require conversation resolution before merging**

- ✅ **Restrict pushes that create files that are larger than 100 MB**

#### 推奨設定
- ✅ **Require linear history**
- ✅ **Include administrators**
- ✅ **Allow force pushes**: 無効
- ✅ **Allow deletions**: 無効

### developブランチの保護設定（オプション）

developブランチを使用する場合、同様の設定を適用してください。

## 必須ステータスチェック

以下のステータスチェックがすべて成功する必要があります：

### CI チェック
- `lint-and-test (18.x)` - Node.js 18.xでのテスト
- `lint-and-test (20.x)` - Node.js 20.xでのテスト

### プルリクエストチェック
- `pr-validation` - プルリクエスト検証
- `build-check` - ビルド検証

### セキュリティチェック
- `security-audit` - セキュリティ監査
- `dependency-review` - 依存関係レビュー

## ローカルでの事前チェック

プルリクエストを作成する前に、以下のコマンドでローカルチェックを実行してください：

```bash
# 型チェック
npm run type-check

# リンター実行
npm run lint

# フォーマットチェック
npm run format:check

# テスト実行
npm test

# カバレッジ付きテスト
npm run test:coverage

# セキュリティ監査
npm run audit

# 全チェック実行
npm run ci
```

## トラブルシューティング

### よくある問題

#### 1. ESLintエラー
```bash
# 自動修正可能なエラーを修正
npm run lint:fix

# 手動で修正が必要なエラーを確認
npm run lint
```

#### 2. フォーマットエラー
```bash
# 自動フォーマット
npm run format

# フォーマットチェック
npm run format:check
```

#### 3. 型エラー
```bash
# 型チェック実行
npm run type-check

# 厳密型チェック
npm run type-check:strict
```

#### 4. テスト失敗
```bash
# テスト実行
npm test

# ウォッチモードでテスト
npm run test:watch

# UI付きテスト
npm run test:ui
```

### セキュリティ警告

#### npm audit警告
```bash
# 監査実行
npm run audit

# 自動修正
npm run audit:fix

# 手動でパッケージを更新
npm update
```

## カスタマイズ

### 新しいチェックの追加

1. `.github/workflows/`に新しいワークフローファイルを作成
2. 必要なステップを定義
3. ブランチ保護ルールに新しいチェックを追加

### チェックの無効化

特定のチェックを一時的に無効化する場合：

```yaml
# ワークフローファイルで条件を追加
if: github.event_name != 'pull_request' || github.actor != 'dependabot[bot]'
```

## 監視とアラート

### 失敗通知

ワークフローの失敗時に通知を受け取るには：

1. **Settings** → **Notifications**
2. **Actions**セクションで通知設定を調整

### ダッシュボード

GitHubの**Actions**タブでワークフローの実行状況を監視できます。

## まとめ

このCI/CDパイプラインにより、以下が保証されます：

- ✅ **コード品質**: ESLint、Prettier、TypeScript
- ✅ **セキュリティ**: 脆弱性チェック、依存関係監査
- ✅ **テスト**: 自動テスト実行、カバレッジ測定
- ✅ **ビルド**: 正常なビルドの確認
- ✅ **プルリクエスト品質**: セマンティックコミット、レビュー必須

これにより、安全で高品質なコードベースを維持できます。
