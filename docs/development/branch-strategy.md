# ブランチ戦略

GitScriptプロジェクトで使用するブランチ戦略と開発ワークフローについて説明します。

## 概要

本プロジェクトでは、**GitHub Flow**をベースとしたシンプルで効率的なブランチ戦略を採用しています。これにより、継続的な統合とデプロイメントを実現し、安全で協力的な開発環境を提供します。

## ブランチ構成

### メインブランチ

#### `main`
- **目的**: 本番環境用の安定版
- **保護**: 直接プッシュ禁止、PR経由のみ
- **状態**: 常にデプロイ可能な状態を維持
- **更新**: プルリクエストのマージ時のみ

### 機能ブランチ

#### `feature/*`
- **目的**: 新機能の開発
- **命名規則**: `feature/機能名`
- **例**: 
  - `feature/object-delta-compression`
  - `feature/plugin-system`
  - `feature/performance-optimization`

#### `fix/*`
- **目的**: バグ修正
- **命名規則**: `fix/バグ修正名`
- **例**:
  - `fix/memory-leak-issue`
  - `fix/hash-collision-bug`
  - `fix/serialization-error`

#### `docs/*`
- **目的**: ドキュメントの更新
- **命名規則**: `docs/ドキュメント名`
- **例**:
  - `docs/api-documentation`
  - `docs/implementation-guide`
  - `docs/contributing-guide`

#### `refactor/*`
- **目的**: リファクタリング
- **命名規則**: `refactor/リファクタリング名`
- **例**:
  - `refactor/error-handling`
  - `refactor/test-structure`
  - `refactor/type-definitions`

#### `chore/*`
- **目的**: ビルド設定、依存関係の更新など
- **命名規則**: `chore/作業名`
- **例**:
  - `chore/update-dependencies`
  - `chore/ci-configuration`
  - `chore/linting-rules`

## 開発ワークフロー

### 1. ブランチ作成

```bash
# 最新のmainブランチを取得
git checkout main
git pull origin main

# 新しい機能ブランチを作成
git checkout -b feature/新機能名

# または
git switch -c feature/新機能名
```

### 2. 開発作業

```bash
# 作業を開始
git checkout feature/新機能名

# 変更をコミット
git add .
git commit -m "feat: 新機能の実装を追加"

# ブランチにプッシュ
git push origin feature/新機能名
```

### 3. プルリクエスト作成

1. GitHubでプルリクエストを作成
2. 適切なテンプレートを使用
3. レビュアーを指定
4. 関連するIssueをリンク

### 4. コードレビュー

- 最低1名のレビューを必須とする
- テストが通ることを確認
- コード品質のチェック
- ドキュメントの更新確認

### 5. マージ

- レビュー承認後、マージを実行
- 不要になったブランチは削除
- 関連するIssueをクローズ

## コミットメッセージ規則

### 形式
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### タイプ
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードスタイルの変更
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルド設定、依存関係の更新

### 例
```bash
git commit -m "feat(hash): SHA-1計算機能を追加"
git commit -m "fix(serialization): 循環参照エラーを修正"
git commit -m "docs(api): APIドキュメントを更新"
git commit -m "test(utils): 型ガード関数のテストを追加"
```

## プルリクエストテンプレート

### 機能追加用テンプレート
```markdown
## 概要
このPRで実装する機能の概要を記述してください。

## 変更内容
- [ ] 変更点1
- [ ] 変更点2
- [ ] 変更点3

## 関連Issue
Closes #123

## テスト
- [ ] 単体テストを追加
- [ ] 統合テストを追加
- [ ] 既存のテストが通ることを確認

## 破壊的変更
- [ ] 破壊的変更なし
- [ ] 破壊的変更あり（詳細を記述）

## レビューポイント
レビュー時に特に注意してほしい点があれば記述してください。
```

### バグ修正用テンプレート
```markdown
## 概要
修正するバグの概要を記述してください。

## 問題
発生していた問題の詳細を記述してください。

## 解決方法
どのように問題を解決したかを記述してください。

## 関連Issue
Fixes #123

## テスト
- [ ] バグ再現テストを追加
- [ ] 修正後のテストを追加
- [ ] 既存のテストが通ることを確認

## 影響範囲
この修正が他の機能に与える影響を記述してください。
```

## ブランチ保護ルール

### mainブランチの保護設定
- **Require pull request reviews before merging**: 有効
- **Required number of reviewers**: 1名以上
- **Dismiss stale reviews when new commits are pushed**: 有効
- **Require status checks to pass before merging**: 有効
- **Require branches to be up to date before merging**: 有効
- **Restrict pushes that create files**: 有効

### 必須ステータスチェック
- テストの実行
- リンターの実行
- ビルドの成功

## 緊急時の対応

### ホットフィックス
緊急のバグ修正が必要な場合：

```bash
# mainブランチから直接hotfixブランチを作成
git checkout main
git checkout -b hotfix/緊急修正名

# 修正を実装
git add .
git commit -m "hotfix: 緊急バグ修正"

# プッシュしてPR作成
git push origin hotfix/緊急修正名
```

### ロールバック
問題が発生した場合：

```bash
# 特定のコミットに戻る
git revert <commit-hash>

# または特定のコミットまで戻る
git reset --hard <commit-hash>
git push --force-with-lease origin main
```

## ベストプラクティス

### ブランチ管理
- ブランチ名は分かりやすく、目的が明確であること
- 1つのブランチには1つの機能・修正のみ
- 定期的にmainブランチから最新の変更を取得
- 不要になったブランチは削除

### コミット管理
- 小さく、論理的な単位でコミット
- コミットメッセージは明確で分かりやすく
- 関連する変更は同じコミットに含める

### プルリクエスト管理
- 小さく、レビューしやすいサイズに保つ
- 適切な説明とコンテキストを提供
- レビュアーの負担を考慮する

## ツールと設定

### 推奨Git設定
```bash
# ブランチ名の自動補完
git config --global branch.autosetupmerge always
git config --global branch.autosetuprebase always

# プッシュ時のデフォルト動作
git config --global push.default simple

# プルリクエスト用のエイリアス
git config --global alias.pr '!f() { git push -u origin $(git branch --show-current); }; f'
```

### GitHub CLIの活用
```bash
# プルリクエストの作成
gh pr create --title "機能名" --body "説明"

# プルリクエストの一覧表示
gh pr list

# プルリクエストのマージ
gh pr merge <number> --merge
```

## まとめ

このブランチ戦略により、以下のメリットが得られます：

- **安全性**: メインブランチの保護
- **品質**: コードレビューによる品質向上
- **協力性**: チーム開発の効率化
- **追跡性**: 変更履歴の明確な管理
- **柔軟性**: 実験的な機能開発の安全性

この戦略に従うことで、安全で効率的な開発を実現できます。
