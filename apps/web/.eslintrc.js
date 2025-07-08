module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 11,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: { react: { version: 'detect' } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended', // Accessibility rules
        'plugin:prettier/recommended', // Prettier plugin
      ],
      rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            vars: 'all',
            args: 'none',
            varsIgnorePattern: '^_',
          },
        ],
        // "no-unused-vars": ["error", {
        //     "vars": "all",
        //     "args": "after-used",
        //     "caughtErrors": "all",
        //     "ignoreRestSiblings": false,
        //     "reportUsedIgnorePattern": false
        // }],
        // '@typescript-eslint/no-unused-vars': 'off',
        // // '@typescript-eslint/no-unused-vars': ['warn', {
        // //   varsIgnorePattern: '[iI]gnored|createElement',
        // // }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-duplicate-enum-values': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'turbo/no-undeclared-env-vars': 'off',
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external','internal'],
            // "alphabetize": { "order": "asc", "caseInsensitive": true },
            pathGroups: [
              {
                pattern: 'react',
                group: 'external',
                position: 'before',
              },
              {
                pattern: 'next/**',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '@wraft-ui/**',
                group: 'external',
              },
          
              {
                pattern: 'components/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@hooks/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@constants/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: 'common/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: 'contexts/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: 'schemas/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: 'utils',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: 'utils/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: 'store/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: 'middleware/**',
                group: 'internal',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
            'newlines-between': 'always',
            distinctGroup: false,
            // pathGroupsExcludedImportTypes: ["react", "next", "next/*"],
          },
        ],
      },
    },
  ],
};
