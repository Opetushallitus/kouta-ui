import { Page } from '@playwright/test';
import { merge } from 'lodash';

import { koutaSearchItem } from '#/playwright/fixtures/koutaSearchItem';
import { fixtureJSON, mocksFromFile } from '#/playwright/playwright-mock-utils';

import { stubCommonRoutes } from './stubCommonRoutes';
import { stubHakemuspalveluLomakkeetRoute } from './stubHakemuspalveluLomakkeetRoute';
import { stubONRHenkiloRoute } from './stubONRHenkiloRoute';
import { stubOrganisaatioRoutes } from './stubOrganisaatioRoutes';

export const stubHakuRoutes = async (page: Page, organisaatioOid: string) => {
  await stubCommonRoutes(page);
  await mocksFromFile(page, 'haku.mocks.json');

  await stubOrganisaatioRoutes(page, organisaatioOid);
  const hakuItem = merge(koutaSearchItem(), {
    nimi: {
      fi: 'Korkeakoulujen yhteishaku',
    },
    tila: 'julkaistu',
  });

  await page.route('**/haku/1.1.1.1.1.1', fixtureJSON(hakuItem));
  await page.route('**/toteutus/list*', fixtureJSON([]));
  await page.route('**/koulutus/list*', fixtureJSON([]));
  await page.route(
    '**/search/haku/*',
    fixtureJSON({
      totalCount: 0,
      result: [],
    })
  );

  await page.route('**/kouta-backend/haku/list*', fixtureJSON([hakuItem]));

  await stubHakemuspalveluLomakkeetRoute(page);
  await stubONRHenkiloRoute(page);
};
