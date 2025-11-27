import { Page, test, expect, type Locator } from '@playwright/test';
import { merge } from 'lodash';

import koulutus from '#/playwright/fixtures/koulutus';
import {
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  withinSection,
  getSection,
  assertURLEndsWith,
  assertNoUnsavedChangesDialog,
  confirmDelete,
  getEditableEditors,
} from '#/playwright/playwright-helpers';
import { fixtureJSON, mocksFromFile } from '#/playwright/playwright-mock-utils';
import { stubToteutusRoutes } from '#/playwright/stubToteutusRoutes';
import { TestiKoulutustyyppi } from '#/playwright/test-types';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

const mutationTest = wrapMutationTest(ENTITY.TOTEUTUS);

const organisaatioOid = '1.1.1.1.1.1';
const koulutusOid = '1.2.1.1.1.1';
const toteutusOid = '1.3.1.1.1.1';

const testKoulutusFields = {
  oid: koulutusOid,
  organisaatioOid: organisaatioOid,
  koulutusKoodiUri: 'koulutus_0#1',
  tarjoajat: ['1.2.2.1.1.1'],
  tila: 'julkaistu',
};

const testToteutusFields = {
  oid: toteutusOid,
  tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
  organisaatioOid: organisaatioOid,
  koulutusOid: koulutusOid,
};

const fillKuvausJaOsaamistavoitteetSection = async (section: Locator) => {
  const editors = getEditableEditors(section);

  const editor1 = editors.nth(0);
  await editor1.focus();
  await editor1.fill('Toteutuksen kuvaus');

  const editor2 = editors.nth(1);
  await editor2.focus();
  await editor2.fill('Osaamistavoitteet');
};

const prepareTest = async (page: Page, tyyppi: TestiKoulutustyyppi) => {
  await page.route(
    `**/koulutus/${koulutusOid}`,
    fixtureJSON(merge(koulutus(tyyppi), testKoulutusFields))
  );

  await page.route(
    `**/toteutus/${toteutusOid}`,
    fixtureJSON(merge(koulutus(tyyppi), testToteutusFields))
  );

  if (['lk', 'dia', 'eb'].includes(tyyppi)) {
    await mocksFromFile(page, 'lukio.mocks.json');
  }
  await page.goto(
    `/kouta/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/muokkaus`
  );
};

test.describe('Edit toteutus', () => {
  test.beforeEach(async ({ page }) => {
    await stubToteutusRoutes(page, organisaatioOid);
  });

  test('should be able to edit ammatillinen toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'amm';
      await prepareTest(page, tyyppi);
      await expect(
        getSection(page, 'hakeutumisTaiIlmoittautumistapa')
      ).toBeHidden();
      await expect(getSection(page, 'hakukohteet')).toBeVisible();
      await tallenna(page);
    }));

  test('should be able to edit tutkinnon osa toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'amm-tutkinnon-osa';
      const hakukohteetSection = getSection(page, 'hakukohteet');
      await prepareTest(page, tyyppi);
      await page.route(
        '**/kouta-backend/search/hakukohteet?*',
        fixtureJSON({
          totalCount: 0,
          result: [],
        })
      );
      await fillKieliversiotSection(page);
      await withinSection(
        page,
        'hakeutumisTaiIlmoittautumistapa',
        async section => {
          await section.getByText('yleiset.kylla').click();
          await expect(hakukohteetSection).toBeVisible();
          await section.getByText('yleiset.ei').click();
          await expect(hakukohteetSection).toBeHidden();
        }
      );
      await tallenna(page);
    }));

  test('should be able to edit korkeakoulu toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'yo';
      await prepareTest(page, tyyppi);
      await fillKieliversiotSection(page);
      await expect(
        getSection(page, 'hakeutumisTaiIlmoittautumistapa')
      ).toBeHidden();
      await expect(getSection(page, 'hakukohteet')).toBeVisible();
      await tallenna(page);
    }));

  test('should be able to edit lukio toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'lk';
      await prepareTest(page, tyyppi);
      await fillKieliversiotSection(page);
      await withinSection(page, 'description', async section => {
        await fillKuvausJaOsaamistavoitteetSection(section);
      });
      await withinSection(page, 'lukiolinjat', async section => {
        const yleislinja = section.getByLabel(
          'toteutuslomake.lukionYleislinjaValinta'
        );
        expect(yleislinja).toBeChecked();
      });
      await expect(
        getSection(page, 'hakeutumisTaiIlmoittautumistapa')
      ).toBeHidden();
      await expect(getSection(page, 'hakukohteet')).toBeVisible();
      await tallenna(page);
    }));

  test('should be able to edit tuva toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'tuva';
      await prepareTest(page, tyyppi);
      await fillKieliversiotSection(page);
      await withinSection(page, 'tiedot', async section => {
        const laajuus = section.getByLabel('toteutuslomake.laajuus');
        await expect(laajuus).toBeDisabled();
        await expect(laajuus).toHaveValue('38 viikkoa');
      });
      await expect(
        getSection(page, 'hakeutumisTaiIlmoittautumistapa')
      ).toBeHidden();
      await expect(getSection(page, 'hakukohteet')).toBeVisible();
      await tallenna(page);
    }));

  test('should be able to edit telma toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'telma';
      await prepareTest(page, tyyppi);
      await fillKieliversiotSection(page);
      await withinSection(page, 'tiedot', async section => {
        const laajuus = section.getByLabel('toteutuslomake.laajuus');
        await expect(laajuus).toBeDisabled();
        await expect(laajuus).toHaveValue('60 osaamispistettä');
      });
      await expect(
        getSection(page, 'hakeutumisTaiIlmoittautumistapa')
      ).toBeHidden();
      await expect(getSection(page, 'hakukohteet')).toBeVisible();
      await tallenna(page);
    }));

  test('should be able to edit muu ammatillinen toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'amm-muu';
      await prepareTest(page, tyyppi);
      await page.route(
        '**/kouta-backend/search/hakukohteet?*',
        fixtureJSON({
          totalCount: 0,
          result: [],
        })
      );
      await fillKieliversiotSection(page);
      await withinSection(page, 'tiedot', async section => {
        const laajuus = section.getByLabel('toteutuslomake.laajuus');
        await expect(laajuus).toBeDisabled();
        await expect(laajuus).toHaveValue('12 osaamispistettä');
      });
      await withinSection(page, 'description', async section => {
        await fillKuvausJaOsaamistavoitteetSection(section);
      });
      const hakukohteetSection = getSection(page, 'hakukohteet');
      await withinSection(
        page,
        'hakeutumisTaiIlmoittautumistapa',
        async section => {
          await section.getByText('yleiset.kylla').click();
          await expect(hakukohteetSection).toBeVisible();
        }
      );
      await tallenna(page);
    }));

  test('should be able to edit "Aikuisten perusopetus" -toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'aikuisten-perusopetus';
      await prepareTest(page, tyyppi);
      await page.route(
        '**/kouta-backend/search/hakukohteet?*',
        fixtureJSON({
          totalCount: 0,
          result: [],
        })
      );
      await fillKieliversiotSection(page);
      await withinSection(page, 'tiedot', async section => {
        const laajuus = section.getByLabel('toteutuslomake.laajuus');
        await expect(laajuus).toBeDisabled();
        await expect(laajuus).toHaveValue('13 opintopistettä');
      });
      const hakukohteetSection = getSection(page, 'hakukohteet');
      await withinSection(
        page,
        'hakeutumisTaiIlmoittautumistapa',
        async section => {
          await section.getByText('yleiset.kylla').click();
          await expect(hakukohteetSection).toBeVisible();
        }
      );
      await tallenna(page);
    }));

  test('should be able to delete toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'amm';
      await prepareTest(page, tyyppi);
      await fillKieliversiotSection(page);
      await fillTilaSection(page, 'poistettu');
      await tallenna(page);
      await confirmDelete(page);
    }));

  test("Shouldn't complain about unsaved changes for untouched form", async ({
    page,
  }) => {
    const tyyppi = 'amm';
    await prepareTest(page, tyyppi);
    await assertNoUnsavedChangesDialog(page);
  });

  test('Should redirect from url without organization', async ({ page }) => {
    await prepareTest(page, 'amm');
    await page.goto(`/kouta/toteutus/${toteutusOid}/muokkaus`);
    await assertURLEndsWith(
      page,
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/toteutus/${toteutusOid}/muokkaus`
    );
  });
});
