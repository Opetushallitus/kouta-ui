import { ENTITY } from '#/src/constants';
import { HttpClient } from '#/src/httpClient';
import { ToteutusModel } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';
import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';

const getToteutusByOid = async ({
  oid,
  apiUrls,
  httpClient,
}: {
  oid: string;
  apiUrls: ApiUrls;
  httpClient: HttpClient;
}) =>
  getEntityByOid<ToteutusModel>({
    entityType: ENTITY.TOTEUTUS,
    oid,
    apiUrls,
    httpClient,
  });

export const useToteutusByOid = (oid?: string | null, options = {}) =>
  useEntityByOid<ToteutusModel>(ENTITY.TOTEUTUS, { oid }, options);

export default getToteutusByOid;
