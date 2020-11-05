// This file is used by react-scripts to customize webpack-dev-server proxy
// https://create-react-app.dev/docs/proxying-api-requests-in-development
const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  DEV_VIRKAILIJA_URL,
  DISABLE_LOCAL_PROXY,
  KOUTA_BACKEND_URL,
} = process.env;

const createKoutaProxyMiddleware = targetUrl =>
  createProxyMiddleware({
    autoRewrite: true,
    headers: {
      'Access-Control-Allow-Origin': targetUrl,
    },
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
    secure: false,
    target: targetUrl,
  });

const devProxyMiddleware = createKoutaProxyMiddleware(DEV_VIRKAILIJA_URL);

const koutaBackendProxyMiddleware =
  KOUTA_BACKEND_URL && createKoutaProxyMiddleware(KOUTA_BACKEND_URL);

module.exports = function (app) {
  app.use('*', function (req, res, next) {
    if (
      ['/', '/kouta'].includes(req.originalUrl) ||
      req.originalUrl.startsWith('/kouta/')
    ) {
      next();
    } else {
      if (DISABLE_LOCAL_PROXY) {
        res.sendStatus(404);
      } else if (
        KOUTA_BACKEND_URL &&
        req.originalUrl.startsWith('/kouta-backend')
      ) {
        koutaBackendProxyMiddleware(req, res, next);
      } else {
        devProxyMiddleware(req, res, next);
      }
    }
  });
};
