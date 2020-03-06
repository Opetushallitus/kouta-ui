const alias = require('./webpack-alias');
const isDev = process.env.NODE_ENV === 'development';

const {
  override,
  disableEsLint,
  useBabelRc,
  addWebpackAlias,
} = require('customize-cra');

module.exports = override(
  !isDev && disableEsLint(),
  useBabelRc(),
  addWebpackAlias(alias),
);
