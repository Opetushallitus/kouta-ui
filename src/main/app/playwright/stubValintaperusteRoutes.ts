import { type Page } from '@playwright/test';
import { merge } from 'lodash';

import { koutaSearchItem } from '#/playwright/fixtures/koutaSearchItem';
import { fixtureJSON, mocksFromFile } from '#/playwright/playwright-mock-utils';
import { stubCommonRoutes } from '#/playwright/stubCommonRoutes';
import { stubONRHenkiloRoute } from '#/playwright/stubONRHenkiloRoute';
import { stubOrganisaatioRoutes } from '#/playwright/stubOrganisaatioRoutes';

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
