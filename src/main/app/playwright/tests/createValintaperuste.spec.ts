import { Page, test, expect, Locator } from '@playwright/test';

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

// Dropdownin valinta voi jäädä tehottomaksi: Playwright raportoi klikkauksen
// onnistuneeksi, mutta käsittelijä ei aja - valikko jää auki eikä sisältölohkoa
// lisätä. Tämä näkyi 2 kertaa 100 ajossa, ja seuraava typeToEditor jäi odottamaan
// editoria joka ei koskaan ilmesty (60 s aikakatkaisu).
//
// Siksi tarkistetaan vaikutus lohkojen määrästä ja yritetään uudelleen. Uusinta on
// turvallinen VAIN koska ehtona on, ettei lohkoa lisätty; ilman tarkistusta toistettu
// klikkaus lisäisi tyhjän lohkon ja muuttaisi tallennettavaa runkoa. Odotetaan 3 s
// ennen uusintaa, jottei hidas lisäys tuota kahta lohkoa.
//
// 3 s on arvio, ei takuu. Jos lisäys joskus kestää kauemmin, uusinta tuottaa kaksi
// lohkoa - mutta seuraus on äänekäs, ei hiljainen: ennen luetaan kertaalleen ennen
// silmukkaa, joten lopun toHaveCount kaatuu maalitolpan siirtymisen sijaan, ja
// snapshot eroaisi joka tapauksessa. Pahin tapaus on siis hämmentävä punainen ajo,
// ei huomaamatta väärä runko. Siksi 3 s riittää; jos sitä nostaa, tämä on se
// suunta johon virhe kaatuu.
const lisaaSisaltoa = async (section: Locator, tyyppi: string) => {
  const valikkoTestId = tyyppi === 'teksti' ? 'lisaaTekstia' : 'lisaaTaulukko';

  // Luokka, ei test id: SisaltoFields antaa lohkoille test id:t, mutta teksti-lohkon
  // renderEditorField ottaa vastaan vain inputin ja pudottaa loput propsit, joten
  // tekstiSisalto ei päädy DOM:iin lainkaan. Nämä luokat ovat ne joihin testit jo
  // muutenkin tarttuvat (getEditableEditors, getTableInput).
  const sisallot = section.locator(
    tyyppi === 'teksti' ? '.Editor__' : '.TableInput__'
  );
  const ennen = await sisallot.count();
  const valinta = section
    .getByTestId('sisaltoMenu')
    .first()
    .getByTestId(valikkoTestId);

  for (let yritys = 0; yritys < 3; yritys++) {
    // Valikko voi olla jo auki edellisen tuloksettoman yrityksen jäljiltä; silloin
    // toggle sulkisi sen.
    if (!(await valinta.isVisible())) {
      await section.getByTestId('sisaltoMenuToggle').click();
    }
    await valinta.click();

    try {
      await expect(sisallot).toHaveCount(ennen + 1, { timeout: 3000 });
      return;
    } catch {
      // Lohkoa ei lisätty - yritetään uudelleen.
    }
  }

  await expect(sisallot).toHaveCount(ennen + 1);
};

const fillKuvausSection = async (page: Page) =>
  withinSection(page, 'kuvaus', async section => {
    await section
      .getByTestId('nimi')
      .locator('input')
      .fill('Valintaperusteen nimi');

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

  test('Should not copy publishing state when using existing entity as base', async ({
    page,
  }) => {
    await copyPohja(page, 'Valintaperusteen nimi');
    await fillOrgSection(page, organisaatioOid);
    await fillPerustiedotSection(page, ['korkeakoulutus', 'yo']);
    await assertTilaIs(page, 'tallennettu');
  });
});
