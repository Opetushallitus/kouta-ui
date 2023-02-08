import { ENTITY } from '#/src/constants';
import { ToteutusModel } from '#/src/types/domainTypes';
import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';

const getToteutusByOid = async ({ oid, apiUrls, httpClient }) =>
  getEntityByOid({
    entityType: ENTITY.TOTEUTUS,
    oid,
    apiUrls,
    httpClient,
  });

export const useToteutusByOid = (oid?: string | null, options = {}) =>
  useEntityByOid<ToteutusModel>(ENTITY.TOTEUTUS, { oid }, options);

export default getToteutusByOid;
