import { useAsync } from 'react-async';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { isDev } from '#/src/utils';

export const useApiAsync = (asyncArgs = {}) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const result = useAsync({ httpClient, apiUrls, ...asyncArgs });
  isDev && result.error && console.error(result.error);
  return result;
};

export default useApiAsync;
