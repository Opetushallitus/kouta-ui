import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const updateOppilaitoksenOsa = makeEntityMutator(
  'post',
  'oppilaitoksenOsa',
  'kouta-backend.oppilaitoksenOsa'
);
