import { expect, Page } from '@playwright/test';

import oppilaitoksenOsa from '#/playwright/fixtures/oppilaitoksenOsa';
import {
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  withinSection,
  wrapMutationTest,
} from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubOppilaitoksenOsaRoutes } from '#/playwright/stubOppilaitoksenOsaRoutes';
import { test } from '#/playwright/test-fixtures';
import { ENTITY } from '#/src/constants';

// Oppilaitoksen osa oli haaran ainoa lomake ilman yhtään selaintestiä, eikä sitä
// siksi voinut siirtää todennettavasti: kaikki kuusi kirjastotason vikaa löytyivät
// oikeaa lomaketta ajamalla, eikä yksikään niistä olisi näkynyt koodia lukemalla.
//
// Backend-polku on "oppilaitoksen-osa" eikä entiteetin nimi pienellä, joten
// wrapMutationTest saa sen urlPathina.
const mutationTest = wrapMutationTest(ENTITY.OPPILAITOKSEN_OSA, {
  urlPath: 'oppilaitoksen-osa',
});

const organisaatioOid = '1.2.246.562.10.594252633210';

const loadForm = async (page: Page) => {
  await page.route(
    `**/oppilaitoksen-osa/${organisaatioOid}`,
    fixtureJSON({
      ...oppilaitoksenOsa(),
      oid: organisaatioOid,
      organisaatioOid,
      lastModified: '2019-04-01T13:01',
    })
  );
  await page.goto(`/kouta/organisaatio/${organisaatioOid}/oppilaitoksen-osa`);
};

const kampusInput = (page: Page) => page.getByTestId('kampus').locator('input');

test.describe('Edit oppilaitoksen osa', () => {
  test.beforeEach(async ({ page }) => {
    await stubOppilaitoksenOsaRoutes(page, organisaatioOid);
  });

  test('should be able to edit oppilaitoksen osa', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await loadForm(page);
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  // --- Siirron suojatestit ---------------------------------------------------

  test('should show validation error for missing wwwSivu', async ({ page }) => {
    await loadForm(page);
    await fillKieliversiotSection(page);

    // Molemmat tyhjäksi: crossCheck-tyyppinen ristiriita vaatisi nimen jos url on
    // annettu, joten vain toisen tyhjentäminen tuottaisi eri virheen.
    await withinSection(page, 'perustiedot', async section => {
      await section.getByLabel('oppilaitoslomake.wwwSivu *').fill('');
      await section.getByLabel('oppilaitoslomake.wwwSivuNimi').fill('');
    });

    await fillTilaSection(page);
    await tallenna(page);

    await expect(
      page
        .getByTestId('form-control_perustiedot.wwwSivuUrl')
        .getByText('validointivirheet.pakollisetKaannokset')
    ).toBeVisible();
  });

  // UrlInput lisää puuttuvan http://-etuliitteen kirjoittamalla e.target.valueen ja
  // kutsumalla sitten onBluria. Se toimii vain, jos blur voi MUUTTAA kentän arvoa -
  // redux-formin BLUR-semantiikka, jota react-final-formissa ei ole. Field.tsx
  // toistaa sen; ilman sitä etuliite katoaa hiljaa.
  //
  // Tämä testi kirjoittaa osoitteen ILMAN protokollaa. Pelkkä runkosnapshot ei riitä:
  // fixturen wwwSivu sisältää jo http://-alkuisen arvon, joka menee läpi
  // koskemattomana, joten snapshot on sama kumminkin. Mitattu: blur-säännön poisto
  // läpäisi kaikki neljä testiä ennen tätä.
  test('should add the missing url protocol on blur', async ({ page }) => {
    await loadForm(page);
    await fillKieliversiotSection(page);

    await withinSection(page, 'perustiedot', async section => {
      await section.getByLabel('oppilaitoslomake.wwwSivu *').fill('');
      await section
        .getByLabel('oppilaitoslomake.wwwSivu *')
        .fill('www.esimerkki.fi');
      // Fokus pois kentästä -> UrlInputin onBlur ajaa.
      await section.getByLabel('oppilaitoslomake.wwwSivuNimi').click();
    });

    const requestPromise = page.waitForRequest(
      req =>
        req.url().endsWith('/kouta-backend/oppilaitoksen-osa') &&
        ['POST', 'PUT'].includes(req.method())
    );
    await page.route('**/kouta-backend/oppilaitoksen-osa', route =>
      route.fulfill({ json: route.request().postDataJSON() })
    );

    await tallenna(page);

    const body = (await requestPromise).postDataJSON();
    expect(body.metadata.wwwSivu.url).toEqual({
      fi: 'http://www.esimerkki.fi',
    });
  });

  // Merkki kerrallaan, EI fillillä: fill on yksi atominen toiminto eikä paljasta
  // fokuksen menetystä näppäinpainallusten välissä.
  test('should not lose focus while typing in kampus', async ({ page }) => {
    await loadForm(page);

    const kampus = kampusInput(page);
    await kampus.fill('');
    await kampus.pressSequentially('Uusi kampus', { delay: 20 });
    await expect(kampus).toHaveValue('Uusi kampus');
  });

  // Tyhjennetty käännetty kenttä. Kampus kelpaa kolmesta syystä: tavallinen
  // tekstikenttä, käännetty ja menee runkoon läpi pickTranslationsilla, eikä sitä
  // validoida lainkaan.
  //
  // Oppilaitoksen osan footer EI rakenna runkoa kenttärekisterin avulla, joten
  // tyhjä merkkijono säilyy - toisin kuin Haulla, Toteutuksella, Koulutuksella ja
  // Hakukohteella, joissa getValuesForSaving normalisoi sen muotoon {}.
  test('should send an emptied translated field as an empty string', async ({
    page,
  }) => {
    await loadForm(page);
    await fillKieliversiotSection(page);

    const kampus = kampusInput(page);
    await expect(kampus).toHaveValue('Fi kampus');
    await kampus.fill('');

    const requestPromise = page.waitForRequest(
      req =>
        req.url().endsWith('/kouta-backend/oppilaitoksen-osa') &&
        ['POST', 'PUT'].includes(req.method())
    );
    await page.route('**/kouta-backend/oppilaitoksen-osa', route =>
      route.fulfill({ json: route.request().postDataJSON() })
    );

    await tallenna(page);

    const body = (await requestPromise).postDataJSON();
    expect(body.metadata.kampus).toEqual({ fi: '' });
  });
});
