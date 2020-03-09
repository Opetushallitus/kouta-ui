import axios from 'axios';
import _ from 'lodash';
import fp from 'lodash/fp';
import { setupCache } from 'axios-cache-adapter';

let loggingInPromise = null;

const isKoutaBackendUrl = url => {
  return /kouta-backend/.test(url);
};

const isLomakeEditoriUrl = url => {
  return /lomake-editori/.test(url);
};

const oneHour = 3600000;

const cache = setupCache({
  limit: 100,
  maxAge: oneHour,
  invalidate: null, // Prevent cache invalidation
  exclude: {
    query: false,
    filter: config => {
      return isKoutaBackendUrl(config.url);
    },
  },
});

const hasBeenRetried = error => {
  return Boolean(_.get(error, 'config.__retried'));
};

const isAuthorizationError = error => {
  return _.get(error, 'response.status') === 401;
};

const withAuthorizationInterceptor = apiUrls => client => {
  client.interceptors.response.use(
    response => response,
    async error => {
      if (!isAuthorizationError(error)) {
        return Promise.reject(error);
      }

      if (hasBeenRetried(error)) {
        return Promise.reject(error);
      }

      error.config.__retried = true;

      const responseUrl = _.get(error, 'request.responseURL');

      if (isKoutaBackendUrl(responseUrl) && apiUrls) {
        try {
          if (!loggingInPromise) {
            // In test environments redirects to cas.login and returns HTML
            loggingInPromise = client.get(apiUrls.url('kouta-backend.login'), {
              cache: {
                ignoreCache: true,
              },
            });
          }
          await loggingInPromise;
          return client(error.config);
        } catch (e) {
          return Promise.reject(error);
        } finally {
          loggingInPromise = null;
        }
      }

      if (isLomakeEditoriUrl(responseUrl) && apiUrls) {
        try {
          await client.get(apiUrls.url('cas.login'), {
            cache: {
              ignoreCache: true,
            },
            params: {
              service: apiUrls.url('lomake-editori.cas'),
            },
          });

          return client(error.config);
        } catch (e) {
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

const getCookie = name =>
  fp.compose(
    fp.prop(name),
    fp.fromPairs,
    fp.map(keyVal => keyVal.split('=')),
    fp.split(';'),
  )(document.cookie);

const withCSRF = client => {
  client.interceptors.request.use(request => {
    const { method } = request;
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      const csrfCookie = getCookie('CSRF');
      if (csrfCookie) {
        request.headers.CSRF = csrfCookie;
      }
    }
    return request;
  });

  return client;
};

const createHttpClient = ({ apiUrls, callerId } = {}) => {
  let client = axios.create({
    withCredentials: true,
    adapter: cache.adapter,
    headers: {
      ...(callerId && {
        'Caller-Id': callerId,
      }),
    },
  });

  client = fp.compose(withCSRF, withAuthorizationInterceptor(apiUrls))(client);

  return client;
};

export default createHttpClient;
