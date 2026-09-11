import { Page, expect, test } from '@playwright/test';

import {
  fillAsyncSelect,
  fillDateTime,
  fillKieliversiotSection,
  fillOrgSection,
  fillTilaSection,
  getWrapperByLabel,
  tallenna,
  typeToEditor,
  wrapMutationTest,
  withinSection,
  fillAjankohtaFields,
  fillYhteystiedotSection,
  assertBaseTilaNotCopied,
  fillYhteystiedotWithoutVerkkosivuSection,
  fillYhteystiedotWithoutVerkkosivuTekstiSection,
  getSection,
} from '#/playwright/playwright-helpers';
import { stubHakuRoutes } from '#/playwright/stubHakuRoutes';
import { ENTITY, HAKULOMAKETYYPPI } from '#/src/constants';

const fillNimiSection = (page: Page) =>
  withinSection(page, 'nimi', async section => {
    await section.getByLabel('yleiset.nimi').fill('haun nimi');
  });

const fillKohdejoukkoSection = (page: Page) =>
  withinSection(page, 'kohdejoukko', async section => {
    const kohdejoukko = section.getByTestId('kohdejoukko');
    await kohdejoukko.getByText('Korkeakoulutus').click();
    await fillAsyncSelect(
      section.getByTestId('tarkenne'),
      'Ammatillinen opettajankoulutus'
    );
  });

const fillHakutapaSection = (page: Page) =>
  withinSection(page, 'hakutapa', async section => {
    await section.getByText('Yhteishaku').click();
  });

const fillAikatauluSection = (page: Page) =>
  withinSection(page, 'aikataulut', async section => {
    const hakuajat = section.getByTestId('hakuajat');
    await hakuajat.getByTestId('lisaaButton').click();
    await fillDateTime(hakuajat.getByTestId('alkaa'), {
      date: '02.04.2019',
      time: '10:45',
    });
    await fillDateTime(hakuajat.getByTestId('paattyy'), {
      date: '25.11.2019',
      time: '23:59',
    });
    const tulevat = section.getByTestId('tulevaisuudenaikataulu');
    await tulevat.getByTestId('lisaaButton').click();
    await fillDateTime(tulevat.getByTestId('alkaa'), {
      date: '11.10.2019',
      time: '09:05',
    });
    await fillDateTime(tulevat.getByTestId('paattyy'), {
      date: '25.12.2019',
      time: '20:30',
    });
    await section
      .getByText('hakulomake.haullaErillinenAloitusajankohta')
      .click();
    await fillAjankohtaFields(section);
    await fillDateTime(section.getByTestId('perumisenTakaraja'), {
      date: '24.12.2019',
      time: '21:20',
    });
    await fillDateTime(section.getByTestId('muokkauksenTakaraja'), {
      date: '11.12.2019',
      time: '19:15',
    });
    await fillDateTime(section.getByTestId('julkaisupaivamaara'), {
      date: '05.12.2019',
      time: '06:45',
    });
  });

const mutationTest = wrapMutationTest(ENTITY.HAKU);

const fillHakulomakeSection = (
  page: Page,
  type: HAKULOMAKETYYPPI = HAKULOMAKETYYPPI.ATARU
) =>
  withinSection(page, 'hakulomake', async section => {
    if (type === HAKULOMAKETYYPPI.ATARU) {
      await section.getByText('hakulomakeValinnat.ataru').click();
      await fillAsyncSelect(
        getWrapperByLabel(section, /^yleiset\.valitseHakulomake/),
        'Lomake 1'
      );
    } else if (type === HAKULOMAKETYYPPI.MUU) {
      await section.getByText('hakulomakeValinnat.muu').click();
      await section.getByLabel('yleiset.linkki').fill('http://example.com');
    } else {
      await section.getByText('hakulomakeValinnat.eiSahkoistaHakua').click();
      await typeToEditor(
        getWrapperByLabel(section, 'yleiset.kuvaus'),
        'hakulomake kuvaus'
      );
    }
  });

const organisaatioOid = '1.1.1.1.1.1';

test.describe('Create haku', () => {
  test.beforeEach(async ({ page }) => {
    await stubHakuRoutes(page, organisaatioOid);
    await page.goto(`/kouta/organisaatio/${organisaatioOid}/haku`);
  });

  test('Should be able to create haku with "ataru"-hakulomake', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillNimiSection(page);
      await fillKohdejoukkoSection(page);
      await fillHakutapaSection(page);
      await fillAikatauluSection(page);
      await fillHakulomakeSection(page, HAKULOMAKETYYPPI.ATARU);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('Should show validation error for verkkosivun teksti', async ({
    page,
  }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillKieliversiotSection(page);
    await fillNimiSection(page);
    await fillKohdejoukkoSection(page);
    await fillHakutapaSection(page);
    await fillAikatauluSection(page);
    await fillHakulomakeSection(page, HAKULOMAKETYYPPI.ATARU);
    await fillYhteystiedotWithoutVerkkosivuTekstiSection(page);
    await fillTilaSection(page);
    await tallenna(page);
    await expect(
      page
        .getByTestId('form-control_yhteyshenkilot[0].verkkosivuTeksti')
        .getByText('validointivirheet.pakollinen')
    ).toBeVisible();
  });

  // Epäonnistuneen tallennuksen pitää AVATA se osio, jossa virhe on, ja vierittää
  // siihen. FormCollapseGroup tekee sen, ja create-lomakkeella se on ainoa tapa nähdä
  // virhe: osiot ovat kiinni (FormCollapseGroup defaultOpen={!steps}), ja kiinni
  // olevan osion sisältö on nollakorkuinen eli Playwrightin mielestä ei näkyvissä.
  //
  // Nimi-osiota ei avata tässä testissä kertaakaan, joten väite menee läpi vain jos
  // lomake avasi sen itse.
  test('should open the section containing an error after a failed save', async ({
    page,
  }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillKieliversiotSection(page);
    // Julkaistu, koska pakollisuusvalidointi on sidottu tilaan - tallennettuna nimi
    // ei ole pakollinen eikä virhettä synny lainkaan.
    await fillTilaSection(page);

    // Nimi-osiota ei avata tässä testissä kertaakaan. Kiinni oleva osio renderöi
    // sisältönsä silti (wrapper on max-height: 0 + overflow: hidden, ei display: none),
    // joten sen sisällä oleva virheteksti on Playwrightin mielestä "visible" -
    // siksi väite on osion AUKI-TILASTA eikä tekstin näkyvyydestä.
    const nimiHeading = getSection(page, 'nimi').locator('> :first-child');
    await expect(nimiHeading).not.toHaveAttribute('open', /.*/);

    await tallenna(page);

    await expect(nimiHeading).toHaveAttribute('open', /.*/);
  });

  // Tallennusvirhe katoaa kentältä heti kirjoitettaessa. redux-form poisti sen joka
  // CHANGEssa; ilman sitä punainen reunus ja ohjeteksti jäisivät ristiriitaan syötteen
  // kanssa siihen asti että käyttäjä painaa Tallenna uudelleen.
  //
  // Osio avataan tässä nimenomaisesti, jottei testi nojaa yllä olevaan
  // automaattiavaukseen - näin punainen kertoo kummasta on kyse.
  test('should clear a field error as soon as the user types', async ({
    page,
  }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillKieliversiotSection(page);
    await fillTilaSection(page);
    await tallenna(page);

    await withinSection(page, 'nimi', async section => {
      const error = section.getByText('validointivirheet.pakollisetKaannokset');
      await expect(error).toBeVisible();

      await section.getByLabel('yleiset.nimi').fill('haun nimi');

      await expect(error).toBeHidden();
    });
  });

  test('Should show validation error for verkkosivu', async ({ page }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillKieliversiotSection(page);
    await fillNimiSection(page);
    await fillKohdejoukkoSection(page);
    await fillHakutapaSection(page);
    await fillAikatauluSection(page);
    await fillHakulomakeSection(page, HAKULOMAKETYYPPI.ATARU);
    await fillYhteystiedotWithoutVerkkosivuSection(page);
    await fillTilaSection(page);
    await tallenna(page);
    await expect(
      page
        .getByTestId('form-control_yhteyshenkilot[0].verkkosivu')
        .getByText('validointivirheet.pakollinen')
    ).toBeVisible();
  });

  test('Should be able to create haku with "muu"-hakulomake', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillNimiSection(page);
      await fillKohdejoukkoSection(page);
      await fillHakutapaSection(page);
      await fillHakulomakeSection(page, HAKULOMAKETYYPPI.MUU);
      await tallenna(page);
    }));

  test('Should be able to create haku with "ei sähköistä"-hakulomake', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillNimiSection(page);
      await fillKohdejoukkoSection(page);
      await fillHakutapaSection(page);
      await fillHakulomakeSection(page, HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA);
      await tallenna(page);
    }));

  // Merkki kerrallaan, EI fillillä: fill on yksi atominen toiminto eikä paljasta
  // fokuksen menetystä näppäinpainallusten välissä.
  //
  // Kohde on FieldArrayn sisällä oleva kenttä, mikä on olennaista: jokainen
  // näppäinpainallus muuttaa yhteyshenkilot-taulukon arvoa, mikä renderöi
  // FieldArrayn. Jos sen wrapperia ei muistettaisi (Field.tsx:n
  // memoizeComponentWrapper), React mounttaisi lapsikentät uudelleen ja fokus
  // katoaisi ensimmäisen merkin jälkeen.
  test('Should not lose focus while typing in yhteyshenkilo nimi', async ({
    page,
  }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillKieliversiotSection(page);

    await withinSection(page, 'yhteyshenkilot', async section => {
      await section
        .getByRole('button', { name: 'yleiset.lisaaYhteyshenkilo' })
        .click();

      const nimi = section.getByRole('textbox', { name: 'yleiset.nimi' });
      await nimi.pressSequentially('Yhteyshenkilon nimi', { delay: 20 });
      await expect(nimi).toHaveValue('Yhteyshenkilon nimi');
    });
  });

  test('Should not copy publishing state when using existing entity as base', async ({
    page,
  }) => {
    await assertBaseTilaNotCopied(page, 'Korkeakoulujen yhteishaku');
  });
});
