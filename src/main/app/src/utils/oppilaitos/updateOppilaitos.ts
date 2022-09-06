import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const updateOppilaitos = makeBackendEntityMutator(
  'post',
  'oppilaitos',
  'kouta-backend.oppilaitos'
);
