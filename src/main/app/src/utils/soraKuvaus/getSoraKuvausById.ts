import { ENTITY } from '#/src/constants';
import { useEntityByOid } from '#/src/utils/api/getEntityByOid';

export const useSoraKuvausById = (id: string | null, options = {}) =>
  useEntityByOid(ENTITY.SORA_KUVAUS, { oid: id }, options);
