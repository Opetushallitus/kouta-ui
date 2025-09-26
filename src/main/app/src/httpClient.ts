import axios, { AxiosError, AxiosInstance } from 'axios';
import { flow } from 'lodash';

import { getCookie } from '#/src/utils';

import { ApiUrls } from './urls';

let loggingInPromise: Promise<void> | null = null;

const isKoutaBackendUrl = (url: string) => {
  return /kouta-backend/.test(url);
};

const isLomakeEditoriUrl = (url: string) => {
  return /lomake-editori/.test(url);
};

const hasBeenRetried = (error: { config: { __retried?: boolean } }) => {
  return Boolean(error?.config?.__retried);
};

const isAuthorizationError = (error: AxiosError) => {
  return error?.response?.status === 401;
};

const withAuthorizationInterceptor =
  (apiUrls: ApiUrls) => (client: AxiosInstance) => {
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
              loggingInPromise = client.get(
                apiUrls.url('kouta-backend.login'),
                {
                  headers: {
                    'Cache-Control': 'no-cache',
                  },
                }
              );
            }
            await loggingInPromise;
            return client(error.config);
          } catch {
            return Promise.reject(error);
          } finally {
            loggingInPromise = null;
          }
        }

        if (isLomakeEditoriUrl(responseUrl) && apiUrls) {
          try {
            await client.get(apiUrls.url('cas.login'), {
              headers: {
                'Cache-Control': 'no-cache',
              },
              params: {
                service: apiUrls.url('lomake-editori.cas'),
              },
            });

            return client(error.config);
          } catch {
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return client;
  };

const withCSRF = (client: AxiosInstance) => {
  client.interceptors.request.use(request => {
    const { method } = request;
    if (['post', 'put', 'patch', 'delete'].includes(method ?? '')) {
      const csrfCookie = getCookie('CSRF');
      if (csrfCookie) {
        request.headers.CSRF = csrfCookie;
      }
    }
    return request;
  });

  return client;
};

const createHttpClient = ({
  apiUrls,
  callerId,
}: {
  apiUrls: ApiUrls;
  callerId: string;
}) => {
  const client = axios.create({
    withCredentials: true,
    headers: {
      ...(callerId && {
        'Caller-Id': callerId,
      }),
    },
  });

  return flow(withCSRF, withAuthorizationInterceptor(apiUrls))(client);
};

export default createHttpClient;

export type HttpClient = ReturnType<typeof createHttpClient>;
