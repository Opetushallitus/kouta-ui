import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const createSoraKuvaus = makeBackendEntityMutator(
  'put',
  'soraKuvaus',
  'kouta-backend.soraKuvaus'
);
