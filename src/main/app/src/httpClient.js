import axios from 'axios';
import get from 'lodash/get';

import { compose } from './utils';

const isKoutaBackendUrl = url => {
  return /kouta-backend/.test(url);
};

const isLomakeEditoriUrl = url => {
  return /lomake-editori/.test(url);
};

const hasBeenRetried = error => {
  return Boolean(get(error, 'config.__retried'));
};

const isAuthorizationError = error => {
  return [401, 403].includes(get(error, 'response.status'));
};

const withAuthorizationInterceptor = apiUrls => client => {
  client.interceptors.response.use(
    response => response,
    async error => {
      if (!isAuthorizationError(error) || hasBeenRetried(error)) {
        return Promise.reject(error);
      }

      error.config.__retried = true;

      const responseUrl = get(error, 'request.responseURL');

      if (isKoutaBackendUrl(responseUrl) && apiUrls) {
        try {
          await client.get(apiUrls.url('kouta-backend.login'));

          return client.get(error.config);
        } catch (e) {
          return Promise.reject(error);
        }
      }

      if (isLomakeEditoriUrl(responseUrl) && apiUrls) {
        try {
          await client.get(apiUrls.url('cas.login'), {
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

const createHttpClient = ({ apiUrls } = {}) => {
  let client = axios.create({
    withCredentials: true,
  });

  client = compose(withAuthorizationInterceptor(apiUrls))(client);

  return client;
};

export default createHttpClient;
