import { ENTITY } from '#/src/constants';
import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';

const getKoulutusByOid = async ({ oid, apiUrls, httpClient }) =>
  getEntityByOid({
    entityType: ENTITY.KOULUTUS,
    oid,
    apiUrls,
    httpClient,
  });

export const useKoulutusByOid = (oid?: string, options = {}) =>
  useEntityByOid(ENTITY.KOULUTUS, oid, options);

export default getKoulutusByOid;
