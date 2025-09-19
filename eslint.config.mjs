import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default [
  { ignores: ['*.d.ts', '**/dist', '**/coverage'] },
  ...typescriptEslint.configs.recommended,
  ...typescriptEslint.configs.stylistic,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {},
  },
  {
    files: ['tests/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  eslintConfigPrettier,
];
