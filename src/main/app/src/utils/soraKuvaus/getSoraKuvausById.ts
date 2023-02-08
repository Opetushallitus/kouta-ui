import { ENTITY } from '#/src/constants';
import { SoraKuvausModel } from '#/src/types/domainTypes';
import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';

export const getSoraKuvausById = async ({ httpClient, apiUrls, id }) =>
  getEntityByOid({
    entityType: ENTITY.SORA_KUVAUS,
    oid: id,
    httpClient,
    apiUrls,
  });

export const useSoraKuvausById = (id: string | null, options = {}) =>
  useEntityByOid<SoraKuvausModel>(ENTITY.SORA_KUVAUS, { oid: id }, options);

export default getSoraKuvausById;
