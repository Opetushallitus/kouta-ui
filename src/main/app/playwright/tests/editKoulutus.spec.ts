import { test, Page } from '@playwright/test';
import { merge } from 'lodash';

import koulutus from '#/playwright/fixtures/koulutus';
import {
  assertNoUnsavedChangesDialog,
  confirmDelete,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  typeToEditor,
  wrapMutationTest,
} from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubKoulutusRoutes } from '#/playwright/stubKoulutusRoutes';
import { TestiKoulutustyyppi } from '#/playwright/test-types';
import { ENTITY } from '#/src/constants';

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
});
