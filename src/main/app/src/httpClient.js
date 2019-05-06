import axios from 'axios';
import get from 'lodash/get';

const isKoutaBackendUrl = url => {
  return /kouta-backend/.test(url);
};

const isAuthorizationError = error => {
  return [401, 403].includes(get(error, 'response.status'));
};

const withAuthorizationInterceptor = apiUrls => client => {
  client.interceptors.response.use(
    response => response,
    error => {
      if (!isAuthorizationError(error)) {
        return Promise.reject(error);
      }

      const responseUrl = get(error, 'request.responseURL');

      if (isKoutaBackendUrl(responseUrl) && apiUrls) {
        window.location.reload();
      }

      return Promise.reject(error);
    },
  );

  return client;
};

const createHttpClient = ({ apiUrls } = {}) => {
  const client = axios.create({
    withCredentials: true,
  });

  withAuthorizationInterceptor(apiUrls)(client);

  return client;
};

export default createHttpClient;
