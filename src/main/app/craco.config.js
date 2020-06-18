const { ESLINT_MODES } = require('@craco/craco');
const alias = require('./webpack-alias');
const isDev = process.env.NODE_ENV === 'development';

const deletePlugins = (plugins = []) => config => ({
  ...config,
  plugins: config.plugins.filter(
    plugin => !plugins.includes(plugin.constructor.name)
  ),
});

module.exports = {
  eslint: {
    enable: isDev,
    mode: ESLINT_MODES.file,
  },
  babel: {
    plugins: [
      'lodash',
      ['styled-components', { displayName: isDev, pure: true }],
    ],
  },
  webpack: {
    alias,
    configure: deletePlugins(['GenerateSW']),
  },
  typescript: {
    enableTypeChecking: isDev,
  },
};
