module.exports = {
  parserOptions: {
    ecmaVersion:6,
    sourceType: 'module',
  },
  env: {
    node: false,
    browser: true,
    es6:true
  },
  globals: {
    ME_SETTINGS: true,
  },
};
