import { AxiosInstance } from 'axios';
import _ from 'lodash';
import { queryCache } from 'react-query';

import { ENTITY } from '#/src/constants';
import { useApiQuery, KoutaApiQueryConfig } from '#/src/hooks/useApiQuery';

type GetEntityTypeByOidProps = {
  entityType: ENTITY;
  oid: string;
  httpClient: AxiosInstance;
  apiUrls: any;
};

// NOTE: SORA-kuvaus and valintaperuste use "id" instead of "oid", but this works for them as well.
export const getEntityByOid = async ({
  entityType,
  oid,
  httpClient,
  apiUrls,
}: GetEntityTypeByOidProps) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url(`kouta-backend.${entityType}-by-oid`, oid)
  );

  const lastModified = _.get(headers, 'x-last-modified') || null;

  return _.isObject(data) ? { lastModified, ...data } : data;
};

export const useEntityByOid = (
  entityType: ENTITY,
  oid?: string | null,
  options: KoutaApiQueryConfig = {}
) =>
  useApiQuery(entityType, { entityType, oid }, getEntityByOid, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: oid,
    ...options,
  });

export const invalidateEntityQueryByOid = (entityType, oid) => {
  queryCache.invalidateQueries(oid ? [entityType, { oid }] : entityType);
};
