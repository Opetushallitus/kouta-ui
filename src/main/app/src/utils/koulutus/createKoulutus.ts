import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const createKoulutus = makeEntityMutator(
  'put',
  'koulutus',
  'kouta-backend.koulutus'
);
