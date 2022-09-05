import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const createSoraKuvaus = makeEntityMutator(
  'put',
  'soraKuvaus',
  'kouta-backend.soraKuvaus'
);
