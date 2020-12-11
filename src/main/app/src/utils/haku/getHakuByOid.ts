import { ENTITY } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import _ from 'lodash';

export const getHakuByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-by-oid', oid)
  );

  const lastModified = _.get(headers, 'x-last-modified') || null;

  return _.isObject(data) ? { lastModified, ...data } : data;
};

export const useHakuByOid = (props, options = {}) =>
  useApiQuery(ENTITY.HAKU, props, getHakuByOid, {
    refetchOnWindowFocus: false,
    ...options,
  });

export default getHakuByOid;
