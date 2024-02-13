/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@wraft/eslint-config/library.js", "plugin:prettier/recommended"],
  rules: {
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true },
        "pathGroupsExcludedImportTypes": ["react"]
      }
    ]
  },
  project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
};
