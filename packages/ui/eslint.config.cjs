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
    plugins: ["prettier", "@typescript-eslint", "import"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          vars: "all",
          args: "none",
          varsIgnorePattern: "^_",
        },
      ],
      "no-redeclare": ["error", { builtinGlobals: false }],
      "no-unused-vars": "off",
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
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
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
  }),
];
