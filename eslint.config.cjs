const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: ["apps/**", "packages/**", "eslint.config.cjs"],
  },
  ...compat.config({
    extends: ["@wraft/eslint-config/library.js"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: true,
    },
  }),
];
