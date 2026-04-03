import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['build/**', 'coverage/**', 'docs/**', 'lib/**', 'node_modules/**', 'tmp/**'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,mts,cts}'],
  })),
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'linebreak-style': ['error', 'unix'],
      'no-else-return': ['error'],
      quotes: ['error', 'single'],
      'prefer-arrow-callback': ['error'],
      'prefer-const': ['error'],
      semi: ['error', 'always'],
    },
  },
  {
    files: ['**/*.test.ts', 'jest.config.ts', 'jest.setup.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
);
