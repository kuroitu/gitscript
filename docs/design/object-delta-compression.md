# オブジェクト差分管理（Object Delta Compression）設計

## 概要

GitScript では、JavaScript のオブジェクト、配列、その他のデータ構造を管理対象とします。
これらのデータ構造に対して効率的な差分管理システムを実装することで、メモリ効率とストレージ効率を向上させます。

## 設計原則

1. **型安全性**: TypeScript の型システムを活用した安全な差分管理
2. **効率性**: オブジェクトの変更部分のみを保存
3. **汎用性**: 様々なデータ型に対応
4. **パフォーマンス**: 高速な差分計算と適用

## データ型の分類

### 1. プリミティブ型

```typescript
type PrimitiveType = string | number | boolean | null | undefined;

interface PrimitiveDelta {
  type: 'primitive';
  operation: 'set' | 'delete';
  value?: PrimitiveType;
}
```

### 2. オブジェクト型

```typescript
interface ObjectDelta {
  type: 'object';
  operations: Map<string, PropertyDelta>;
}

interface PropertyDelta {
  operation: 'set' | 'delete' | 'modify';
  value?: any;
  delta?: DataDelta;
}
```

### 3. 配列型

```typescript
interface ArrayDelta {
  type: 'array';
  operations: ArrayOperation[];
}

interface ArrayOperation {
  type: 'insert' | 'delete' | 'modify' | 'move';
  index: number;
  value?: any;
  delta?: DataDelta;
  newIndex?: number; // move の場合
}
```

### 4. 集合型（Set/Map）

```typescript
interface SetDelta {
  type: 'set';
  operations: SetOperation[];
}

interface SetOperation {
  operation: 'add' | 'delete';
  value: any;
}

interface MapDelta {
  type: 'map';
  operations: MapOperation[];
}

interface MapOperation {
  operation: 'set' | 'delete';
  key: any;
  value?: any;
  delta?: DataDelta;
}
```

## 統合差分型

```typescript
interface DataDelta {
  type: 'primitive' | 'object' | 'array' | 'set' | 'map';
  data: PrimitiveDelta | ObjectDelta | ArrayDelta | SetDelta | MapDelta;
  timestamp: Date;
  version: number;
}

interface ObjectSnapshot {
  hash: string;
  data: any;
  type: string;
  timestamp: Date;
  version: number;
}
```

## 差分計算エンジン

### 1. オブジェクト差分計算

```typescript
interface ObjectDeltaCalculator {
  calculateDelta(base: any, target: any): DataDelta | null;
}
```

**責務**:

- 2 つのオブジェクト間の差分を計算
- 型の変更を検出
- 各データ型に応じた差分アルゴリズムの適用

**主要メソッド**:

- `calculateDelta()`: ベースオブジェクトとターゲットオブジェクトの差分を計算

## 差分適用エンジン

### 1. 差分の適用

```typescript
interface ObjectDeltaApplier {
  applyDelta(base: any, delta: DataDelta): any;
}
```

**責務**:

- 差分をベースオブジェクトに適用
- 各データ型に応じた適用ロジックの実行
- ネストしたオブジェクトの再帰的適用

**主要メソッド**:

- `applyDelta()`: ベースオブジェクトに差分を適用して新しいオブジェクトを生成

## オブジェクト管理システム

### 1. オブジェクトリポジトリ

```typescript
interface ObjectRepository {
  saveObject(id: string, data: any): string;
  updateObject(id: string, newData: any): string;
  getObject(id: string): any;
  getObjectAtVersion(id: string, version: number): any;
  getObjectHistory(id: string): ObjectSnapshot[];
}
```

**責務**:

- オブジェクトの保存・取得・更新
- バージョン管理
- 履歴の追跡
- 差分の管理

**主要メソッド**:

- `saveObject()`: 新しいオブジェクトを保存
- `updateObject()`: オブジェクトを更新（差分として保存）
- `getObject()`: 最新バージョンのオブジェクトを取得
- `getObjectAtVersion()`: 特定バージョンのオブジェクトを取得
- `getObjectHistory()`: オブジェクトの変更履歴を取得

## 使用例

```typescript
// オブジェクトリポジトリの使用例
const repo = new ObjectRepository();

// 初期オブジェクトの保存
const userData = { name: 'John Doe', age: 30, hobbies: ['reading', 'coding'] };
const hash1 = repo.saveObject('user-1', userData);

// オブジェクトの更新（差分として保存）
const updatedUserData = {
  name: 'John Doe',
  age: 31,
  hobbies: ['reading', 'coding', 'gaming'],
};
const hash2 = repo.updateObject('user-1', updatedUserData);

// オブジェクトの取得
const currentData = repo.getObject(hash2);

// 履歴の取得
const history = repo.getObjectHistory('user-1');

// 特定バージョンの取得
const version1Data = repo.getObjectAtVersion('user-1', 1);
```

## 実装順序

1. **基本データ型の差分計算** - プリミティブ、オブジェクト、配列
2. **高度なデータ型の差分計算** - Set、Map
3. **差分の適用エンジン** - 各データ型への差分適用
4. **オブジェクトリポジトリ** - スナップショットと差分の管理
5. **最適化** - パフォーマンスの向上

## 設計の特徴

- **型安全性**: TypeScript の型システムを活用
- **効率性**: 変更部分のみを保存
- **拡張性**: 新しいデータ型の追加が容易
- **互換性**: 既存の JavaScript データ構造との親和性
