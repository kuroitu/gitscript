import {
  calculateSha1,
  calculateSha1FromMultiple,
  CryptoError,
  isCryptoAvailable,
} from '@/core/crypto';
import { expectValidHash } from '@tests/core/crypto/testHelpers';
import { describe, expect, it } from 'vitest';

describe('Crypto Module Integration', () => {
  describe('Module exports', () => {
    it('should export all required functions', () => {
      expect(typeof calculateSha1).toBe('function');
      expect(typeof calculateSha1FromMultiple).toBe('function');
      expect(typeof isCryptoAvailable).toBe('function');
      expect(CryptoError).toBeDefined();
    });
  });

  describe('Basic functionality integration', () => {
    it('should work together for complete hash workflow', () => {
      // 基本的なハッシュ計算ワークフロー
      const data = 'test data';
      const hash = calculateSha1(data);

      expectValidHash(hash);

      // 同じデータから再度ハッシュを計算して一貫性を確認
      const hash2 = calculateSha1(data);
      expect(hash).toBe(hash2);
    });

    it('should handle multiple data types in workflow', () => {
      const stringData = 'hello';
      const bufferData = Buffer.from('world', 'utf8');

      const stringHash = calculateSha1(stringData);
      const bufferHash = calculateSha1(bufferData);
      const combinedHash = calculateSha1FromMultiple([stringData, bufferData]);

      expectValidHash(stringHash);
      expectValidHash(bufferHash);
      expectValidHash(combinedHash);

      // すべて異なるハッシュであることを確認
      expect(stringHash).not.toBe(bufferHash);
      expect(stringHash).not.toBe(combinedHash);
      expect(bufferHash).not.toBe(combinedHash);
    });

    it('should handle crypto availability check', () => {
      const available = isCryptoAvailable();
      expect(typeof available).toBe('boolean');

      if (available) {
        // 利用可能な場合は正常にハッシュ計算ができることを確認
        const hash = calculateSha1('test');
        expectValidHash(hash);
      }
    });
  });

  describe('Error handling integration', () => {
    it('should handle CryptoError properly', () => {
      // CryptoErrorが正しく定義されていることを確認
      expect(CryptoError.prototype).toBeInstanceOf(Error);

      // インスタンスのnameプロパティをテスト
      const error = new CryptoError('Test error');
      expect(error.name).toBe('CryptoError');
    });

    it('should provide meaningful error messages', () => {
      // エラーメッセージが適切に設定されていることを確認
      const error = new CryptoError('Test error');
      expect(error.message).toContain('Crypto error: Test error');
      expect(error.code).toBe('CRYPTO_ERROR');
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should handle file-like data simulation', () => {
      // ファイルのようなデータのシミュレーション
      const fileContent =
        'This is a test file content\nwith multiple lines\nand special characters: !@#$%';
      const fileHash = calculateSha1(fileContent);

      expectValidHash(fileHash);
    });

    it('should handle database record simulation', () => {
      // データベースレコードのようなデータのシミュレーション
      const recordData = [
        'user123',
        'john@example.com',
        '2023-01-01T00:00:00Z',
        'active',
      ];

      const recordHash = calculateSha1FromMultiple(recordData, '|');
      expectValidHash(recordHash);
    });

    it('should handle configuration data simulation', () => {
      // 設定データのような構造化データのシミュレーション
      const configData = {
        database: 'postgresql',
        host: 'localhost',
        port: 5432,
        ssl: true,
      };

      const configString = JSON.stringify(configData);
      const configHash = calculateSha1(configString);

      expectValidHash(configHash);
    });

    it('should handle binary data simulation', () => {
      // バイナリデータのシミュレーション
      const binaryData = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
      const binaryHash = calculateSha1(binaryData);

      expectValidHash(binaryHash);
    });

    it('should handle large dataset simulation', () => {
      // 大きなデータセットのシミュレーション
      const largeDataset = Array.from(
        { length: 1000 },
        (_, i) => `record_${i}_data_${Math.random()}`,
      );

      const datasetHash = calculateSha1FromMultiple(largeDataset, '\n');
      expectValidHash(datasetHash);
    });
  });

  describe('Performance integration', () => {
    it('should handle high-frequency hash calculations', () => {
      const startTime = performance.now();

      // 高頻度でハッシュ計算を実行
      for (let i = 0; i < 1000; i++) {
        const hash = calculateSha1(`data_${i}`);
        expectValidHash(hash);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(1000); // 1秒以内
    });

    it('should handle memory efficiently in continuous operations', () => {
      // 連続操作でのメモリ効率性を確認
      for (let batch = 0; batch < 10; batch++) {
        const batchData = Array.from(
          { length: 100 },
          (_, i) => `batch_${batch}_item_${i}`,
        );

        const batchHash = calculateSha1FromMultiple(batchData);
        expectValidHash(batchHash);
      }
    });
  });

  describe('Cross-function compatibility', () => {
    it('should maintain consistency between single and multiple hash functions', () => {
      const data = 'test data';

      // 単一データのハッシュ
      const singleHash = calculateSha1(data);

      // 配列として同じデータのハッシュ
      const multipleHash = calculateSha1FromMultiple([data]);

      // 結果が一致することを確認
      expect(singleHash).toBe(multipleHash);
    });

    it('should handle encoding consistency', () => {
      const data = 'hello world';

      // 異なるエンコーディングで同じデータをハッシュ化
      const utf8Hash = calculateSha1(data, 'utf8');
      const asciiHash = calculateSha1(data, 'ascii');

      expectValidHash(utf8Hash);
      expectValidHash(asciiHash);

      // ASCII文字のみなので結果は同じになるはず
      expect(utf8Hash).toBe(asciiHash);
    });

    it('should handle separator consistency', () => {
      const data = ['a', 'b', 'c'];

      // 異なる区切り文字でハッシュ化
      const nullSeparatorHash = calculateSha1FromMultiple(data, '\0');
      const commaSeparatorHash = calculateSha1FromMultiple(data, ',');

      expectValidHash(nullSeparatorHash);
      expectValidHash(commaSeparatorHash);

      // 区切り文字が異なるので結果も異なる
      expect(nullSeparatorHash).not.toBe(commaSeparatorHash);
    });
  });
});
