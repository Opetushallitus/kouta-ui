const fs = require('fs');
const wp = require('@cypress/webpack-preprocessor');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');
const autoRecord = require('cypress-autorecord/plugin');
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
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                  options: {
                    transpileOnly: true,
                  },
                },
              ],
            },
          ],
        },
        resolve: {
          extensions: ['.ts', '.js'],
          alias,
        },
      },
    })
  );
  initPlugin(on, config);
  autoRecord(on, config, fs);
  return config;
};
