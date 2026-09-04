import { Page, expect } from '@playwright/test';

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
import { test } from '#/playwright/test-fixtures';
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

  // Todistaa, että kenttäkohtainen validointivirhe näkyy myös siirretyllä
  // lomakkeella. Kanava on sovittimen submitErrors -> meta.error -paikkaus
  // (formFields/Field.tsx); ilman sitä tallennus estyy oikein muttei kerro MITÄ
  // kenttää korjata.
  //
  // HUOM mitä tämä EI kata: toisin kuin Valintaperuste, SoraKuvaus ei anna
  // rekisteriä validoinnille lainkaan - validateSoraKuvausForm kutsuu
  // createErrorBuilder(values) ilman registeredFieldsia, jolloin se on nil ja
  // tarkoittaa "validoi kaikki". Tyhjä kenttärekisteri ei siis voi hiljaa lopettaa
  // tämän lomakkeen validointia niin kuin se voi Valintaperusteella. Samasta syysta
  // FieldArrayn uudelleenmounttausta ei voi testata tällä lomakkeella: SoraKuvauksen
  // lomakkeella ei ole yhtään FieldArrayta.
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

  // Kirjoitetaan merkki kerrallaan, EI fillillä: fill on yksi atominen toiminto, joten
  // se ei paljasta fokuksen menetystä näppäinpainallusten välissä. Juuri siksi koko
  // suite oli sokea FieldArrayn uudelleenmounttaukselle - kaikki apurit käyttävät fillia.
  //
  // Tällä lomakkeella ei ole FieldArrayta, mutta sama vaara koskee tavallisia kenttiä:
  // Field.tsx:n submitError-kääre on kaikkien siirrettyjen lomakkeiden kenttien tiellä,
  // ja jos sen muistiinpano hajoaa, react-final-form näkee joka renderillä uuden
  // component-propin ja mounttaa kentän uudelleen. Mitattu: muistiinpanon poistaminen
  // jättää tähän kenttään "N", kun pitäisi jäädä "Nimi merkki kerrallaan".
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
