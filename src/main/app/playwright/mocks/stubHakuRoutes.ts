import { Page } from '@playwright/test';
import { merge } from 'lodash';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import { koutaSearchItem } from './koutaSearchItem';
import organisaatio from './organisaatio';
import organisaatioHierarkia from './organisaatioHierarkia';
import { fixtureJSON, mocksFromFile } from './playwright-mock-utils';
import { stubCommonRoutes } from './stubCommonRoutes';

const stubHakemuspalveluLomakkeetRoute = async (
  page: Page,
  { lomakkeet = [{ name: { fi: 'Lomake 1' }, key: 'lomake_1' }] } = {}
) => {
  await page.route(
    '**/lomake-editori/api/forms',
    fixtureJSON({ forms: lomakkeet })
  );
};

const stubONRHenkiloRoute = async (
  page: Page,
  { henkilo = { etunimet: 'John', sukunimi: 'Doe' } } = {}
) => {
  await page.route(
    '/oppijanumerorekisteri-service/henkilo/',
    fixtureJSON(henkilo)
  );
};

export const stubHakuRoutes = async (page: Page, organisaatioOid: string) => {
  await stubCommonRoutes(page);
  await mocksFromFile(page, 'haku.mocks.json');
  await page.route(
    `**/kouta-backend/organisaatio/hierarkia**oidRestrictionList=${OPETUSHALLITUS_ORGANISAATIO_OID}*`,
    fixtureJSON(
      organisaatioHierarkia({ rootOid: OPETUSHALLITUS_ORGANISAATIO_OID })
    )
  );

  await page.route(
    `**/kouta-backend/organisaatio/hierarkia*oid=${organisaatioOid}*`,
    fixtureJSON(organisaatioHierarkia({ rootOid: organisaatioOid }))
  );
  await page.route(
    `**/kouta-backend/organisaatio/${organisaatioOid}`,
    fixtureJSON([
      merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    ])
  );

  await page.route(
    '**/kouta-backend/organisaatio/organisaatiot',
    async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          json: [
            merge(organisaatio(), {
              oid: organisaatioOid,
            }),
          ],
        });
      }
    }
  );

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

  await page.route(
    '**/kouta-backend/haku/list?organisaatioOid=1.1.1.1.1.1*',
    fixtureJSON([])
  );

  await stubHakemuspalveluLomakkeetRoute(page);
  await stubONRHenkiloRoute(page);
};
