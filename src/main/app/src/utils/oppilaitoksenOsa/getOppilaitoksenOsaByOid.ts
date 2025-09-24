import { ENTITY } from '#/src/constants';
import { HttpClient } from '#/src/httpClient';
import { OppilaitoksenOsaModel } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getOppilaitoksenOsaByOid = async ({
  oid,
  httpClient,
  apiUrls,
  silent = false,
}: {
  oid: string;
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  silent?: boolean;
}) =>
  getEntityByOid<OppilaitoksenOsaModel>({
    entityType: ENTITY.OPPILAITOKSEN_OSA,
    oid,
    apiUrls,
    httpClient,
    silent,
  });

export const useOppilaitoksenOsaByOid = (oid?: string | null, options = {}) =>
  useEntityByOid<OppilaitoksenOsaModel>(
    ENTITY.OPPILAITOKSEN_OSA,
    { oid, silent: true },
    options
  );

export default getOppilaitoksenOsaByOid;
