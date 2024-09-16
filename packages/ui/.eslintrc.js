module.exports = {
  root: true,
  extends: [
    '@wraft/eslint-config/library.js',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    'node_modules',
    '.turbo',
    'dist',
    'types',
    '.eslintrc.js',
    '**/*.test.tsx',
    'jest.config.js',
    'babel.config.js',
  ],
  plugins: ['prettier', '@typescript-eslint/eslint-plugin', 'import'],
  rules: {
    'import/no-default-export': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          pascalCase: true,
          camelCase: true,
        },
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        parser: 'flow',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'function',
        modifiers: ['exported'],
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['StrictPascalCase'],
      },
    ],
  },
};
