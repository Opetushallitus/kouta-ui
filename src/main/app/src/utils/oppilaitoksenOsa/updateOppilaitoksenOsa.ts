import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const updateOppilaitoksenOsa = makeBackendEntityMutator(
  'post',
  'oppilaitoksenOsa',
  'kouta-backend.oppilaitoksenOsa'
);
