import { ENTITY } from '#/src/constants';
import { HttpClient } from '#/src/httpClient';
import { KoulutusModel } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';
import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';

const getKoulutusByOid = async ({
  oid,
  apiUrls,
  httpClient,
}: {
  oid: string;
  apiUrls: ApiUrls;
  httpClient: HttpClient;
}) =>
  getEntityByOid<KoulutusModel>({
    entityType: ENTITY.KOULUTUS,
    oid,
    apiUrls,
    httpClient,
  });

export const useKoulutusByOid = (oid?: string, options = {}) =>
  useEntityByOid<KoulutusModel>(ENTITY.KOULUTUS, { oid }, options);

export default getKoulutusByOid;
