const { whenDev, ESLINT_MODES } = require('@craco/craco');
const alias = require('./webpack-alias');

module.exports = {
  eslint: {
    enable: whenDev(() => true),
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
    enableTypeChecking: false,
  },
};
