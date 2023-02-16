import { AxiosInstance } from 'axios';
import _ from 'lodash';

import { ENTITY } from '#/src/constants';
import { useApiQuery, KoutaApiQueryConfig } from '#/src/hooks/useApiQuery';

type GetEntityTypeByOidProps = {
  entityType: ENTITY;
  oid: string;
  httpClient: AxiosInstance;
  apiUrls: any;
  silent?: boolean;
};

// NOTE: SORA-kuvaus and valintaperuste use "id" instead of "oid", but this works for them as well.
export const getEntityByOid = async ({
  entityType,
  oid,
  httpClient,
  apiUrls,
  silent = false,
}: GetEntityTypeByOidProps) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url(`kouta-backend.${entityType}-by-oid`, oid),
    {
      errorNotifier: {
        silent,
      },
    } as any
  );

  const lastModified = _.get(headers, 'x-last-modified') || null;

  return _.isObject(data) ? { lastModified, ...data } : data;
};

export const useEntityByOid = <E>(
  entityType: ENTITY,
  props?: { oid?: string | null; silent?: boolean },
  options: KoutaApiQueryConfig = {}
) =>
  useApiQuery<E>(
    entityType,
    getEntityByOid,
    { entityType, ...props },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: Boolean(props?.oid),
      ...options,
    }
  );
