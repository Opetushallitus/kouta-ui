import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useUrls, useHttpClient } from '#/src/contexts/contextHooks';

export const useApiQuery = (key, props, apiFn, options) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const queryFn = useCallback(
    (key, props) => apiFn({ httpClient, apiUrls, ...props }),
    [apiFn, httpClient, apiUrls]
  );
  return useQuery([key, props], queryFn, options);
};
