import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const updateKoulutus = makeEntityMutator(
  'post',
  'koulutus',
  'kouta-backend.koulutus'
);
