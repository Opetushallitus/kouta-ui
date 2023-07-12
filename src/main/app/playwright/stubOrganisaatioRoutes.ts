import { Page } from '@playwright/test';
import { merge } from 'lodash';

import oppilaitoksetFlat from '#/playwright/fixtures/oppilaitoksetFlat';
import organisaatio from '#/playwright/fixtures/organisaatio';
import organisaatioHierarkia from '#/playwright/fixtures/organisaatioHierarkia';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

export const stubOrganisaatioRoutes = async (
  page: Page,
  organisaatioOid: string
) => {
  await page.route(
    `**/kouta-backend/organisaatio/hierarkia**oidRestrictionList=${OPETUSHALLITUS_ORGANISAATIO_OID}*`,
    fixtureJSON(
      organisaatioHierarkia({ rootOid: OPETUSHALLITUS_ORGANISAATIO_OID })
    )
  );

  await page.route(
    `**/kouta-backend/organisaatio/hierarkia?aktiiviset=true&lakkautetut=false&skipParents=false&suunnitellut=true`,
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

  await page.route(
    '**/kouta-backend/organisaatio/oppilaitokset-for-avoin-korkeakoulutus',
    fixtureJSON(oppilaitoksetFlat({ rootOid: organisaatioOid }))
  );
};
