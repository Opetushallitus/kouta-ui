const _fp = require('lodash/fp');
const { withoutPlugins, withImportAlias } = require('../webpack-utils');

module.exports = {
  stories: ['../src/**/*.stories.[tj]s?(x)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-essentials',
    '@storybook/addon-links/preset',
  ],
  webpackFinal: _fp.flow(
    withoutPlugins(['ForkTsCheckerWebpackPlugin']),
    withImportAlias
  ),
};
