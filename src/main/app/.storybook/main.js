const merge = require('lodash/merge');
const alias = require('../webpack-alias');

module.exports = {
  webpackFinal: async config =>
    merge(config, {
      resolve: {
        alias,
      },
    }),
};
