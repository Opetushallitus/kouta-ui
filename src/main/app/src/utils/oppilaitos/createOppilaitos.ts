import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const createOppilaitos = makeEntityMutator(
  'put',
  'oppilaitos',
  'kouta-backend.oppilaitos'
);
