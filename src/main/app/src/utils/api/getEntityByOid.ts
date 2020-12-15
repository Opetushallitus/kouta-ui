import { ENTITY } from '#/src/constants';
import { useApiQuery, KoutaApiQueryConfig } from '#/src/hooks/useApiQuery';
import { AxiosInstance } from 'axios';
import _ from 'lodash';

type GetEntityTypeByOidProps = {
  entityType: ENTITY;
  oid: string;
  httpClient: AxiosInstance;
  apiUrls: any;
};

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
    enabled: oid,
    ...options,
  });
