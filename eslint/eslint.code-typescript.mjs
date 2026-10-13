import { fileURLToPath } from 'node:url';
import tsEslint from 'typescript-eslint';

import { tsFiles } from './files.mjs';

export default tsEslint.config(
  {
    name: 'typescript base rules',
    files: tsFiles,
    extends: [tsEslint.configs.recommendedTypeChecked, tsEslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: fileURLToPath(new URL('..', import.meta.url)),
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, classes: true, variables: false },
      ],

      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-empty-object-type': ['error', { allowObjectTypes: 'always' }],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
      ],
    },
  },
  {
    name: 'typescript disabled rules',
    files: [tsFiles],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
    },
  },
);
