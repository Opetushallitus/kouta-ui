const _fp = require('lodash/fp');
const { withoutPlugins, withImportAlias } = require('../webpack-utils');
const webpack = require('webpack')

module.exports = {
  stories: ['../src/**/*.stories.[tj]s?(x)'],
  addons: [
    'storybook-preset-craco',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
  ],
  webpackFinal: _fp.flow(
    withoutPlugins(['ForkTsCheckerWebpackPlugin', 'ESLintWebpackPlugin']),
    withImportAlias,
    (config) => {
      config.plugins = config.plugins.map((plugin) => {
        if (plugin instanceof webpack.DefinePlugin) {
          plugin.definitions['process.env'] = JSON.stringify({NODE_ENV: 'development'});
        }
  
        return plugin;
      });
  
      return config;
    })
};
