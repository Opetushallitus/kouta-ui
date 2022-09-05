import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const updateToteutus = makeEntityMutator(
  'post',
  'toteutus',
  'kouta-backend.toteutus'
);
