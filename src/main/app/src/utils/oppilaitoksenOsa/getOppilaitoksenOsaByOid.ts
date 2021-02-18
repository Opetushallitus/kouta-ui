import { ENTITY } from '#/src/constants';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getOppilaitoksenOsaByOid = async ({
  oid,
  httpClient,
  apiUrls,
  silent = false,
}) =>
  getEntityByOid({
    entityType: ENTITY.OPPILAITOKSEN_OSA,
    oid,
    apiUrls,
    httpClient,
    silent,
  });

export const useOppilaitoksenOsaByOid = (oid?: string | null, options = {}) =>
  useEntityByOid(ENTITY.OPPILAITOKSEN_OSA, { oid, silent: true }, options);

export default getOppilaitoksenOsaByOid;
