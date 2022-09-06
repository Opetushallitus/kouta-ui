import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const updateKoulutus = makeBackendEntityMutator(
  'post',
  'koulutus',
  'kouta-backend.koulutus'
);
