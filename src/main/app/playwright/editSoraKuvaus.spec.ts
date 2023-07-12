import { test } from '@playwright/test';
import { merge } from 'lodash';

import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import { fixtureJSON } from './mocks/playwright-mock-utils';
import createSoraKuvaus from './mocks/soraKuvaus';
import {
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  confirmDelete,
  assertNoUnsavedChangesDialog,
  assertURLEndsWith,
} from './playwright-helpers';
import { stubSoraKuvausRoutes } from './stubSoraKuvausRoutes';

const soraKuvaus = createSoraKuvaus();

const mutationTest = wrapMutationTest(ENTITY.SORA_KUVAUS, {
  id: soraKuvaus.id,
});

export const organisaatioOid = '1.1.1.1.1.1';

test.describe('Edit SORA-kuvaus', () => {
  test.beforeEach(async ({ page }) => {
    await stubSoraKuvausRoutes(page, organisaatioOid);

    await page.route(
      `**/sorakuvaus/${soraKuvaus.id}`,
      fixtureJSON(
        merge(soraKuvaus, {
          organisaatioOid,
        })
      )
    );
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvaus.id}/muokkaus`
    );
  });

  test('Should be able to edit SORA-Kuvaus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  test('Should be able to delete sora-kuvaus', async ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await fillTilaSection(page, 'poistettu');
      await tallenna(page);
      await confirmDelete(page);
    }));

  test("Shouldn't complain about unsaved changes for untouched form", async ({
    page,
  }) => {
    await assertNoUnsavedChangesDialog(page);
  });

  test('Should redirect from url without organization', async ({ page }) => {
    await page.goto(`/kouta/sora-kuvaus/${soraKuvaus.id}/muokkaus`);
    await assertURLEndsWith(
      page,
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/sora-kuvaus/${soraKuvaus.id}/muokkaus`
    );
  });
});
