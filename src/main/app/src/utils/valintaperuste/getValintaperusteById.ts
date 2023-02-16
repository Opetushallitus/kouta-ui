import { ENTITY } from '#/src/constants';
import { ValintaperusteModel } from '#/src/types/domainTypes';

import { getEntityByOid, useEntityByOid } from '../api/getEntityByOid';

export const getValintaperusteById = async ({ oid, apiUrls, httpClient }) =>
  getEntityByOid({
    entityType: ENTITY.VALINTAPERUSTE,
    oid,
    apiUrls,
    httpClient,
  });

export const useValintaperusteById = (id?: string | null, options = {}) =>
  useEntityByOid<ValintaperusteModel>(
    ENTITY.VALINTAPERUSTE,
    { oid: id },
    options
  );
