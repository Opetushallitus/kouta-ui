import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const createKoulutus = makeBackendEntityMutator(
  'put',
  'koulutus',
  'kouta-backend.koulutus'
);
