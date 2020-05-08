const fs = require('fs');
const wp = require('@cypress/webpack-preprocessor');
const alias = require('../../webpack-alias');

module.exports = on => {
  on('task', {
    readFileMaybe(filename) {
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf8');
      }

      return null;
    },
  });
  on(
    'file:preprocessor',
    wp({
      webpackOptions: {
        resolve: {
          alias,
        },
      },
    }),
  );
};
