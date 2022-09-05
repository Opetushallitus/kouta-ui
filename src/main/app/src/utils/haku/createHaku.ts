import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const createHaku = makeEntityMutator(
  'put',
  'haku',
  'kouta-backend.haku'
);
