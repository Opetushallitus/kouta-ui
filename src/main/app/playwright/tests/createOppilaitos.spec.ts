import { Page, expect } from '@playwright/test';

import oppilaitos from '#/playwright/fixtures/oppilaitosWithOnlyYhteystiedot';
import {
  fillAsyncSelect,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  withinSection,
  typeToEditor,
} from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubOppilaitosRoutes } from '#/playwright/stubOppilaitosRoutes';
import { test } from '#/playwright/test-fixtures';
import { ENTITY } from '#/src/constants';

const mutationTest = wrapMutationTest(ENTITY.OPPILAITOS);

export const organisaatioOid = '1.1.1.1.1.1';

const fillPerustiedotSection = async (
  page: Page,
  { skipWwwSivu = false }: { skipWwwSivu?: boolean } = {}
) =>
  withinSection(page, 'perustiedot', async section => {
    await section.getByTestId('opiskelijoita').locator('input').fill('1');
    await section.getByTestId('korkeakouluja').locator('input').fill('2');
    await section.getByTestId('tiedekuntia').locator('input').fill('3');
    await section.getByTestId('kampuksia').locator('input').fill('4');
    await section.getByTestId('yksikoita').locator('input').fill('5');
    await section.getByTestId('toimipisteita').locator('input').fill('6');
    await section.getByTestId('akatemioita').locator('input').fill('7');
    // Molemmat tai ei kumpaakaan: crossCheckWwwSivu (formConfigUtils.ts:10) vaatii
    // nimen jos url on annettu ja päinvastoin, joten vain toisen jättäminen tuottaisi
    // kaksi virhettä samalle kentälle eikä testi olisi deterministinen sen suhteen kumpi
    // viesti näkyy.
    if (!skipWwwSivu) {
      await section
        .getByLabel('oppilaitoslomake.wwwSivu *')
        .fill('www.verkkosivu.fi');
      await section
        .getByLabel('oppilaitoslomake.wwwSivuNimi')
        .fill('Verkkosivu fi');
    }
    await section
      .getByLabel('Youtube')
      .fill('https://www.youtube.com/user/AaltoUniversity');
  });

const fillEsittelySection = async (page: Page) =>
  withinSection(page, 'esittely', async section => {
    await typeToEditor(section, 'Esittely');
  });

const fillTietoaOpiskelustaSection = (page: Page) =>
  withinSection(page, 'tietoa', async section => {
    await fillAsyncSelect(section, 'Opintojen rahoitus');
    await typeToEditor(section, 'Tietoa');
  });

const fillHakijapalveluidenYhteystiedot = (page: Page) =>
  withinSection(page, 'hakijapalveluidenYhteystiedot', async section => {
    await section
      .getByLabel('oppilaitoslomake.yhteystiedonNimi')
      .fill('Testihakijapalvelu');
    await section.getByLabel('yleiset.postiosoite').fill('Osoite');
    await fillAsyncSelect(section.getByTestId('postinumero'), '00350');
    await section.getByLabel('yleiset.kayntiosoite').fill('Osoite');
    await fillAsyncSelect(
      section.getByTestId('kayntiosoitePostinumero'),
      '00350'
    );
    await section
      .getByLabel('yleiset.sahkoposti')
      .fill('sahkoposti@sahkoposti.fi');
    await section.getByLabel('yleiset.puhelinnumero').fill('12345');
  });

const checkYhteystiedotSection = (page: Page) =>
  withinSection(page, 'yhteystiedot', async section => {
    await expect(
      section.getByLabel('oppilaitoslomake.yhteystiedonNimi')
    ).toHaveText('Organisaatio');
    await expect(section.getByLabel('yleiset.postiosoite')).toHaveText(
      'Horonpohjantie 279, 40101 Jyväskylä'
    );
    await expect(section.getByLabel('yleiset.kayntiosoite')).toHaveText(
      'Verhonkulmala 220, 40720 Jyväskylä'
    );
    await expect(section.getByLabel('yleiset.sahkoposti')).toHaveText(
      'hakija-31832505@oph.fi'
    );
    await expect(section.getByLabel('yleiset.puhelinnumero')).toHaveText(
      '050 28144921'
    );
  });

test.describe('Create oppilaitos', () => {
  test.beforeEach(async ({ page }) => {
    await stubOppilaitosRoutes(page, organisaatioOid);
    await page.route(
      `**/oppilaitos/${organisaatioOid}`,
      fixtureJSON({
        ...oppilaitos(),
        oid: organisaatioOid,
      })
    );
    await page.goto(`/kouta/organisaatio/${organisaatioOid}/oppilaitos`);
  });

  test('should be able to create oppilaitos without hakijapalveluyhteystiedot', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await fillPerustiedotSection(page);
      await fillEsittelySection(page);
      await fillTietoaOpiskelustaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create oppilaitos with hakijapalveluyhteystiedot', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await fillPerustiedotSection(page);
      await fillEsittelySection(page);
      await checkYhteystiedotSection(page);
      await fillHakijapalveluidenYhteystiedot(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));
  // --- Siirron suojatestit ---------------------------------------------------
  //
  // Nämä kolme kirjoitettiin ENNEN Oppilaitoksen siirtoa react-final-formiin, jotta
  // ne lukitsevat nykyisen käyttäytymisen. Kaksi ensimmäistä siirtobugia (kentän
  // validointivirhe ei näkynyt, FieldArrayn kentät mounttasivat uudelleen) olivat
  // molemmat näkymättömiä vihreälle testijoukolle, ja kolmas (tyhjennetyn kentän
  // arvo) löytyi vasta rajapinnan auditoinnista.
  //
  // Oppilaitoksella ei ole yhtään FieldArrayta, joten kirjoitustesti kohdistuu
  // tavalliseen kenttään - samoin kuin SoraKuvauksella, jossa se paljasti että
  // Field.tsx:n kääreen muistiinpano on kantava rakenne joka kentälle.

  test('Should show validation error for missing wwwSivu', async ({ page }) => {
    await fillKieliversiotSection(page);
    await fillPerustiedotSection(page, { skipWwwSivu: true });
    await fillEsittelySection(page);
    await fillTietoaOpiskelustaSection(page);
    await fillTilaSection(page);
    await tallenna(page);

    await expect(
      page
        .getByTestId('form-control_perustiedot.wwwSivuUrl')
        .getByText('validointivirheet.pakollisetKaannokset')
    ).toBeVisible();
  });

  // Merkki kerrallaan, EI fillillä: fill on yksi atominen toiminto eikä paljasta
  // fokuksen menetystä näppäinpainallusten välissä.
  test('Should not lose focus while typing in wwwSivuNimi', async ({
    page,
  }) => {
    await fillKieliversiotSection(page);

    await withinSection(page, 'perustiedot', async section => {
      const nimi = section.getByLabel('oppilaitoslomake.wwwSivuNimi');
      await nimi.pressSequentially('Verkkosivun nimi', { delay: 20 });
      await expect(nimi).toHaveValue('Verkkosivun nimi');
    });
  });

  // Tyhjennetty kenttä. Kohde on hakijapalveluiden nimi kolmesta syysta: se on
  // tavallinen tekstikenttä, se on käännetty ja menee runkoon läpi
  // pickTranslationsilla (joka säilyttää tyhjän merkkijonon), ja se on
  // validateOptionalTranslatedField eli tyhjennys menee validoinnista läpi.
  // wwwSivuNimi ei kelpaisi: crossCheckWwwSivu vaatii sen jos url on annettu.
  test('Should send an emptied translated field as an empty string', async ({
    page,
  }) => {
    await fillKieliversiotSection(page);
    await fillPerustiedotSection(page);
    await fillEsittelySection(page);
    await fillHakijapalveluidenYhteystiedot(page);

    // TÄYTETÄÄN ENSIN, VASTA SITTEN TYHJENNETÄÄN. Pelkkä fill('') kentälle jota ei
    // ole koskaan asetettu ei laukaise muutosta lainkaan, jolloin arvo jää
    // asettamatta ja runkoon tulee nimi: {} - myös redux-formilla. Mitattu: testin
    // ensimmäinen versio teki juuri näin ja punasi vanhalla polulla, eli se ei
    // testannut tyhjennystä vaan täyttämättä jättämistä.
    await withinSection(
      page,
      'hakijapalveluidenYhteystiedot',
      async section => {
        const nimi = section.getByLabel('oppilaitoslomake.yhteystiedonNimi');
        await expect(nimi).toHaveValue('Testihakijapalvelu');
        await nimi.fill('');
      }
    );

    await fillTilaSection(page);

    const requestPromise = page.waitForRequest(
      req =>
        req.url().endsWith('/kouta-backend/oppilaitos') &&
        ['POST', 'PUT'].includes(req.method())
    );
    await page.route('**/kouta-backend/oppilaitos', route =>
      route.fulfill({ json: route.request().postDataJSON() })
    );

    await tallenna(page);

    const body = (await requestPromise).postDataJSON();

    // TYHJÄ OLIO, EI { fi: '' }. Tämä on luontilomake, joten kentällä ei ole
    // alkuarvoa, ja redux-formin sääntö on ettei alkuarvottoman kentän tyhjennys
    // jätä tilaan mitään (ks. Field.tsx:n withReduxFormEmptyValueRule).
    //
    // Parina tälle editValintaperuste.spec.ts lukitsee saman säännön toisen puolen:
    // siellä kentällä ON alkuarvo, jolloin runkoon lähtee { fi: '' }. Vasta yhdessä
    // ne kattavat säännön molemmat haarat.
    expect(body.metadata.hakijapalveluidenYhteystiedot.nimi).toEqual({});
  });
});
