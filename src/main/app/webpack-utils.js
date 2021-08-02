const { merge } = require('lodash/fp');

const alias = require('./webpack-alias');

module.exports = {
  withImportAlias: config => ({
    ...config,
    resolve: merge(config.resolve, {
      alias,
    }),
  }),
  withoutPlugins:
    (plugins = []) =>
    config => ({
      ...config,
      plugins: config.plugins.filter(
        plugin => !plugins.includes(plugin.constructor.name)
      ),
    }),
};
