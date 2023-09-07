import { Page, test, expect } from '@playwright/test';

import {
  fillAsyncSelect,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  withinSection,
  typeToEditor,
} from '#/playwright/playwright-helpers';
import { stubOppilaitosRoutes } from '#/playwright/stubOppilaitosRoutes';
import { ENTITY } from '#/src/constants';

const mutationTest = wrapMutationTest(ENTITY.OPPILAITOS);

export const organisaatioOid = '1.1.1.1.1.1';

const fillPerustiedotSection = async (page: Page) =>
  withinSection(page, 'perustiedot', async section => {
    await section.getByTestId('opiskelijoita').locator('input').fill('1');
    await section.getByTestId('korkeakouluja').locator('input').fill('2');
    await section.getByTestId('tiedekuntia').locator('input').fill('3');
    await section.getByTestId('kampuksia').locator('input').fill('4');
    await section.getByTestId('yksikoita').locator('input').fill('5');
    await section.getByTestId('toimipisteita').locator('input').fill('6');
    await section.getByTestId('akatemioita').locator('input').fill('7');
    await section
      .getByLabel('oppilaitoslomake.wwwSivu *')
      .fill('www.verkkosivu.fi');
    await section
      .getByLabel('oppilaitoslomake.wwwSivuNimi')
      .fill('Verkkosivu fi');
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
});
