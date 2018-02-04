module.exports = {
  extends: 'airbnb-base',
  env: {
    es6: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: false,
  },
  rules: {
    'no-underscore-dangle': 0,
  },
};
