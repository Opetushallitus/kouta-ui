import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const updateHakukohde = makeBackendEntityMutator(
  'post',
  'hakukohde',
  'kouta-backend.hakukohde'
);
