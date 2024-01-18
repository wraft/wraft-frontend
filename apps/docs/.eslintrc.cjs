/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@wraft/eslint-config/storybook.js"],
  project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
};
