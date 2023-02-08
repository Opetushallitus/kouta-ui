import { ENTITY } from '#/src/constants';
import { HakuModel } from '#/src/types/domainTypes';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getHakuByOid = async ({ oid, httpClient, apiUrls }) =>
  getEntityByOid({
    entityType: ENTITY.HAKU,
    oid,
    httpClient,
    apiUrls,
  });

export const useHakuByOid = (oid, options = {}) =>
  useEntityByOid<HakuModel>(ENTITY.HAKU, { oid }, options);

export default getHakuByOid;
