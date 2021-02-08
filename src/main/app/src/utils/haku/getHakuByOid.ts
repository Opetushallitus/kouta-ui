import { ENTITY } from '#/src/constants';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getHakuByOid = async ({ oid, httpClient, apiUrls }) =>
  getEntityByOid({
    entityType: ENTITY.HAKU,
    oid,
    httpClient,
    apiUrls,
  });

export const useHakuByOid = (oid, options = {}) =>
  useEntityByOid(ENTITY.HAKU, { oid }, options);

export default getHakuByOid;
