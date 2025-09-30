import { ENTITY } from '#/src/constants';
import { type HttpClient } from '#/src/httpClient';
import { type OppilaitosModel } from '#/src/types/domainTypes';
import { type ApiUrls } from '#/src/urls';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getOppilaitosByOid = async ({
  oid,
  httpClient,
  apiUrls,
  silent = true,
}: {
  oid: string;
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  silent?: boolean;
}) =>
  getEntityByOid<OppilaitosModel>({
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
