import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const updateToteutus = makeBackendEntityMutator(
  'post',
  'toteutus',
  'kouta-backend.toteutus'
);
