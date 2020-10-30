import _ from 'lodash/fp';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getHakukohdeByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.hakukohde-by-oid', oid)
  );

  const lastModified = headers?.['x-last-modified'] || null;

  return _.isObject(data) ? { lastModified, ...data } : data;
};

export default getHakukohdeByOid;

export const useHakukohdeByOid = props =>
  useApiQuery('hakukohde', props, getHakukohdeByOid, {
    refetchOnWindowFocus: false,
  });
