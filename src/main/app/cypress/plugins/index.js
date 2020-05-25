const fs = require('fs');
const wp = require('@cypress/webpack-preprocessor');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');
const alias = require('../../webpack-alias');

module.exports = (on, config) => {
  on('task', {
    readFileMaybe: filename =>
      fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : null,
  });
  on(
    'file:preprocessor',
    wp({
      webpackOptions: {
        resolve: {
          alias,
        },
      },
    })
  );
  initPlugin(on, config);
  return config;
};
