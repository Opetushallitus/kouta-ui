const _ = require('lodash');

const alias = require('./webpack-alias');

module.exports = {
  withImportAlias: config => ({
    ...config,
    resolve: _.merge(config.resolve, {
      alias,
    }),
  }),
  withoutPlugins: (plugins = []) => config => ({
    ...config,
    plugins: config.plugins.filter(
      plugin => !plugins.includes(plugin.constructor.name)
    ),
  }),
};
