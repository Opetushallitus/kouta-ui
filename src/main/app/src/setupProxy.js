// This file is used by react-scripts to customize webpack-dev-server proxy
// https://create-react-app.dev/docs/proxying-api-requests-in-development
const { createProxyMiddleware } = require('http-proxy-middleware');

const {
  DEV_VIRKAILIJA_URL,
  REACT_APP_DEV_SERVER_URL,
  DISABLE_LOCAL_PROXY,
} = process.env;

const devProxyMiddleware = createProxyMiddleware({
  autoRewrite: true,
  headers: {
    'Access-Control-Allow-Origin': DEV_VIRKAILIJA_URL,
  },
  changeOrigin: true,
  cookieDomainRewrite: REACT_APP_DEV_SERVER_URL,
  secure: false,
  target: DEV_VIRKAILIJA_URL,
});

module.exports = function (app) {
  if (!DISABLE_LOCAL_PROXY) {
    app.use('*', function (req, res, next) {
      return ['/', '/kouta'].includes(req.originalUrl) ||
        req.originalUrl.startsWith('/kouta/')
        ? next()
        : devProxyMiddleware(req, res, next);
    });
  }
};
