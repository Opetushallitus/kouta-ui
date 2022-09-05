import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const updateOppilaitos = makeEntityMutator(
  'post',
  'oppilaitos',
  'kouta-backend.oppilaitos'
);
