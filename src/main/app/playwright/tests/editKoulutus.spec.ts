import { expect, Page } from '@playwright/test';
import { merge } from 'lodash';

import koulutus from '#/playwright/fixtures/koulutus';
import {
  assertNoUnsavedChangesDialog,
  assertUnsavedChangesDialog,
  assertURLEndsWith,
  confirmDelete,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  typeToEditor,
  wrapMutationTest,
} from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubKoulutusRoutes } from '#/playwright/stubKoulutusRoutes';
import { test } from '#/playwright/test-fixtures';
import { TestiKoulutustyyppi } from '#/playwright/test-types';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

const mutationTest = wrapMutationTest(ENTITY.KOULUTUS);

const organisaatioOid = '1.1.1.1.1.1';
const koulutusOid = '1.2.3.4.5.6';

const testKoulutusFields = {
  oid: koulutusOid,
  organisaatioOid: organisaatioOid,
  tarjoajat: ['1.1.1.1.1.1', '1.2.1.1.1.1'],
};

const prepareTest = async (
  page: Page,
  tyyppi: TestiKoulutustyyppi,
  opts: { loadPage?: boolean } = {}
) => {
  await page.route(
    `**/kouta-backend/koulutus/${koulutusOid}`,
    fixtureJSON(merge(koulutus(tyyppi), testKoulutusFields))
  );
  if (opts?.loadPage) {
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
    );
  }
};

test.describe('Edit koulutus', () => {
  test.beforeEach(async ({ page }) => {
    await stubKoulutusRoutes(page, organisaatioOid);

    await page.route(`**/koulutus/${koulutusOid}/toteutukset`, fixtureJSON([]));
    await page.route('**/toteutus/list**', fixtureJSON([]));
    await page.route('**/search/koulutus/**', fixtureJSON([]));
  });

  test('Should be able to edit ammatillinen koulutus', async ({
    page,
  }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'amm', { loadPage: true });
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  test('Should be able to edit AMK-koulutus', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'amk', { loadPage: true });
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  test('Should be able to edit ammatillinen ope-, erityisope- ja opokoulutus', async ({
    page,
  }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'amm-ope-erityisope-ja-opo', { loadPage: true });
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  test('Should be able to edit lukiokoulutus', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'lk', { loadPage: true });
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  test('Should be able to edit TUVA-koulutus', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'tuva', { loadPage: true });
      await fillKieliversiotSection(page);
      await page
        .getByTestId('linkkiEPerusteisiinInput')
        .locator('input')
        .fill('http://testilinkki.fi');
      await tallenna(page);
    }));

  // --- Siirron suojatestit -------------------------------------------------
  //
  // Kirjoitettu ja ajettu vanhalla polulla ensin, jotta ne lukitsevat nykyisen
  // käyttäytymisen. Koulutuksen FieldArrayt sisältävät vain selectejä, joten
  // kirjoitustesti kohdistuu tavalliseen kenttään - samoin kuin SoraKuvauksella ja
  // Oppilaitoksella.
  //
  // Kohteena linkkiEPerusteisiin: tavallinen tekstikenttä, käännetty, menee runkoon
  // läpi pickTranslationsilla, eikä sitä validoida lainkaan.

  // Merkki kerrallaan, EI fillillä: fill on yksi atominen toiminto eikä paljasta
  // fokuksen menetystä näppäinpainallusten välissä.
  test('should not lose focus while typing in linkkiEPerusteisiin', async ({
    page,
  }) => {
    await prepareTest(page, 'tuva', { loadPage: true });

    const linkki = page
      .getByTestId('linkkiEPerusteisiinInput')
      .locator('input');

    await linkki.pressSequentially('http://linkki.example', { delay: 20 });
    await expect(linkki).toHaveValue('http://linkki.example');
  });

  // Tyhjennetty kenttä päätyy runkoon tyhjänä. Täytetään ensin ja tyhjennetään
  // vasta sitten, jottei testi mittaa täyttämättä jättämistä.
  //
  // Odotus {} eikä { fi: '' }: Koulutuksen footer rakentaa rungon rekisterin avulla,
  // ja getValuesForSaving normalisoi kokonaan tyhjän käännetyn kentän (utils/
  // index.ts:351). Sama kuin Haulla ja Toteutuksella.
  test('should send an emptied translated field as empty', async ({ page }) => {
    await prepareTest(page, 'tuva', { loadPage: true });
    await fillKieliversiotSection(page);

    const linkki = page
      .getByTestId('linkkiEPerusteisiinInput')
      .locator('input');

    await linkki.fill('http://testilinkki.fi');
    await expect(linkki).toHaveValue('http://testilinkki.fi');
    await linkki.fill('');

    const requestPromise = page.waitForRequest(
      req =>
        req.url().endsWith('/kouta-backend/koulutus') &&
        ['POST', 'PUT'].includes(req.method())
    );
    await page.route('**/kouta-backend/koulutus', route =>
      route.fulfill({ json: route.request().postDataJSON() })
    );

    await tallenna(page);

    const body = (await requestPromise).postDataJSON();
    expect(body.metadata.linkkiEPerusteisiin).toEqual({});
  });

  test('Should be able to edit TELMA-koulutus', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'telma', {
        loadPage: true,
      });
      await fillKieliversiotSection(page);
      await typeToEditor(
        page.getByTestId('kuvausInput'),
        'Kuvausta on muokattu'
      );
      await tallenna(page);
    }));

  test('Should be able to edit "Vapaa Sivistystyö - Opistovuosi"-koulutus', async ({
    page,
  }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'vapaa-sivistystyo-opistovuosi', {
        loadPage: true,
      });
      await page
        .getByTestId('linkkiEPerusteisiinInput')
        .locator('input')
        .fill('http://testilinkki.fi');
      await tallenna(page);
    }));

  test('Should be able to edit "Vapaa Sivistystyö - Muu"-koulutus', async ({
    page,
  }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'vapaa-sivistystyo-muu', {
        loadPage: true,
      });
      await page
        .getByTestId('linkkiEPerusteisiinInput')
        .locator('input')
        .fill('http://testilinkki.fi');
      await tallenna(page);
    }));

  test('Should be able to edit "Aikuisten perusopetus" -koulutus', async ({
    page,
  }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'aikuisten-perusopetus', {
        loadPage: true,
      });
      await page
        .getByTestId('linkkiEPerusteisiinInput')
        .locator('input')
        .fill('http://testilinkki.fi');
      await tallenna(page);
    }));

  test('Should be able to edit muu ammatillinen koulutus', async ({
    page,
  }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'amm-muu', {
        loadPage: true,
      });
      await typeToEditor(
        page.getByTestId('kuvausInput'),
        'Kuvausta on muokattu'
      );
      await tallenna(page);
    }));

  test('Should be able to delete koulutus', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, 'amm-muu', {
        loadPage: true,
      });
      await fillKieliversiotSection(page);
      await fillTilaSection(page, 'poistettu');
      await tallenna(page);
      await confirmDelete(page);
    }));

  test("Shouldn't complain about unsaved changes for untouched form", async ({
    page,
  }) => {
    await prepareTest(page, 'amm', { loadPage: true });
    await assertNoUnsavedChangesDialog(page);
  });

  test('Should complain about unsaved changes after an edit', async ({
    page,
  }) => {
    await prepareTest(page, 'amm', { loadPage: true });
    await fillKieliversiotSection(page);
    await assertUnsavedChangesDialog(page);
  });

  test('Should redirect from url without organization', async ({ page }) => {
    await prepareTest(page, 'amm', { loadPage: true });
    await page.goto(`/kouta/koulutus/${koulutusOid}/muokkaus`);
    await assertURLEndsWith(
      page,
      `/kouta/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/koulutus/${koulutusOid}/muokkaus`
    );
  });
});
