import { useCallback, useMemo } from 'react';

import {
  useQueries,
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from 'react-query';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';

// Helper types for extracting API function parameter and return types
type ExtractApiProps<T> = T extends (params: infer P) => any
  ? {
      [K in keyof Omit<P, 'httpClient' | 'apiUrls'>]?:
        | Omit<P, 'httpClient' | 'apiUrls'>[K]
        | null;
    }
  : Record<string, any>;

type ExtractApiData<T> = T extends (...args: Array<any>) => Promise<infer D>
  ? D
  : unknown;

// Backward compatible type alias
export type KoutaApiQueryConfig<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey' | 'queryFn'>;

export const useApiQuery = <
  TApiFn extends (params: any) => Promise<any>,
  TQueryFnData = ExtractApiData<TApiFn>,
  TError = unknown,
  TData = TQueryFnData,
>(
  key: string,
  apiFn: TApiFn,
  props?: ExtractApiProps<TApiFn>,
  options?: KoutaApiQueryConfig<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError> => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const queryFn = useCallback(
    () => apiFn({ httpClient, apiUrls, ...props } as Parameters<TApiFn>[0]),
    [apiFn, httpClient, apiUrls, props]
  );

  return useQuery<TQueryFnData, TError, TData>([key, props], queryFn, options);
};

type QuerySpec<
  TApiFn extends (params: any) => Promise<any> = any,
  TQueryFnData = ExtractApiData<TApiFn>,
  TError = unknown,
  TData = TQueryFnData,
> = {
  key: string;
  queryFn: TApiFn;
  props?: ExtractApiProps<TApiFn>;
  options?: KoutaApiQueryConfig<TQueryFnData, TError, TData>;
};

export const useApiQueries = <
  T extends ReadonlyArray<QuerySpec<any, any, any>>,
>(
  koutaQuerySpecs: readonly [...T]
) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const querySpecs = useMemo(
    () =>
      koutaQuerySpecs.map(({ key, queryFn, props, options = {} }) => ({
        queryKey: [key, props],
        queryFn: () =>
          queryFn({
            httpClient,
            apiUrls,
            ...(props as Record<string, any>),
          } as any),
        ...options,
      })),
    [koutaQuerySpecs, apiUrls, httpClient]
  );

  return useQueries(querySpecs);
};
