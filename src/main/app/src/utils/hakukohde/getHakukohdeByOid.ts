import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';
import { ENTITY } from '#/src/constants';

export const getHakukohdeByOid = async ({ oid, httpClient, apiUrls }) =>
  getEntityByOid({
    entityType: ENTITY.SORA_KUVAUS,
    oid,
    httpClient,
    apiUrls,
  });

export default getHakukohdeByOid;

export const useHakukohdeByOid = (oid, options = {}) =>
  useEntityByOid(ENTITY.HAKUKOHDE, oid, options);
