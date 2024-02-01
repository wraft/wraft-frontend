/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@wraft/eslint-config/react.js"],
  project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
};
