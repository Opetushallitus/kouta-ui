import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const createToteutus = makeBackendEntityMutator(
  'put',
  'toteutus',
  'kouta-backend.toteutus'
);
