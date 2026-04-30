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
    extends: ["@wraft/eslint-config/react-internal.js"],
    plugins: ["@typescript-eslint", "import"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    ignorePatterns: ["svgr-index-template.js", "svgr-template.js"],
    rules: {
      "no-redeclare": ["error", { builtinGlobals: false }],
    },
  }),
];
