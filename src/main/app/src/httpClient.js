import axios from 'axios';
import get from 'lodash/get';
import { setupCache } from 'axios-cache-adapter';

import { compose } from './utils';

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
  return Boolean(get(error, 'config.__retried'));
};

const isAuthorizationError = error => {
  return get(error, 'response.status') === 401;
};

const withAuthorizationInterceptor = (
  apiUrls,
  { redirectAfterForbidden = true },
) => client => {
  client.interceptors.response.use(
    response => response,
    async error => {
      if (!isAuthorizationError(error)) {
        return Promise.reject(error);
      }

      if (hasBeenRetried(error) && redirectAfterForbidden) {
        return window.location.replace(apiUrls.url('cas.login'));
      }

      error.config.__retried = true;

      const responseUrl = get(error, 'request.responseURL');

      if (isKoutaBackendUrl(responseUrl) && apiUrls) {
        try {
          await client.get(apiUrls.url('kouta-backend.login'), {
            cache: {
              ignoreCache: true,
            },
          });

          return client(error.config);
        } catch (e) {
          return Promise.reject(error);
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

const createHttpClient = ({
  apiUrls,
  callerId,
  redirectAfterForbidden = true,
} = {}) => {
  const headers = {};

  let client = axios.create({
    withCredentials: true,
    adapter: cache.adapter,
    headers: {
      ...headers,
      ...(callerId && {
        'Caller-Id': callerId,
      }),
    },
  });

  client = compose(
    withAuthorizationInterceptor(apiUrls, { redirectAfterForbidden }),
  )(client);

  return client;
};

export default createHttpClient;
