import { expect, test } from '@playwright/test';
import { merge } from 'lodash';

import organisaatio from '#/playwright/fixtures/organisaatio';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubCommonRoutes } from '#/playwright/stubCommonRoutes';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

export const oid = OPETUSHALLITUS_ORGANISAATIO_OID;

test.describe('frontPage', () => {
  test.beforeEach(async ({ page }) => {
    await stubCommonRoutes(page);
    await page.route(
      '**/kouta-backend/organisaatio/organisaatiot',
      fixtureJSON([
        merge(organisaatio(), {
          oid,
          nimi: {
            fi: 'Organisaatio_1',
          },
        }),
      ])
    );

    await page.route(
      '**/kayttooikeus-service/organisaatiohenkilo/organisaatioOid',
      fixtureJSON([oid])
    );

    await page.route('**/koodi?onlyValidKoodis=true', fixtureJSON({}));
    await page.route('**/kouta-backend/**/list*', fixtureJSON([]));
    await page.goto('/kouta/');
  });

  test('Should display organization hierarchy', async ({ page }) => {
    await page.getByTestId('toggleOrganisaatioDrawer').click();

    await expect(page.getByTestId('selectedOrganisaatio')).toContainText(
      'Organisaatio_1'
    );
    await expect(page.getByTestId('organisaatioDrawer')).toContainText(
      'etusivu.vaihdaOrganisaatiota'
    );
  });

  test('Should add organization to favourites', async ({ page }) => {
    await page.getByTestId('toggleOrganisaatioDrawer').click();
    const drawer = page.getByTestId('organisaatioDrawer');

    await expect(drawer.getByTestId('organization-favourites')).toBeHidden();
    await drawer.getByTitle('etusivu.lisaaSuosikkeihin').first().click();
    await expect(drawer.getByTestId('organization-favourites')).toBeVisible();
  });

  test('Should remove organization from favourites', async ({ page }) => {
    await page.getByTestId('toggleOrganisaatioDrawer').click();
    const drawer = page.getByTestId('organisaatioDrawer');
    await drawer.getByTitle('etusivu.lisaaSuosikkeihin').first().click();
    await drawer
      .getByTestId('organization-favourites')
      .getByRole('button')
      .first()
      .click();
    await expect(drawer.getByTestId('organization-favourites')).toBeHidden();
  });

  test('Should display navigation links', async ({ page }) => {
    const nav = page.getByTestId('navigaatio');
    await expect(nav).toContainText('yleiset.koulutukset');
    await expect(nav).toContainText('yleiset.toteutukset');
    await expect(nav).toContainText('yleiset.haut');
    await expect(nav).toContainText('yleiset.hakukohteet');
    await expect(nav).toContainText('yleiset.valintaperusteet');
  });

  test('Should list entities', async ({ page }) => {
    await expect(page.getByTestId('koulutuksetSection')).toContainText(
      'Koulutuksen nimi'
    );
    await expect(page.getByTestId('toteutuksetSection')).toContainText(
      'Toteutuksen nimi'
    );
    await expect(page.getByTestId('hautSection')).toContainText('Haun nimi');
    await expect(page.getByTestId('hakukohteetSection')).toContainText(
      'Hakukohteen nimi'
    );
    await expect(page.getByTestId('valintaperusteetSection')).toContainText(
      'Valintaperusteen nimi'
    );
  });
});
