import { get, isObject } from 'lodash';

const getToteutusByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-by-oid', oid)
  );

  const lastModified = get(headers, 'x-last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export default getToteutusByOid;
