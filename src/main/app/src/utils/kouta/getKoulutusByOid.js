import { get, isObject } from 'lodash';

const getKoulutusByOid = async ({ oid, apiUrls, httpClient }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.koulutus-by-oid', oid),
  );

  const lastModified = get(headers, 'x-last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export default getKoulutusByOid;
