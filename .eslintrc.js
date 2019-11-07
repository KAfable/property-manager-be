module.exports = {
  extends: ["plugin:prettier/recommended"],
  plugins: ["jest"],
  env: {
    node: true,
    commonjs: true,
    es6: true,
    "jest": true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {}
};
