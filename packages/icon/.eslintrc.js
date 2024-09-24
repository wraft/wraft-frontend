/** @type {import("eslint").Linter.Config} */
module.exports = {
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
};
