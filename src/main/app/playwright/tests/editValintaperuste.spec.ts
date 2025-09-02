import { Page, test, expect } from '@playwright/test';
import { merge } from 'lodash';

import valintaperuste from '#/playwright/fixtures/valintaperuste';
import {
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  confirmDelete,
  assertNoUnsavedChangesDialog,
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
