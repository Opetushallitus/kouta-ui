const { compose } = require('lodash/fp');
const { withoutPlugins, withImportAlias } = require('../webpack-utils');

module.exports = {
  stories: ['../src/**/*.stories.[tj]s?(x)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-knobs/register',
  ],
  webpackFinal: compose(withoutPlugins(['ForkTsCheckerWebpackPlugin']), withImportAlias),
};
