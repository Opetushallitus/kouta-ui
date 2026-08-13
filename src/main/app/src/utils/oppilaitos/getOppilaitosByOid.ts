import { ENTITY } from '#/src/constants';

import { useEntityByOid } from '../api/getEntityByOid';

export const useOppilaitosByOid = (oid?: string | null, options = {}) =>
  useEntityByOid(ENTITY.OPPILAITOS, { oid, silent: true }, options);
