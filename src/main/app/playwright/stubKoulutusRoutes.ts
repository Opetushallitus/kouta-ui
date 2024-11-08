import { merge } from 'lodash';

import { koutaSearchItem } from '#/playwright/fixtures/koutaSearchItem';
import {
  fixtureJSON,
  mocksFromFile,
  fixtureFromFile,
} from '#/playwright/playwright-mock-utils';

import soraKuvaus from './fixtures/soraKuvaus';
import { stubCommonRoutes } from './stubCommonRoutes';
import { stubONRHenkiloRoute } from './stubONRHenkiloRoute';
import { stubOrganisaatioRoutes } from './stubOrganisaatioRoutes';

export const stubKoulutusRoutes = async (page, organisaatioOid) => {
  await stubCommonRoutes(page);
  await mocksFromFile(page, 'koulutus.mocks.json');

  await stubOrganisaatioRoutes(page, organisaatioOid);

  await page.route(
    '**/koodisto-service/rest/codeelement/latest/kansallinenkoulutusluokitus2016koulutusalataso1*',
    fixtureJSON([])
  );

  await page.route('**/koulutus/*/toteutukset/list**', fixtureJSON([]));

  await page.route('**/valintaperuste/list**', fixtureJSON([]));

  await page.route(
    '**/sorakuvaus/list**',
    fixtureJSON(
      [...new Array(10)].map((v, i) =>
        merge(soraKuvaus(), {
          nimi: { fi: `Sora-kuvaus ${i}` },
          id: i.toString(),
          tila: 'julkaistu',
        })
      )
    )
  );

  await page.route(
    '**/sorakuvaus/1',
    fixtureJSON(
      merge(soraKuvaus(), {
        nimi: { fi: `Sora-kuvaus 1` },
        id: 1,
        tila: 'julkaistu',
      })
    )
  );

  const koulutusItem = merge(koutaSearchItem(), {
    nimi: { fi: 'Koulutuksen nimi' },
    kielivalinta: ['fi', 'sv', 'en'],
    tila: 'julkaistu',
    koulutustyyppi: 'amk',
  });

  await page.route('**/koulutus/1.1.1.1.1.1', fixtureJSON(koulutusItem));

  await page.route('**/koulutus/list**', fixtureJSON([koulutusItem]));

  // tämä on jo mockattu stubCommonRoutes:ssa eri tavalla. Tarvitaanko tätä?
  await page.route('**/search/koulutus/**', fixtureJSON([]));

  await page.route(
    '**/kouta-backend/koodisto/osaamismerkit/koodit',
    fixtureFromFile('osaamismerkit-koodisto.json')
  );

  await page.route(
    '**/kouta-backend/koodisto/kansallinenkoulutusluokitus2016koulutusalataso2/koodit',
    fixtureFromFile('koulutusalat-koodisto.json')
  );

  await stubONRHenkiloRoute(page);
};
