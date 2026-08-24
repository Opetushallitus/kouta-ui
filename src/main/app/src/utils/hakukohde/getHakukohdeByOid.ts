import { ENTITY } from '#/src/constants';
import { useEntityByOid } from '#/src/utils/api/getEntityByOid';

export const useHakukohdeByOid = (oid: string, options = {}) =>
  useEntityByOid(ENTITY.HAKUKOHDE, { oid }, options);
