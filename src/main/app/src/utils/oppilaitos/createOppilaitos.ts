import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const createOppilaitos = makeBackendEntityMutator(
  'put',
  'oppilaitos',
  'kouta-backend.oppilaitos'
);
