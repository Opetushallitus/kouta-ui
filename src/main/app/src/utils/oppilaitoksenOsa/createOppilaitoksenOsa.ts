import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const createOppilaitoksenOsa = makeEntityMutator(
  'put',
  'oppilaitoksenOsa',
  'kouta-backend.oppilaitoksenOsa'
);
