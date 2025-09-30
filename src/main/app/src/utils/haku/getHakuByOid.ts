import { ENTITY } from '#/src/constants';
import { HttpClient } from '#/src/httpClient';
import { HakuModel } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getHakuByOid = async ({
  oid,
  httpClient,
  apiUrls,
}: {
  oid: string;
  httpClient: HttpClient;
  apiUrls: ApiUrls;
}) =>
  getEntityByOid<HakuModel>({
    entityType: ENTITY.HAKU,
    oid,
    httpClient,
    apiUrls,
  });

export const useHakuByOid = (oid, options = {}) =>
  useEntityByOid<HakuModel>(ENTITY.HAKU, { oid }, options);

export default getHakuByOid;
