import { get, isObject } from 'lodash';

export const getValintaperusteByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.valintaperuste-by-oid', oid),
  );

  const lastModified = get(headers, 'x-last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export default getValintaperusteByOid;
