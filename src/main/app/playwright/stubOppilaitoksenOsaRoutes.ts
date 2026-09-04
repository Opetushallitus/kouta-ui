import { type Page } from '@playwright/test';

import { mocksFromFile } from '#/playwright/playwright-mock-utils';

import { stubCommonRoutes } from './stubCommonRoutes';
import { stubOrganisaatioRoutes } from './stubOrganisaatioRoutes';

// Oppilaitoksen osa käyttää samoja osioita kuin oppilaitos (kieliversiot,
// perustiedot, esittely, teemakuva, yhteystiedot, tila), joten sen mockit riittävät
// myös tälle lomakkeelle.
export const stubOppilaitoksenOsaRoutes = async (
  page: Page,
  organisaatioOid: string
) => {
  await stubCommonRoutes(page);
  await stubOrganisaatioRoutes(page, organisaatioOid);
  await mocksFromFile(page, 'oppilaitos.mocks.json');
};
