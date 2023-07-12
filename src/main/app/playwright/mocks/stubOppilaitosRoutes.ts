import { Page } from '@playwright/test';

import { mocksFromFile } from './playwright-mock-utils';
import { stubCommonRoutes } from './stubCommonRoutes';
import { stubOrganisaatioRoutes } from './stubOrganisaatioRoutes';

export const stubOppilaitosRoutes = async (
  page: Page,
  organisaatioOid: string
) => {
  await stubCommonRoutes(page);

  await stubOrganisaatioRoutes(page, organisaatioOid);
  await mocksFromFile(page, 'oppilaitos.mocks.json');
};
