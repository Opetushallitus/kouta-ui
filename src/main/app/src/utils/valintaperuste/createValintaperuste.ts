import { makeBackendEntityMutator } from '#/src/utils/makeBackendEntityMutator';

export const createValintaperuste = makeBackendEntityMutator(
  'put',
  'valintaperuste',
  'kouta-backend.valintaperuste'
);
