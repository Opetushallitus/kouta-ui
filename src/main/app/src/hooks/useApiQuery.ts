import { useCallback, useMemo } from 'react';

import { QueryObserverOptions, useQueries, useQuery } from 'react-query';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';

type ApiError = any;
type ApiResult = any;

export type KoutaApiQueryConfig = QueryObserverOptions<ApiResult, ApiError>;

export const useApiQuery = <E>(
  key: string,
  apiFn: (any) => any,
  props: Record<string, any> = {},
  options: KoutaApiQueryConfig = {}
) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const queryFn = useCallback(
    () => apiFn({ httpClient, apiUrls, ...props }),
    [apiFn, httpClient, apiUrls, props]
  );
  return useQuery<E>([key, props], queryFn, options);
};

type QuerySpec = {
  key: string;
  queryFn: (...params: any) => any;
  props?: Record<string, any>;
  options?: KoutaApiQueryConfig;
};

type QuerySpecs = Array<QuerySpec>;

export const useApiQueries = (koutaQuerySpecs: QuerySpecs) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const querySpecs = useMemo(
    () =>
      koutaQuerySpecs.map(({ key, queryFn, props = {}, options = {} }) => ({
        queryKey: [key, props],
        queryFn: () => queryFn({ httpClient, apiUrls, ...props }),
        ...options,
      })),
    [koutaQuerySpecs, apiUrls, httpClient]
  );

  return useQueries(querySpecs);
};
