import axios from 'axios';
import _ from 'lodash';

import { getCookie } from '#/src/utils';

let loggingInPromise = null;

const isKoutaBackendUrl = url => {
  return /kouta-backend/.test(url);
};

const isLomakeEditoriUrl = url => {
  return /lomake-editori/.test(url);
};

const hasBeenRetried = error => {
  return Boolean(error?.config?.__retried);
};

const isAuthorizationError = error => {
  return error?.response?.status === 401;
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

      const responseUrl = error?.request?.responseURL;

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
    }
  );

  return client;
};

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

const createHttpClient = ({ apiUrls, callerId }) => {
  let client = axios.create({
    withCredentials: true,
    headers: {
      ...(callerId && {
        'Caller-Id': callerId,
      }),
    },
  });

  return _.flow(withCSRF, withAuthorizationInterceptor(apiUrls))(client);
};

export default createHttpClient;
