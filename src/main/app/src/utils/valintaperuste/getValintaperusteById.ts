import { ENTITY } from '#/src/constants';

import { useEntityByOid } from '../api/getEntityByOid';

export const useValintaperusteById = (id?: string | null, options = {}) =>
  useEntityByOid(ENTITY.VALINTAPERUSTE, { oid: id }, options);
