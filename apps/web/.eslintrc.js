module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  // parserOptions: { ecmaVersion: 11 }, // to enable features such as async/await
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 11,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ["next/core-web-vitals", 'eslint:recommended'],
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
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        "@typescript-eslint/no-duplicate-enum-values": "off",
        "react-hooks/exhaustive-deps": "off",
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        "import/order": [
          "error",
          {
            "newlines-between": "always",
            "alphabetize": { "order": "asc", "caseInsensitive": true },
            "pathGroups": [
              {
                "pattern": "react",
                "group": "builtin",
                "position": "before"
              },
              {
                "pattern": "@wraft-ui/**",
                "group": "external",
              }
            ],
            "pathGroupsExcludedImportTypes": ["react"]
          }
        ]
      },
    },
  ],
};