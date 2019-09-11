import get from 'lodash/get';

import { isObject } from '../index';

const getOppilaitosByOid = async ({
  oid,
  httpClient,
  apiUrls,
  silent = false,
}) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.oppilaitos-by-oid', oid),
    {
      errorNotifier: {
        silent,
      },
    },
  );

  const lastModified = get(headers, 'last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export default getOppilaitosByOid;
