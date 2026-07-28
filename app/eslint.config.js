// ESLint flat config. Written by hand rather than via `expo lint`'s auto-setup, which
// requires network access that is unavailable in some CI/sandbox environments.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
];
