import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const updateHaku = makeBackendEntityMutator(
  'post',
  'haku',
  'kouta-backend.haku'
);
