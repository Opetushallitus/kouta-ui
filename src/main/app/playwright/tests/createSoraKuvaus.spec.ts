import { Page, expect, test } from '@playwright/test';

import createSoraKuvaus from '#/playwright/fixtures/soraKuvaus';
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
} from '#/playwright/playwright-helpers';
import { stubSoraKuvausRoutes } from '#/playwright/stubSoraKuvausRoutes';
import { ENTITY } from '#/src/constants';

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

const fillTiedotSection = async (
  page: Page,
  { skipNimi = false }: { skipNimi?: boolean } = {}
) =>
  withinSection(page, 'tiedot', async section => {
    if (!skipNimi) {
      await section.getByTestId('nimi').locator('input').fill('Nimi');
    }
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

  // Todistaa, että kenttäkohtainen validointivirhe näkyy kentän kohdalla eikä vain
  // virheilmoituksena: ilman sitä tallennus estyy oikein muttei kerro MITÄ kenttää
  // korjata, ja juuri se kanava on kirjastojen välillä eri.
  //
  // EI kata tyhjän kenttärekisterin vaikutusta: validateSoraKuvausForm kutsuu
  // createErrorBuilder(values) ilman registeredFieldsia, eli "validoi kaikki".
  test('Should show validation error for missing nimi', async ({ page }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillKoulutustyyppiSection(page, ['amm']);
    await fillKieliversiotSection(page);
    await fillTiedotSection(page, { skipNimi: true });
    await fillTilaSection(page);
    await tallenna(page);

    await expect(
      page
        .getByTestId('form-control_tiedot.nimi')
        .getByText('validointivirheet.pakollisetKaannokset')
    ).toBeVisible();
  });

  // Merkki kerrallaan, EI fillillä: fill on yksi atominen toiminto eikä paljasta
  // fokuksen menetystä näppäinpainallusten välissä. Tällä lomakkeella ei ole
  // FieldArrayta, mutta Field.tsx:n submitError-wrapper on kaikkien kenttien tiellä:
  // jos sen memoisointi hajoaa, kenttä mounttaa uudelleen ja siihen jää "N".
  test('Should not lose focus while typing in nimi', async ({ page }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillKoulutustyyppiSection(page, ['amm']);
    await fillKieliversiotSection(page);

    await withinSection(page, 'tiedot', async section => {
      const nimi = section.getByTestId('nimi').locator('input');
      await nimi.pressSequentially('Nimi merkki kerrallaan', { delay: 20 });
      await expect(nimi).toHaveValue('Nimi merkki kerrallaan');
    });
  });

  test('Should not copy publishing state when using existing entity as base', async ({
    page,
  }) => {
    await assertBaseTilaNotCopied(page, 'Sorakuvauksen nimi');
  });
});
