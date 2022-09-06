import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const updateSoraKuvaus = makeBackendEntityMutator(
  'post',
  'soraKuvaus',
  'kouta-backend.soraKuvaus'
);
