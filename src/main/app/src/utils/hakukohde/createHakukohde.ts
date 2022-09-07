import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const createHakukohde = makeBackendEntityMutator(
  'put',
  'hakukohde',
  'kouta-backend.hakukohde'
);
