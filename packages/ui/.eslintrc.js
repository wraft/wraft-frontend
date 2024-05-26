module.exports = {
  extends: ["@wraft/eslint-config/library.js", 'plugin:@typescript-eslint/recommended'],
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
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  rules: {
    "import/no-default-export": "off",
    "@typescript-eslint/no-explicit-any": "off",
    '@typescript-eslint/explicit-function-return-type': 'off',
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    '@typescript-eslint/no-unsafe-member-access': "off",
    '@typescript-eslint/no-unsafe-assignment': "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "import/order": [
      "error",
      {
        "groups": [["builtin", "external"], "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc" }
      }
    ],
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "parser": "flow"
      }
    ],
    // "import/order": [
    //   "warn",
    //   {
    //     pathGroups: [
    //       {
    //         pattern: "@factor/**",
    //         group: "internal",
    //         position: "before",
    //       },
    //     ],
    //   },
    // ],
    
    
    // '@typescript-eslint/interface-name-prefix': 'off',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    // 'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    // '@typescript-eslint/interface-name-prefix': 'off',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    // "@typescript-eslint/no-unsafe-call": 'off',
    // "import/prefer-default-export": "off" 
  },
};
