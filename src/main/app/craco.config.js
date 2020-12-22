const _ = require('lodash/fp');
const { ESLINT_MODES } = require('@craco/craco');
const alias = require('./webpack-alias');
const { withoutPlugins } = require('./webpack-utils');

const { CI, NODE_ENV } = process.env;

const isDev = NODE_ENV === 'development';

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
    configure: _.pipe(
      config => ({
        ...config,
        ...(CI
          ? {
              devServer: {
                hot: false,
                inline: false,
                liveReload: false,
                proxy: false,
              },
            }
          : {}),
      }),
      withoutPlugins(['ManifestPlugin'])
    ),
  },
  typescript: {
    enableTypeChecking: false,
  },
};
