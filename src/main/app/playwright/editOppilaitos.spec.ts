import { test } from '@playwright/test';

import { ENTITY } from '#/src/constants';

import oppilaitos from './mocks/oppilaitos';
import { fixtureJSON } from './mocks/playwright-mock-utils';
import { stubOppilaitosRoutes } from './mocks/stubOppilaitosRoutes';
import {
  fillKieliversiotSection,
  tallenna,
  wrapMutationTest,
  assertNoUnsavedChangesDialog,
} from './playwright-helpers';

const mutationTest = wrapMutationTest(ENTITY.OPPILAITOS);

const organisaatioOid = '1.1.1.1.1.1';

test.describe('Edit oppilaitos', () => {
  test.beforeEach(async ({ page }) => {
    await stubOppilaitosRoutes(page, organisaatioOid);
    await page.route(
      `**/oppilaitos/${organisaatioOid}`,
      fixtureJSON({
        ...oppilaitos(),
        oid: organisaatioOid,
        organisaatioOid,
      })
    );
    await page.goto(`/kouta/organisaatio/${organisaatioOid}/oppilaitos`);
  });

  test('should be able to edit oppilaitos', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  test('should be able to create oppilaitos with hakijapalveluyhteystiedot', async ({
    page,
  }) => {
    await assertNoUnsavedChangesDialog(page);
  });
});
