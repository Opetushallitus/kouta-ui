import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const createHakukohde = makeEntityMutator(
  'put',
  'hakukohde',
  'kouta-backend.hakukohde'
);
