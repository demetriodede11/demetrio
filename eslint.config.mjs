import nextPlugin from '@next/eslint-plugin-next';
import { globalIgnores } from 'eslint/config';
import tsEslint from 'typescript-eslint';

import codeBaseRules from './eslint/eslint.code-base.mjs';
import codeImportRules from './eslint/eslint.code-import.mjs';
import codeStyleRules from './eslint/eslint.code-style.mjs';
import codeTypescriptRules from './eslint/eslint.code-typescript.mjs';
import codeJavascriptRules from './eslint/eslint.code-javascript.mjs';
import codeReactRules from './eslint/eslint.code-react.mjs';
import { codeFiles, tsFiles } from './eslint/files.mjs';

const isInIDE = !process.env.LINT_TYPE;

const eslintConfig = tsEslint.config(
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
    '**/.env',
    '**/.env.*',
    '**/.idea/**',
    '**/.vscode/**',
  ]),
  ...codeBaseRules,
  ...codeImportRules,
  ...codeStyleRules,
  ...codeTypescriptRules,
  ...codeJavascriptRules,
  ...codeReactRules,
  {
    name: 'Next.js rules',
    files: codeFiles,
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  ...(isInIDE
    ? [
        {
          name: 'unused arguments in IDE',
          files: tsFiles,
          rules: {
            '@typescript-eslint/no-unused-vars': [
              'error',
              {
                vars: 'all',
                args: 'all',
                argsIgnorePattern: '^_',
              },
            ],
          },
        },
      ]
    : []),
);

export default eslintConfig;
