import { Page } from '@playwright/test';
import { merge } from 'lodash';

import { koutaSearchItem } from './mocks/koutaSearchItem';
import { fixtureJSON, mocksFromFile } from './mocks/playwright-mock-utils';
import { stubCommonRoutes } from './mocks/stubCommonRoutes';
import { stubONRHenkiloRoute } from './mocks/stubONRHenkiloRoute';
import { stubOrganisaatioRoutes } from './mocks/stubOrganisaatioRoutes';

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
