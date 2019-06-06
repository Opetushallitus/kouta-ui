import axios from 'axios';
import get from 'lodash/get';
import { setupCache } from 'axios-cache-adapter';

import { compose } from './utils';

const isKoutaBackendUrl = url => {
  return /kouta-backend/.test(url);
};

const isKoutaIndexUrl = url => {
  return /kouta-index/.test(url);
};

const isLomakeEditoriUrl = url => {
  return /lomake-editori/.test(url);
};

const threeHours = 10800000;

const cache = setupCache({
  limit: 200,
  maxAge: threeHours,
  exclude: {
    query: false,
    filter: config => {
      return isKoutaBackendUrl(config.url) || isKoutaIndexUrl(config.url);
    },
  },
});

const hasBeenRetried = error => {
  return Boolean(get(error, 'config.__retried'));
};

const isAuthorizationError = error => {
  return [401].includes(get(error, 'response.status'));
};

const withAuthorizationInterceptor = apiUrls => client => {
  client.interceptors.response.use(
    response => response,
    async error => {
      if (!isAuthorizationError(error)) {
        return Promise.reject(error);
      }

      if (hasBeenRetried(error)) {
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

const createHttpClient = ({ apiUrls, callerId } = {}) => {
  let client = axios.create({
    withCredentials: true,
    adapter: cache.adapter,
    ...(callerId && {
      headers: {
        'Caller-Id': callerId,
      },
    }),
  });

  client = compose(withAuthorizationInterceptor(apiUrls))(client);

  return client;
};

export default createHttpClient;
