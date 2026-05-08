import { ENTITY } from '#/src/constants';
import { useEntityByOid } from '#/src/utils/api/getEntityByOid';

export const useToteutusByOid = (oid?: string | null, options = {}) =>
  useEntityByOid(ENTITY.TOTEUTUS, { oid }, options);
