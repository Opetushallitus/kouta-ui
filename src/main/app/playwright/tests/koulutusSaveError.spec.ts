import { expect, Page, test } from '@playwright/test';
import { merge } from 'lodash';

import koulutus from '#/playwright/fixtures/koulutus';
import {
  fillKieliversiotSection,
  tallenna,
} from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubKoulutusRoutes } from '#/playwright/stubKoulutusRoutes';

// Tallennuksen EPÄONNISTUMISEN polku: backend vastaa 400:lla ja virhelistalla.
//
// Polku kulkee useSaveFormin catch-haaraan, joka muuntaa backend-virheet kenttien
// virheiksi (withRemoteErrors) ja PALAUTTAA ne, jolloin react-final-form vie ne
// submitErrorsiin ja kenttien meta.submitErroriin. Lisäksi raakavirheet menevät
// KoulutusSaveErrorModalille.
//
// Ilman tätä testiä koko catch-haara oli kattamaton: onnistunut tallennus ja
// validointivirheet olivat testattuja, mutta backendin torjuma tallennus ei.
const organisaatioOid = '1.1.1.1.1.1';
const koulutusOid = '1.2.3.4.5.6';

const prepareTest = async (page: Page) => {
  await page.route(
    `**/kouta-backend/koulutus/${koulutusOid}`,
    fixtureJSON(
      merge(koulutus('amm'), {
        oid: koulutusOid,
        organisaatioOid,
        tarjoajat: [organisaatioOid],
      })
    )
  );
  await page.goto(
    `/kouta/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
  );
};

const failSaveWith = (page: Page, body: any) =>
  page.route('**/kouta-backend/koulutus', route =>
    route.fulfill({ status: 400, json: body })
  );

test.describe('Koulutus save errors from the backend', () => {
  test.beforeEach(async ({ page }) => {
    await stubKoulutusRoutes(page, organisaatioOid);
    await page.route(`**/koulutus/${koulutusOid}/toteutukset`, fixtureJSON([]));
    await page.route('**/toteutus/list**', fixtureJSON([]));
    await page.route('**/search/koulutus/**', fixtureJSON([]));
  });

  test('a rejected save shows the error on the field', async ({ page }) => {
    await failSaveWith(page, [
      {
        errorType: 'invalidStateChange',
        path: 'koulutustyyppi',
        msg: 'sora kuvaus does not match',
      },
    ]);
    await prepareTest(page);
    await fillKieliversiotSection(page);
    await tallenna(page);

    await expect(
      page
        .getByTestId('form-control_soraKuvaus')
        .getByText(
          'validointivirheet.koulutustyyppiEiVastaaSorakuvauksenTyyppia'
        )
    ).toBeVisible();
  });
});
