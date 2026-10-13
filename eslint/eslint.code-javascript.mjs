import tsEslint from 'typescript-eslint';

import { jsFiles } from './files.mjs';

export default tsEslint.config({
  name: 'javascript base rules',
  files: jsFiles,
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});
