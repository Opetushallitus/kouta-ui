import { ENTITY } from '#/src/constants';
import { useEntityByOid } from '#/src/utils/api/getEntityByOid';

export const useKoulutusByOid = (oid?: string, options = {}) =>
  useEntityByOid(ENTITY.KOULUTUS, { oid }, options);
