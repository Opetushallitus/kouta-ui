import { ENTITY } from '#/src/constants';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getValintaperusteById = async ({ oid, apiUrls, httpClient }) =>
  getEntityByOid({
    entityType: ENTITY.VALINTAPERUSTE,
    oid,
    apiUrls,
    httpClient,
  });

export const useValintaperusteById = (id?: string | null, options = {}) =>
  useEntityByOid(ENTITY.VALINTAPERUSTE, id, options);

export default getValintaperusteById;
