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
    extends: ["@wraft/eslint-config/library.js"],
    plugins: ["@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: true,
    },
    ignorePatterns: ["turbo"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "tsdoc/syntax": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-namespace": "off",
      "import/no-default-export": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-shadow": "off",
    },
  }),
];
