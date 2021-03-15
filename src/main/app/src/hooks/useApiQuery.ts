import { useCallback } from 'react';

import { QueryObserverOptions, useQuery } from 'react-query';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';

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
