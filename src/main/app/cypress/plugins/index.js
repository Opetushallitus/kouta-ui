const fs = require('fs');
const wp = require('@cypress/webpack-preprocessor');
const alias = require('../../webpack-alias');

module.exports = on => {
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
};
