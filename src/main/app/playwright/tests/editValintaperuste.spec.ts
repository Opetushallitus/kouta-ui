import { Page, expect, test } from '@playwright/test';
import { merge } from 'lodash';

import valintaperuste from '#/playwright/fixtures/valintaperuste';
import {
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  withinSection,
  confirmDelete,
  assertNoUnsavedChangesDialog,
  assertUnsavedChangesDialog,
  assertURLEndsWith,
} from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubValintaperusteRoutes } from '#/playwright/stubValintaperusteRoutes';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import { KoulutustyyppiModel } from '#/src/types/domainTypes';

const valintaperusteId = '111-222-333-444-555';

const mutationTest = wrapMutationTest(ENTITY.VALINTAPERUSTE, {
  id: valintaperusteId,
});

export const organisaatioOid = '1.1.1.1.1.1';

const prepareTest = async (page: Page, tyyppi: KoulutustyyppiModel) => {
  await stubValintaperusteRoutes(page, organisaatioOid);
  await page.route(
    `**/valintaperuste/${valintaperusteId}`,
    fixtureJSON(merge(valintaperuste({ tyyppi }), { organisaatioOid }))
  );
  await page.goto(
    `/kouta/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteId}/muokkaus`
  );
};

test.describe('Edit Valintaperuste', () => {
  test('Should be able to edit valintaperuste', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'amk');
      await expect(page.getByTestId('postinumero')).toContainText('00350');
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  // Haaran ainoa testi joka TYHJENTÄÄ kentän. Kaikki muut asettavat arvon, ja juuri
  // siksi react-final-formin oletus-parse (tyhjä merkkijono -> undefined, jonka
  // jälkeen kirjasto karsii tyhjentyneet vanhemmat) ehti jäädä huomaamatta. Sama
  // sokea piste kuin fillissä näppäinpainallusten kanssa: testijoukko on tiheä,
  // mutta sen toiminnot ovat kaikki "aseta arvo", ei koskaan "poista arvo".
  //
  // Valintatavan nimi kelpaa tähän kolmesta syysta: se on tavallinen tekstikenttä,
  // se on käännetty (pickTranslations säilyttää tyhjan merkkijonon, toisin kuin
  // externalId jonka konvertteri normalisoi nullille), ja se on pakollinen vasta
  // julkaistuna - fixture on tallennettu-tilassa, joten tyhjentäminen menee läpi
  // validoinnista.
  //
  // Ilman Field.tsx:n identiteetti-parsea runkoon lähtee nimi: {} tämän sijaan.
  test('Should send an emptied translated field as an empty string', async ({
    page,
  }) => {
    await prepareTest(page, 'amk');

    // Fixturessa on vain fi-nimi, mutta kielivalinta on [fi, sv], joten
    // validateTranslations('kuvaus.nimi') vaatisi myös sv:n eikä tallennus lähtisi.
    // Muut tämän tiedoston tallentavat testit tekevät saman.
    await fillKieliversiotSection(page);

    const nimi = page
      .getByTestId('valintatapalista')
      .getByTestId('nimi')
      .locator('input');

    await withinSection(page, 'valintatavat', async () => {
      await expect(nimi).toHaveValue('Valintatavan nimi');
      await nimi.fill('');
    });

    const requestPromise = page.waitForRequest(
      req =>
        req.url().endsWith('/kouta-backend/valintaperuste') &&
        ['POST', 'PUT'].includes(req.method())
    );
    await page.route('**/kouta-backend/valintaperuste', route =>
      route.fulfill({ json: route.request().postDataJSON() })
    );

    await tallenna(page);

    const body = (await requestPromise).postDataJSON();
    expect(body.metadata.valintatavat[0].nimi).toEqual({ fi: '' });
  });

  test('Should be able to delete valintaperuste', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'amk');
      await fillKieliversiotSection(page);
      await fillTilaSection(page, 'poistettu');
      await tallenna(page);
      await confirmDelete(page);
    }));

  test("Shouldn't complain about unsaved changes for untouched amm-form", async ({
    page,
  }) => {
    await prepareTest(page, 'amm');
    await assertNoUnsavedChangesDialog(page);
  });

  test('Should complain about unsaved changes after an edit', async ({
    page,
  }) => {
    await prepareTest(page, 'amm');
    await fillKieliversiotSection(page);
    await assertUnsavedChangesDialog(page);
  });

  test("Shouldn't complain about unsaved changes for untouched amk-form", async ({
    page,
  }) => {
    await prepareTest(page, 'amk');
    await assertNoUnsavedChangesDialog(page);
  });

  test('Should redirect from url without organization', async ({ page }) => {
    await prepareTest(page, 'amm');
    await page.goto(`/kouta/valintaperusteet/${valintaperusteId}/muokkaus`);
    await assertURLEndsWith(
      page,
      `/kouta/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/valintaperusteet/${valintaperusteId}/muokkaus`
    );
  });
});
