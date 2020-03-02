const path = require('path');
const {
  override,
  disableEsLint,
  useBabelRc,
  addWebpackAlias,
} = require('customize-cra');

module.exports = override(
  disableEsLint(),
  useBabelRc(),
  addWebpackAlias({
    '#': path.resolve(__dirname),
  }),
);
