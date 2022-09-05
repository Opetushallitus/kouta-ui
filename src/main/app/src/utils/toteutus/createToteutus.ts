import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const createToteutus = makeEntityMutator(
  'put',
  'toteutus',
  'kouta-backend.toteutus'
);
