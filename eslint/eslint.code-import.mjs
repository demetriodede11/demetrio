import { fileURLToPath } from 'node:url';
import tsEslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

import { codeFiles, tsFiles } from './files.mjs';

export default tsEslint.config(
  {
    ...importPlugin.flatConfigs.recommended,
    files: codeFiles,
  },
  {
    name: 'import base rules',
    files: codeFiles,
    settings: {
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          mjs: 'always',
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: fileURLToPath(new URL('../tsconfig.json', import.meta.url)),
        },
      },
    },
    rules: {
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          mjs: 'always',
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'unknown'], 'internal', ['parent', 'sibling'], 'index'],
          pathGroups: [
            {
              pattern: '$*/**',
              group: 'internal',
            },
            {
              pattern: './*.css',
              group: 'index',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['./*.css'],
          warnOnUnassignedImports: true,
          'newlines-between': 'always',
        },
      ],
      'import/no-extraneous-dependencies': [
        'warn',
        {
          devDependencies: ['eslint/**/*', 'eslint.config.mjs', 'next.config.ts'],
        },
      ],
    },
  },
  {
    name: 'import ts rules',
    files: tsFiles,
    rules: {
      /* в TypeScript есть аналоги, можно отключить */
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
    },
  },
);
