module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'preact',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  ignorePatterns: [
    'build/',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    'import/no-unresolved': [
      'error',
      {
        ignore: ['/style$'],
      },
    ],
    'import/extensions': [
      'error',
      'never',
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'preact.config.js',
        ],
      },
    ],
  },
};
