/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/react.js"],
  project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
};
