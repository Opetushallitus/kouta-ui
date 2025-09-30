import { type Page } from '@playwright/test';
import { merge } from 'lodash';

import { koutaSearchItem } from '#/playwright/fixtures/koutaSearchItem';
import { fixtureJSON, mocksFromFile } from '#/playwright/playwright-mock-utils';
import { stubCommonRoutes } from '#/playwright/stubCommonRoutes';
import { stubONRHenkiloRoute } from '#/playwright/stubONRHenkiloRoute';
import { stubOrganisaatioRoutes } from '#/playwright/stubOrganisaatioRoutes';

const soraItem = merge(koutaSearchItem({ idProp: 'id' }), {
  nimi: {
    fi: 'Sorakuvauksen nimi',
  },
  tila: 'julkaistu',
});

export const stubSoraKuvausRoutes = async (
  page: Page,
  organisaatioOid: string
) => {
  await stubCommonRoutes(page);
  await page.route('**/sorakuvaus/list*', fixtureJSON([soraItem]));
  await page.route('**/sorakuvaus/1.1.1.1.1.1', fixtureJSON(soraItem));
  await stubONRHenkiloRoute(page);
  await stubOrganisaatioRoutes(page, organisaatioOid);
  await mocksFromFile(page, 'soraKuvaus.mocks.json');
};
