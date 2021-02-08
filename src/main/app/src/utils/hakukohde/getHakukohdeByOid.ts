import { ENTITY } from '#/src/constants';
import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';

export const getHakukohdeByOid = async ({ oid, httpClient, apiUrls }) =>
  getEntityByOid({
    entityType: ENTITY.SORA_KUVAUS,
    oid,
    httpClient,
    apiUrls,
  });

export const useHakukohdeByOid = (oid, options = {}) =>
  useEntityByOid(ENTITY.HAKUKOHDE, { oid }, options);

export default getHakukohdeByOid;
