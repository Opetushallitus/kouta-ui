import { useCallback } from 'react';

import { QueryObserverOptions, useQuery } from 'react-query';

import { useUrls, useHttpClient } from '#/src/contexts/contextHooks';

type ApiError = any;
type ApiResult = any;

export type KoutaApiQueryConfig = QueryObserverOptions<ApiResult, ApiError>;

export const useApiQuery = (
  key: string,
  apiFn: (any) => any,
  props: Record<string, any> = {},
  options: KoutaApiQueryConfig = {}
) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const queryFn = useCallback(() => apiFn({ httpClient, apiUrls, ...props }), [
    apiFn,
    httpClient,
    apiUrls,
    props,
  ]);
  return useQuery([key, props], queryFn, options);
};
