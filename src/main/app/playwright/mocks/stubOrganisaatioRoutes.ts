import { Page } from '@playwright/test';
import { merge } from 'lodash';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import oppilaitoksetFlat from './oppilaitoksetFlat';
import organisaatio from './organisaatio';
import organisaatioHierarkia from './organisaatioHierarkia';
import { fixtureJSON } from './playwright-mock-utils';

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

  page.route(
    '**/kouta-backend/organisaatio/oppilaitokset-for-avoin-korkeakoulutus',
    fixtureJSON(oppilaitoksetFlat({ rootOid: organisaatioOid }))
  );
};
