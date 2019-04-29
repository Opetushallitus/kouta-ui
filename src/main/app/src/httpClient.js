import axios from 'axios';
import get from 'lodash/get';

const isKoutaBackendUrl = url => {
  return /kouta-backend/.test(url);
};

const isAuthorizationError = error => {
  return get(error, 'response.status') === 401;
};

const withAuthorizationInterceptor = client => {
  client.interceptors.response.use(
    response => response,
    error => {
      if (!isAuthorizationError(error)) {
        return Promise.reject(error);
      }

      const responseUrl = get(error, 'request.responseURL');

      if (isKoutaBackendUrl(responseUrl)) {
        // TODO: Redirect somewhere
      }

      return Promise.reject(error);
    },
  );

  return client;
};

const createHttpClient = () => {
  const client = axios.create({});

  withAuthorizationInterceptor(client);

  return client;
};

export default createHttpClient;
