import { ENTITY } from '#/src/constants';

import { useEntityByOid } from '../api/getEntityByOid';

export const useHakuByOid = (oid, options = {}) =>
  useEntityByOid(ENTITY.HAKU, { oid }, options);
