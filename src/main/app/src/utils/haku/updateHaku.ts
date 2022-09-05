import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const updateHaku = makeEntityMutator(
  'post',
  'haku',
  'kouta-backend.haku'
);
