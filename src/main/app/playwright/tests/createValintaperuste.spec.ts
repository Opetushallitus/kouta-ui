import { Page, expect, Locator, test } from '@playwright/test';

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
  getLabel,
  getTableInput,
  fillValintakokeetSection,
  copyPohja,
  assertTilaIs,
} from '#/playwright//playwright-helpers';
import { stubValintaperusteRoutes } from '#/playwright/stubValintaperusteRoutes';
import { ENTITY } from '#/src/constants';

const valintaperusteId = '111-222-333-444-555';

const mutationTest = wrapMutationTest(ENTITY.VALINTAPERUSTE, {
  id: valintaperusteId,
});

export const organisaatioOid = '1.1.1.1.1.1';

const fillPerustiedotSection = async (
  page: Page,
  koulutustyyppiPath: Array<string>
) =>
  withinSection(page, 'perustiedot', async section => {
    await fillKoulutustyyppiSelect(section, koulutustyyppiPath);
    await fillKieliversiotSection(page);
    await section.getByText('Yhteishaku').click();
    await fillAsyncSelect(
      section.getByTestId('kohdejoukkoSection'),
      'Korkeakoulutus'
    );
  });

const fillHakukelpoisuusSection = async (page: Page) =>
  withinSection(page, 'hakukelpoisuus', async section => {
    await typeToEditor(section, 'hakukelpoisuus');
  });

const fillLisatiedotSection = async (page: Page) =>
  withinSection(page, 'lisatiedot', async section => {
    await typeToEditor(section, 'lisatiedot');
  });

const fillJulkisuusSection = async (page: Page) =>
  withinSection(page, 'julkinen', async section => {
    await getLabel(section, 'yleiset.onJulkinen').click();
  });

const lisaaSisaltoa = async (section: Locator, tyyppi: string) => {
  await section.getByTestId('sisaltoMenuToggle').click();

  const firstItem = section.getByTestId('sisaltoMenu').first();
  if (tyyppi === 'teksti') {
    await firstItem.getByTestId('lisaaTekstia').click();
  } else if (tyyppi === 'taulukko') {
    await firstItem.getByTestId('lisaaTaulukko').click();
  }
};

const fillKuvausSection = async (
  page: Page,
  { skipNimi = false }: { skipNimi?: boolean } = {}
) =>
  withinSection(page, 'kuvaus', async section => {
    if (!skipNimi) {
      await section
        .getByTestId('nimi')
        .locator('input')
        .fill('Valintaperusteen nimi');
    }

    await typeToEditor(section.getByTestId('kuvaus'), 'Kuvaus');
    const sisalto = section.getByTestId('sisalto');
    await lisaaSisaltoa(sisalto, 'teksti');

    await typeToEditor(sisalto, 'Sisältötekstiä');

    await lisaaSisaltoa(sisalto, 'taulukko');

    await getTableInput(sisalto)
      .locator('textarea')
      .fill('solu1.1\tsolu1.2\rsolu2.1\tsolu2.2');
  });

const fillValintatapaSection = async (page: Page) =>
  withinSection(page, 'valintatavat', async section => {
    const lista = page.getByTestId('valintatapalista');
    await fillAsyncSelect(lista.getByTestId('tapa'), 'Todistusvalinta');
    await lista.getByTestId('nimi').locator('input').fill('Valintatavan nimi');
    const sisalto = lista.getByTestId('valintatapaSisalto');
    await lisaaSisaltoa(sisalto, 'teksti');
    await typeToEditor(sisalto, 'Sisältötekstiä');
    await lisaaSisaltoa(sisalto, 'taulukko');

    await getTableInput(sisalto)
      .locator('textarea')
      .fill('solu1.1\tsolu1.2\rsolu2.1\tsolu2.2');

    await typeToEditor(section.getByTestId('kynnysehto'), 'Kynnysehto');
    await section
      .getByTestId('enimmaispistemaara')
      .locator('input')
      .fill('100,02');
    await section
      .getByTestId('vahimmaispistemaara')
      .locator('input')
      .fill('10,01');
  });

test.describe('Create Valintaperuste', () => {
  test.beforeEach(async ({ page }) => {
    await stubValintaperusteRoutes(page, organisaatioOid);
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat`
    );
  });

  test('Should be able to create valintaperuste', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillOrgSection(page, organisaatioOid);
      await fillPerustiedotSection(page, ['korkeakoulutus', 'yo']);
      await fillKieliversiotSection(page);
      await fillHakukelpoisuusSection(page);
      await fillKuvausSection(page);
      await fillValintatapaSection(page);
      await fillValintakokeetSection(page, {
        withValintaperusteenKokeet: false,
      });
      await fillLisatiedotSection(page);
      await fillJulkisuusSection(page);
      await fillTilaSection(page);
      await tallenna(page);

      await expect(page).toHaveURL(
        new RegExp(
          `/kouta/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteId}/muokkaus$`
        )
      );
    }));

  // Todistaa, että validointi ylipäätään ajetaan. Kenttärekisterin oikeellisuudelle
  // ei ole muuta turvaverkkoa kuin nämä testit.
  //
  // Mitattu aukko: kun registeredFields palautti tyhjän joukon,
  // createErrorBuilderin isVisible ei tunnistanut yhtään polkua
  // validoitavaksi eikä validointi tehnyt mitään - ja kaikki kahdeksan
  // Valintaperuste-testiä menivät silti läpi. Tyhjä joukko ei ole sama kuin nil:
  // nil tarkoittaa "validoi kaikki", tyhja joukko "älä validoi mitään".
  test('Should show validation error for missing kuvaus nimi', async ({
    page,
  }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillPerustiedotSection(page, ['korkeakoulutus', 'yo']);
    await fillKieliversiotSection(page);
    await fillHakukelpoisuusSection(page);
    await fillKuvausSection(page, { skipNimi: true });
    await fillValintatapaSection(page);
    await fillValintakokeetSection(page, {
      withValintaperusteenKokeet: false,
    });
    await fillLisatiedotSection(page);
    await fillJulkisuusSection(page);
    await fillTilaSection(page);
    await tallenna(page);

    await expect(
      page
        .getByTestId('form-control_kuvaus.nimi')
        .getByText('validointivirheet.pakollisetKaannokset')
    ).toBeVisible();
  });

  // Kirjoitetaan merkki kerrallaan, EI fillillä. fill on yksi atominen toiminto, joten
  // se ei paljastaisi fokuksen menetystä näppäinpainallusten välissä.
  //
  // Jokainen näppäinpainallus muuttaa valintatavat-taulukon arvoa, mikä renderöi
  // FieldArrayn. Jos sen wrapper luodaan renderin sisällä, komponenttityyppi on joka
  // kerta uusi ja React mounttaa lapsikentät uudelleen - fokus katoaa ja loput
  // merkeistä menevät ohi.
  test('Should not lose focus while typing in valintatapa nimi', async ({
    page,
  }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillPerustiedotSection(page, ['korkeakoulutus', 'yo']);
    await fillKieliversiotSection(page);

    await withinSection(page, 'valintatavat', async () => {
      const nimi = page
        .getByTestId('valintatapalista')
        .getByTestId('nimi')
        .locator('input');

      await nimi.pressSequentially('Valintatavan nimi', { delay: 20 });
      await expect(nimi).toHaveValue('Valintatavan nimi');
    });
  });

  test('Should not copy publishing state when using existing entity as base', async ({
    page,
  }) => {
    await copyPohja(page, 'Valintaperusteen nimi');
    await fillOrgSection(page, organisaatioOid);
    await fillPerustiedotSection(page, ['korkeakoulutus', 'yo']);
    await assertTilaIs(page, 'tallennettu');
  });
});
