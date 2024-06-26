import { Page } from '@playwright/test';
import { merge } from 'lodash';

import { koutaSearchItem } from '#/playwright/fixtures/koutaSearchItem';
import {
  fixtureFromFile,
  fixtureJSON,
  mocksFromFile,
} from '#/playwright/playwright-mock-utils';

import { stubKayttoOikeusOmatTiedot } from './stubKayttoOikeusOmatTiedot';

export const stubCommonRoutes = async (page: Page) => {
  await page.route(
    '**/kouta-backend/search/koulutukset?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Koulutuksen nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route(
    '**/kouta-backend/search/toteutukset?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Toteutuksen nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route(
    '**/kouta-backend/search/haut?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Haun nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route(
    '**/kouta-backend/search/hakukohteet?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Hakukohteen nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route(
    '**/kouta-backend/search/valintaperusteet?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Valintaperusteen nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route('**/lokalisointi/cxf/rest/v1/localisation', fixtureJSON([]));

  await page.route(
    '**/oppijanumerorekisteri-service/henkilo/current/asiointiKieli',
    route =>
      route.fulfill({
        body: 'fi',
        contentType: 'text/plain',
      })
  );
  await page.route('**/kouta-backend/auth/session', fixtureJSON({}));
  await page.route('**/kouta-backend/auth/login', fixtureJSON({}));

  await page.route(
    '**/kouta-backend/koodisto/hakutapa/koodit*',
    fixtureFromFile('hakutapa-koodisto.json')
  );

  await page.route(
    '**/kouta-backend/koodisto/valintakokeentyypit?*',
    fixtureFromFile('valintakokeentyyppi-koodisto.json')
  );

  await page.route(
    '**/kouta-backend/koulutus/listOppilaitostyypitByKoulutustyypit*',
    fixtureFromFile('oppilaitostyypit-by-koulutustyypit.json')
  );

  await stubKayttoOikeusOmatTiedot(page);
  await mocksFromFile(page, 'common.mocks.json');
};
