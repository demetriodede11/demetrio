import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from '@eslint-react/eslint-plugin';
import tsEslint from 'typescript-eslint';

import { codeFiles, jsFiles, tsFiles } from './files.mjs';

export default tsEslint.config(
  {
    name: 'react base rules',
    files: codeFiles,
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    extends: [react.configs.recommended],
    rules: {
      /** React */
      '@eslint-react/no-useless-fragment': 'error',
      '@eslint-react/no-complex-conditional-rendering': 'error',
      '@eslint-react/no-useless-forward-ref': 'error',
      '@eslint-react/hooks-extra/no-unnecessary-use-callback': 'error',
      '@eslint-react/hooks-extra/no-unnecessary-use-memo': 'error',

      /** React-hooks */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': ['warn', { additionalHooks: '(useEffectOnUpdate)' }],

      /** Jsx-a11y */
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    },
  },
  {
    name: 'react ts rules',
    files: tsFiles,
    extends: [react.configs['recommended-type-checked']],
  },
  {
    name: 'react js rules',
    files: jsFiles,
    rules: {
      '@eslint-react/no-prop-types': 'off',
      '@eslint-react/no-default-props': 'off',
    },
  },
  {
    name: 'react disabled rules',
    files: codeFiles,
    rules: {
      '@eslint-react/no-nested-component-definitions': 'off',
      '@eslint-react/dom/no-flush-sync': 'off',
      '@eslint-react/no-unstable-default-props': 'off',
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
    },
  },
);
