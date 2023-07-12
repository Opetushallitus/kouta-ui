import { Page } from '@playwright/test';
import { merge } from 'lodash';

import { koutaSearchItem } from './mocks/koutaSearchItem';
import { fixtureJSON, mocksFromFile } from './mocks/playwright-mock-utils';
import { stubCommonRoutes } from './mocks/stubCommonRoutes';
import { stubONRHenkiloRoute } from './mocks/stubONRHenkiloRoute';
import { stubOrganisaatioRoutes } from './mocks/stubOrganisaatioRoutes';

const valintaperusteItem = merge(koutaSearchItem({ idProp: 'id' }), {
  nimi: { fi: 'Valintaperusteen nimi' },
  tila: 'julkaistu',
});

export const stubValintaperusteRoutes = async (
  page: Page,
  organisaatioOid: string
) => {
  await stubCommonRoutes(page);
  await page.route(
    '**/valintaperuste/list*',
    fixtureJSON([valintaperusteItem])
  );
  await page.route(
    '**/valintaperuste/1.1.1.1.1.1',
    fixtureJSON(valintaperusteItem)
  );
  await stubONRHenkiloRoute(page);
  await stubOrganisaatioRoutes(page, organisaatioOid);
  await mocksFromFile(page, 'valintaperuste.mocks.json');
};
