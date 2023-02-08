import { ENTITY } from '#/src/constants';
import { OppilaitosModel } from '#/src/types/domainTypes';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getOppilaitosByOid = async ({
  oid,
  httpClient,
  apiUrls,
  silent = true,
}) =>
  getEntityByOid({
    entityType: ENTITY.OPPILAITOS,
    oid,
    apiUrls,
    httpClient,
    silent,
  });

export const useOppilaitosByOid = (oid?: string | null, options = {}) =>
  useEntityByOid<OppilaitosModel>(
    ENTITY.OPPILAITOS,
    { oid, silent: true },
    options
  );

export default getOppilaitosByOid;
