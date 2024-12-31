/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@wraft/eslint-config/react-internal.js"],
  plugins: ["prettier", "@typescript-eslint", "import"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "no-redeclare": ["error", { builtinGlobals: false }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        vars: "all",
        args: "none",
        varsIgnorePattern: "^_",
      },
    ],
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc" },
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "function",
        modifiers: ["exported"],
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["StrictPascalCase"],
      },
    ],
  },
};
