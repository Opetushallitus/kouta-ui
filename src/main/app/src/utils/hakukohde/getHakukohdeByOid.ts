import { ENTITY } from '#/src/constants';
import { HakukohdeModel } from '#/src/types/domainTypes';
import { getEntityByOid, useEntityByOid } from '#/src/utils/api/getEntityByOid';

export const getHakukohdeByOid = async ({ oid, httpClient, apiUrls }) =>
  getEntityByOid({
    entityType: ENTITY.SORA_KUVAUS,
    oid,
    httpClient,
    apiUrls,
  });

export const useHakukohdeByOid = (oid: string, options = {}) =>
  useEntityByOid<HakukohdeModel>(ENTITY.HAKUKOHDE, { oid }, options);

export default getHakukohdeByOid;
