import { Page, test, expect } from '@playwright/test';

import createSoraKuvaus from '#/playwright/mocks/soraKuvaus';
import { ENTITY } from '#/src/constants';

import { stubSoraKuvausRoutes } from './mocks/stubSoraKuvausRoutes';
import {
  fillAsyncSelect,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  withinSection,
  fillOrgSection,
  fillKoulutustyyppiSelect,
  typeToEditor,
  assertBaseTilaNotCopied,
} from './playwright-helpers';

const soraKuvaus = createSoraKuvaus();

const mutationTest = wrapMutationTest(ENTITY.SORA_KUVAUS, {
  id: soraKuvaus.id,
});

export const organisaatioOid = '1.1.1.1.1.1';

const fillKoulutustyyppiSection = async (
  page: Page,
  koulutustyyppiPath: Array<string>
) =>
  withinSection(page, 'koulutustyyppi', async section => {
    await fillKoulutustyyppiSelect(section, koulutustyyppiPath);
    await fillAsyncSelect(
      page.getByTestId('koulutusala'),
      'Arkkitehtuuri ja rakentaminen'
    );

    await fillAsyncSelect(
      page.getByTestId('koulutukset'),
      'Rakennusarkkitehti (AMK)'
    );
  });

const fillTiedotSection = async (page: Page) =>
  withinSection(page, 'tiedot', async section => {
    await section.getByTestId('nimi').locator('input').fill('Nimi');
    await typeToEditor(section.getByTestId('kuvaus'), 'Kuvaus');
  });

test.describe('Create SORA-kuvaus', () => {
  test.beforeEach(async ({ page }) => {
    await stubSoraKuvausRoutes(page, organisaatioOid);
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/kielivalinnat/`
    );
  });

  test('Should be able to create sora-kuvaus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillOrgSection(page, organisaatioOid);
      await fillKoulutustyyppiSection(page, ['amm']);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);

      await expect(page).toHaveURL(
        new RegExp(
          `/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvaus.id}/muokkaus$`
        )
      );
    }));

  test('Should not copy publishing state when using existing entity as base', async ({
    page,
  }) => {
    await assertBaseTilaNotCopied(page, 'Sorakuvauksen nimi');
  });
});
