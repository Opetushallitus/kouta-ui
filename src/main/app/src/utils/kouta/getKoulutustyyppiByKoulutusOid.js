import { get } from 'lodash';

import { memoizePromise } from '../index';
import getKoulutusByOid from './getKoulutusByOid';

const memoizedGetKoulutustyyppiByKoulutusOid = memoizePromise(
  async (oid, httpClient, apiUrls) => {
    const koulutus = await getKoulutusByOid({ oid, httpClient, apiUrls });

    return get(koulutus, 'koulutustyyppi') || null;
  },
);

const getKoulutustyyppiByKoulutusOid = ({ oid, httpClient, apiUrls }) => {
  return memoizedGetKoulutustyyppiByKoulutusOid(oid, httpClient, apiUrls);
};

export default getKoulutustyyppiByKoulutusOid;
