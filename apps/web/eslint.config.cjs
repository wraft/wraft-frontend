const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  { ignores: ["eslint.config.cjs", ".eslintrc.js", ".eslintrc.cjs"] },
  ...compat.config({
    root: true,
    env: {
      node: true,
      es6: true,
    },
    parserOptions: {
      project: "tsconfig.json",
      sourceType: "module",
      ecmaVersion: 11,
      ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true,
      },
    },
    ignorePatterns: ["node_modules/*", ".next/*", ".out/*", "!.prettierrc.js"],
    extends: ["next/core-web-vitals", "eslint:recommended"],
    overrides: [
      {
        files: ["next-env.d.ts"],
        rules: {
          "@typescript-eslint/triple-slash-reference": "off",
        },
      },
      {
        files: ["**/*.ts", "**/*.tsx"],
        parser: "@typescript-eslint/parser",
        settings: { react: { version: "detect" } },
        env: {
          browser: true,
          node: true,
          es6: true,
        },
        extends: [
          "eslint:recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:react/recommended",
          "plugin:jsx-a11y/recommended",
          "plugin:prettier/recommended",
        ],
        rules: {
          "no-shadow": "off",
          "@typescript-eslint/no-shadow": "warn",
          "react/prop-types": "off",
          "react/react-in-jsx-scope": "off",
          "jsx-a11y/anchor-is-valid": "off",
          "@typescript-eslint/no-unused-vars": [
            "warn",
            {
              argsIgnorePattern: "^_",
              vars: "all",
              args: "none",
              varsIgnorePattern: "^_",
            },
          ],
          "@typescript-eslint/explicit-function-return-type": "off",
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-unused-expressions": "off",
          "@typescript-eslint/no-empty-object-type": "off",
          "@typescript-eslint/triple-slash-reference": "off",
          "@typescript-eslint/no-duplicate-enum-values": "off",
          "react-hooks/exhaustive-deps": "off",
          "prettier/prettier": ["error", {}, { usePrettierrc: true }],
          "import/order": [
            "error",
            {
              groups: ["builtin", "external", "internal"],
              pathGroups: [
                {
                  pattern: "react",
                  group: "external",
                  position: "before",
                },
                {
                  pattern: "next/**",
                  group: "external",
                  position: "before",
                },
                {
                  pattern: "@wraft-ui/**",
                  group: "external",
                },
                {
                  pattern: "components/**",
                  group: "internal",
                  position: "after",
                },
                {
                  pattern: "@hooks/**",
                  group: "internal",
                  position: "after",
                },
                {
                  pattern: "@constants/**",
                  group: "internal",
                  position: "before",
                },
                {
                  pattern: "common/**",
                  group: "internal",
                  position: "after",
                },
                {
                  pattern: "contexts/**",
                  group: "internal",
                  position: "after",
                },
                {
                  pattern: "schemas/**",
                  group: "internal",
                  position: "after",
                },
                {
                  pattern: "utils",
                  group: "internal",
                  position: "after",
                },
                {
                  pattern: "utils/**",
                  group: "internal",
                  position: "after",
                },
                {
                  pattern: "store/**",
                  group: "internal",
                  position: "after",
                },
                {
                  pattern: "middleware/**",
                  group: "internal",
                  position: "after",
                },
              ],
              pathGroupsExcludedImportTypes: ["builtin"],
              "newlines-between": "always",
              distinctGroup: false,
            },
          ],
        },
      },
    ],
  }),
];
