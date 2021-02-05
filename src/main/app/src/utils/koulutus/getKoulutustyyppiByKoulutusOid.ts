import { memoizePromise } from '#/src/utils/memoize';

import getKoulutusByOid from './getKoulutusByOid';

const memoizedGetKoulutusByKoulutusOid = memoizePromise(
  async (oid, httpClient, apiUrls) => {
    return await getKoulutusByOid({ oid, httpClient, apiUrls });
  }
);

const getKoulutusByKoulutusOid = ({ oid, httpClient, apiUrls }) => {
  return memoizedGetKoulutusByKoulutusOid(oid, httpClient, apiUrls);
};

export default getKoulutusByKoulutusOid;
