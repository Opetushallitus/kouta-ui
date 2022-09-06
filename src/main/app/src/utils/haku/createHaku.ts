import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const createHaku = makeBackendEntityMutator(
  'put',
  'haku',
  'kouta-backend.haku'
);
