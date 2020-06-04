const merge = require('lodash/merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const alias = require('../webpack-alias.js');

module.exports = {
  stories: ['../src/**/*.stories.[tj]s?(x)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-knobs/register',
  ],
  webpackFinal: async config => ({
    ...config,
    plugins: config.plugins.filter(
      plugin => !(plugin instanceof ForkTsCheckerWebpackPlugin)
    ),
    resolve: merge(config.resolve, {
      alias,
    }),
  }),
};
