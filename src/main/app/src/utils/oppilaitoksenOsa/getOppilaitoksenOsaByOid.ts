import { ENTITY } from '#/src/constants';

import { useEntityByOid } from '../api/getEntityByOid';

export const useOppilaitoksenOsaByOid = (oid?: string | null, options = {}) =>
  useEntityByOid(ENTITY.OPPILAITOKSEN_OSA, { oid, silent: true }, options);
