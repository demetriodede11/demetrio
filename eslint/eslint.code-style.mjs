import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import tsEslint from 'typescript-eslint';

import { codeFiles, jsxFiles } from './files.mjs';

export default tsEslint.config(
  {
    name: 'unicorn rules',
    files: codeFiles,
    plugins: {
      unicorn,
    },
    rules: {
      'unicorn/no-unused-properties': 'warn',
      'unicorn/no-useless-spread': 'warn',
      'unicorn/no-useless-fallback-in-spread': 'warn',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/prefer-includes': 'warn',
      'unicorn/prefer-export-from': 'warn',
      'unicorn/prefer-math-min-max': 'warn',
      'unicorn/prefer-regexp-test': 'warn',
      'unicorn/prefer-single-call': 'warn',
      'unicorn/prefer-switch': 'warn',
      'unicorn/prefer-ternary': 'warn',
      'unicorn/template-indent': 'warn',
    },
  },
  {
    name: 'prettier rules',
    extends: [prettier],
    files: codeFiles,
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'error',
    },
  },
  {
    name: 'stylistic rules',
    files: codeFiles,
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'return',
            'multiline-block-like',
            'multiline-const',
            'multiline-let',
            'multiline-expression',
          ],
        },
        {
          blankLine: 'always',
          prev: [
            'multiline-block-like',
            'multiline-const',
            'multiline-let',
            'multiline-expression',
          ],
          next: '*',
        },
        {
          // https://github.com/eslint/eslint/issues/11178
          blankLine: 'any',
          prev: 'case',
          next: 'case',
        },
      ],
    },
  },
  {
    name: 'stylistic jsx rules',
    files: jsxFiles,
    rules: {
      '@stylistic/jsx-sort-props': [
        'error',
        {
          reservedFirst: true,
          callbacksLast: true,
          shorthandLast: true,
          noSortAlphabetically: true,
        },
      ],
      '@stylistic/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'ignore', propElementValues: 'always' },
      ],
    },
  },
);
