import { useAsync } from 'react-async';

import { isDev } from '#/src/utils';
import { useUrls, useHttpClient } from '#/src/contexts/contextHooks';

export const useApiAsync = (asyncArgs = {}) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const result = useAsync({ httpClient, apiUrls, ...asyncArgs });
  isDev && result.error && console.error(result.error);
  return result;
};

export default useApiAsync;
