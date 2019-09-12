import get from 'lodash/get';

import { isObject } from '../utils';

export const getHakukohdeByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.hakukohde-by-oid', oid),
  );

  const lastModified = get(headers, 'x-last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export default getHakukohdeByOid;
