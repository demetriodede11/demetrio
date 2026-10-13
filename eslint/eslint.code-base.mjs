import eslint from '@eslint/js';
import globals from 'globals';
import { config } from 'typescript-eslint';

import { codeFiles, tsFiles } from './files.mjs';

export default config(
  {
    name: 'base rules',
    extends: [eslint.configs.recommended],
    files: codeFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'object-shorthand': 'error',
      'no-console': ['error', { allow: ['error', 'warn'] }],
      'no-underscore-dangle': ['error', { allow: ['__typename'] }],
      'no-extra-boolean-cast': 'error',
      'no-else-return': 'error',
      'no-unneeded-ternary': 'error',
      'no-implicit-coercion': [
        'error',
        {
          boolean: true,
          number: true,
          string: true,
          allow: ['!!'],
        },
      ],
    },
  },
  {
    name: 'base ts rules',
    files: tsFiles,
    rules: {
      /* в TypeScript есть аналоги, можно отключить */
      'no-use-before-define': 'off',
      'no-magic-numbers': 'off',
      'no-useless-constructor': 'off',
      'no-unused-vars': 'off',
    },
  },
);
