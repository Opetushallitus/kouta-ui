import { ENTITY } from '#/src/constants';
import { KoulutusModel } from '#/src/types/domainTypes';
import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';

const getKoulutusByOid = async ({ oid, apiUrls, httpClient }) =>
  getEntityByOid({
    entityType: ENTITY.KOULUTUS,
    oid,
    apiUrls,
    httpClient,
  });

export const useKoulutusByOid = (oid?: string, options = {}) =>
  useEntityByOid<KoulutusModel>(ENTITY.KOULUTUS, { oid }, options);

export default getKoulutusByOid;
