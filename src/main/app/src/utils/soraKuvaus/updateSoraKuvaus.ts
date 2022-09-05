import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const updateSoraKuvaus = makeEntityMutator(
  'post',
  'soraKuvaus',
  'kouta-backend.soraKuvaus'
);
