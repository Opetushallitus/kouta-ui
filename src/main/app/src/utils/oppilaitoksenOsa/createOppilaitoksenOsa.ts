import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const createOppilaitoksenOsa = makeBackendEntityMutator(
  'put',
  'oppilaitoksenOsa',
  'kouta-backend.oppilaitoksenOsa'
);
