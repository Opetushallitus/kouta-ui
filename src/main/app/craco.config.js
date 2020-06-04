const { ESLINT_MODES } = require('@craco/craco');
const alias = require('./webpack-alias');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  eslint: {
    enable: isDev,
    mode: ESLINT_MODES.file,
  },
  babel: {
    plugins: [
      'lodash',
      [
        'styled-components',
        {
          pure: true,
        },
      ],
    ],
  },
  webpack: {
    alias,
  },
  typescript: {
    enableTypeChecking: isDev,
  },
};
