import { useCallback } from 'react';

import { ReactQueryQueriesConfig, useQuery } from 'react-query';

import { useUrls, useHttpClient } from '#/src/contexts/contextHooks';

type ApiError = any;
type ApiResult = any;

export type KoutaApiQueryConfig = ReactQueryQueriesConfig<ApiResult, ApiError>;

export const useApiQuery = (
  key: string,
  props: Record<string, any>,
  apiFn: (any) => any,
  options: KoutaApiQueryConfig = {}
) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const queryFn = useCallback(
    (key, props) => apiFn({ httpClient, apiUrls, ...props }),
    [apiFn, httpClient, apiUrls]
  );
  return useQuery([key, props], queryFn, options);
};
