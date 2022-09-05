import { makeEntityMutator } from '#/src/utils/makeEntityMutator';

export const updateHakukohde = makeEntityMutator(
  'post',
  'hakukohde',
  'kouta-backend.hakukohde'
);
