import { Page, expect, test } from '@playwright/test';
import { sub } from 'date-fns';
import { merge } from 'lodash';

import haku from '#/playwright/fixtures/haku';
import {
  assertNoUnsavedChangesDialog,
  assertUnsavedChangesDialog,
  assertURLEndsWith,
  confirmDelete,
  fillKieliversiotSection,
  fillTilaSection,
  setFakeTime,
  tallenna,
  withinSection,
  getSection,
  wrapMutationTest,
} from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubHakuRoutes } from '#/playwright/stubHakuRoutes';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import { stubOrgPaakayttajaRights } from '../stubOrgPaakayttajaRights';

const mutationTest = wrapMutationTest(ENTITY.HAKU);

const organisaatioOid = '1.1.1.1.1.1';
const hakuOid = '2.1.1.1.1.1';

test.describe('Edit haku', () => {
  test.beforeEach(async ({ page }) => {
    await stubHakuRoutes(page, organisaatioOid);

    await page.route(
      `**/kouta-backend/haku/${hakuOid}`,
      fixtureJSON(
        merge(haku(), {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        })
      )
    );
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
  });

  test('Should be able to edit haku', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  // Kielipäätteinen kenttä poistuu rekisteristä kun välilehteä vaihdetaan tai
  // kieliversio otetaan pois, mutta kumpikaan ei tarkoita että teksti halutaan pois.
  const loadKaksikielinenHaku = async (page: Page) => {
    const kaksikielinen = merge(haku(), {
      oid: hakuOid,
      organisaatioOid: organisaatioOid,
      nimi: { fi: 'Haku', sv: 'Sökning' },
    });
    // Yhteyshenkilöt ovat fixturessa vain suomeksi, ja ruotsi mukana ollessaan ne
    // kaatavat validoinnin. Ne eivät liity tähän testiin, joten pois.
    kaksikielinen.metadata = {
      ...kaksikielinen.metadata,
      yhteyshenkilot: [],
    };

    await page.route(
      `**/kouta-backend/haku/${hakuOid}`,
      fixtureJSON(kaksikielinen)
    );
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
  };

  test('should keep the other language when the language tab is switched', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await loadKaksikielinenHaku(page);

      // Muokataan ruotsinkielistä nimeä, jotta tallennus on aito muokkaus.
      await withinSection(page, 'nimi', async section => {
        await section.getByText('yleiset.ruotsiksi').click();
        await section.locator('input').first().fill('Sökning muokattu');
      });

      await tallenna(page);
    }));

  test('should keep the text when a kieliversio is removed and added back', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await loadKaksikielinenHaku(page);

      // Ruotsin välilehdelle ENSIN, jotta nimi.sv on mountattuna ja rekisterissä.
      await withinSection(page, 'nimi', async section => {
        await section.getByText('yleiset.ruotsiksi').click();
        await expect(section.locator('input').first()).toHaveValue('Sökning');
      });

      // Ruotsi pois: FormCollapse putoaa takaisin suomeen, jolloin nimi.sv
      // purkautuu ja päätyy poistuneiden joukkoon.
      await withinSection(page, 'kieliversiot', async section => {
        await section.getByText('yleiset.ruotsi').click();
      });
      await withinSection(page, 'nimi', async section => {
        await expect(section.locator('input').first()).toHaveValue('Haku');
      });

      // Ruotsi takaisin. Välilehti pysyy suomessa, joten nimi.sv jää poistuneiden
      // joukkoon - ja silti tekstin pitää säilyä.
      await withinSection(page, 'kieliversiot', async section => {
        await section.getByText('yleiset.ruotsi').click();
      });

      await tallenna(page);
    }));

  // Erillinen aloitusajankohta pois -> koko koulutuksenAlkamiskausi-alipuu katoaa.
  // Kokonaisen alipuun katoaminen on ainoa tilanne, jossa rekisteristä poistuminen
  // näkyy rungossa: yksittäisellä kielikentällä rekisteröityjen silmukka kirjoittaa
  // arvon takaisin.
  test('should clear koulutuksenAlkamiskausi when the separate start date is switched off', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);

      await withinSection(page, 'aikataulut', async section => {
        await section
          .getByText('hakulomake.haullaErillinenAloitusajankohta')
          .click();
      });

      await tallenna(page);
    }));

  // Vastakkainen virhesuunta kuin edellisessä testissä: tyhjennetäänkö jotain mitä
  // ei pitäisi. Ei havaitse rekisterin vuotoa lomakkeiden VÄLILLÄ - samalle
  // lomakkeelle palattaessa kentät mounttaavat uudelleen ja vuoto paikkaa itsensä.
  //
  // Navigointi sovelluksen sisällä (linkki + historia), ei page.goto:lla: sivulataus
  // nollaisi JS-tilan, jolloin testi ei koskisi rekisterien siivoukseen lainkaan.
  test('should keep a discarded hide when returning to the form', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      // Piilotetaan erillinen aloitusajankohta, mutta EI tallenneta.
      await withinSection(page, 'aikataulut', async section => {
        await section
          .getByText('hakulomake.haullaErillinenAloitusajankohta')
          .click();
      });

      // Pois lomakkeelta, muutokset hyläten.
      await page.getByRole('link', { name: 'Home' }).click();
      await page
        .getByRole('button', {
          name: 'ilmoitukset.tallentamattomiaMuutoksia.jatka',
        })
        .click();

      // Odotetaan etusivulle asti ENNEN paluuta: muuten goBack ehtii ajaa ennen
      // siirtymää ja palataan väärään paikkaan.
      await expect(page).toHaveURL(/\/kouta\/\?/);

      // Takaisin lomakkeelle. Aloitusajankohtaa ei tallennettu pois, joten sen
      // pitää säilyä rungossa.
      await page.goBack();
      await expect(getSection(page, 'kieliversiot')).toBeVisible();

      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  // Taustahaku tallennuksen jälkeen ei saa muuttaa sitä, mitä seuraava tallennus
  // lähettää. Onnistunut tallennus invalidoi kyselyn (utils/afterUpdate.ts),
  // QueryResultWrapper purkaa KOKO lomakkeen, ja rekisteri rakentuu uudelleen.
  //
  // Väite: kahden peräkkäisen tallennuksen runkojen pitää olla samat. Jos rekisteri
  // jäisi väärään tilaan, toinen runko eroaisi ensimmäisestä.
  test('should send an identical payload after the post-save refetch', async ({
    page,
  }) => {
    const bodies: Array<any> = [];

    await page.route('**/kouta-backend/haku', async route => {
      const method = route.request().method();
      if (['POST', 'PUT'].includes(method)) {
        const data = route.request().postDataJSON();
        bodies.push(data);
        await route.fulfill({ json: data });
      }
    });

    // Uudelleenhaut LASKETAAN. waitForResponse ei riitä: sivun ensimmäinen haku on
    // yhä kesken kun testirunko alkaa, joten odotus täyttyisi siitä. DOMin välitilaa
    // ei katsota, koska mockit vastaavat liian nopeasti sen havaitsemiseen.
    let refetchCount = 0;
    page.on('response', response => {
      if (
        response.url().includes(`/kouta-backend/haku/${hakuOid}`) &&
        response.request().method() === 'GET'
      ) {
        refetchCount += 1;
      }
    });

    await fillKieliversiotSection(page);
    const refetchesBeforeSave = refetchCount;
    await tallenna(page);
    await expect.poll(() => bodies.length).toBe(1);

    // Taustahaun on todella tapahduttava: UUSI GET tallennuksen jälkeen.
    await expect.poll(() => refetchCount).toBeGreaterThan(refetchesBeforeSave);
    await expect(getSection(page, 'kieliversiot')).toBeVisible();

    // Sama muokkaus uudelleen. Taustahaku palauttaa alkuperäisen fixturen, jonka
    // yhteyshenkilöt ovat vain suomeksi - ilman tätä toinen tallennus kaatuisi
    // validointiin.
    await fillKieliversiotSection(page);

    await tallenna(page);
    await expect.poll(() => bodies.length).toBe(2);

    expect(bodies[1]).toEqual(bodies[0]);
  });

  // Tyhjennetty kenttä, alkuarvollinen haara. Fixturessa titteli on "titteli", joten
  // tyhjennys on aito muutos. Titteli kelpaa kohteeksi, koska sitä ei validoida
  // lainkaan - toisin kuin nimeä tai verkkosivua, joilla on ristiintarkistus.
  test('Should send an emptied translated field as an empty string', async ({
    page,
  }) => {
    // Normalisoidaan kieliversiot, jottei validointi kaadu fixturen kieliversioihin.
    await fillKieliversiotSection(page);

    const titteli = page
      .getByTestId('yhteyshenkilotSection')
      .getByRole('textbox', { name: 'yleiset.titteli' });

    await withinSection(page, 'yhteyshenkilot', async () => {
      await expect(titteli).toHaveValue('titteli');
      await titteli.fill('');
    });

    const requestPromise = page.waitForRequest(
      req =>
        req.url().endsWith('/kouta-backend/haku') &&
        ['POST', 'PUT'].includes(req.method())
    );
    await page.route('**/kouta-backend/haku', route =>
      route.fulfill({ json: route.request().postDataJSON() })
    );

    await tallenna(page);

    const body = (await requestPromise).postDataJSON();

    // TYHJÄ OLIO, EI { fi: '' }: getValuesForSaving normalisoi kokonaan tyhjän
    // käännetyn kentän muotoon {} (isEmptyTranslatedField, utils/index.ts). Tämä
    // testi vartioi siis vain sitä, että tyhjennys päätyy runkoon. Tyhjän ja
    // puuttuvan eroa vartioi editValintaperuste.spec.ts.
    expect(body.metadata.yhteyshenkilot[0].titteli).toEqual({});

    // Sisarkenttä koskematta: varmistaa että tyhjennys osui juuri tähän kenttään.
    expect(body.metadata.yhteyshenkilot[0].nimi).toEqual({ fi: 'nimi' });
  });

  test('Should be able to delete haku', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await fillTilaSection(page, 'poistettu');
      await tallenna(page);
      await confirmDelete(page);
    }));

  test("Shouldn't complain about unsaved changes for untouched form", async ({
    page,
  }) => {
    await assertNoUnsavedChangesDialog(page);
  });

  test('Should complain about unsaved changes after an edit', async ({
    page,
  }) => {
    await fillKieliversiotSection(page);
    await assertUnsavedChangesDialog(page);
  });

  test('Should redirect from url without organization', async ({ page }) => {
    await page.goto(`/kouta/haku/${hakuOid}/muokkaus`);
    await assertURLEndsWith(
      page,
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/haku/${hakuOid}/muokkaus`
    );
  });

  test('Should not be possible for oppilaitos user to add hakukohde for haku with expired liittämistakaraja', async ({
    page,
  }) => {
    await stubOrgPaakayttajaRights(page, organisaatioOid);

    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
    await expect(
      page.getByRole('button', { name: 'yleiset.liitaHakukohde' })
    ).toBeDisabled();
  });

  test('Should be possible for OPH virkailija to add hakukohde for haku with expired liittämistakaraja', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'yleiset.liitaHakukohde' })
    ).toBeEnabled();
  });

  test('Should be possible for oppilaitos user to add hakukohde for haku without expired liittämistakaraja', async ({
    page,
  }) => {
    const hakuMockData = haku();
    const takaraja = hakuMockData.hakukohteenLiittamisenTakaraja;
    const oneDayBeforeDeadline = sub(new Date(takaraja!), { days: 1 });
    await setFakeTime(page, oneDayBeforeDeadline);
    await stubOrgPaakayttajaRights(page, organisaatioOid);

    await page.route(
      `**/kouta-backend/haku/${hakuOid}`,
      fixtureJSON(
        merge(hakuMockData, {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        })
      )
    );

    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
    await expect(
      page.getByRole('button', { name: 'yleiset.liitaHakukohde' })
    ).toBeEnabled();
  });

  test('Should be possible for oppilaitos user to add hakukohde for haku if liittämistakaraja has not been set', async ({
    page,
  }) => {
    const hakuMockData = haku();
    hakuMockData.hakukohteenLiittamisenTakaraja = undefined;
    await stubOrgPaakayttajaRights(page, organisaatioOid);
    await page.route(
      `**/kouta-backend/haku/${hakuOid}`,
      fixtureJSON(
        merge(hakuMockData, {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        })
      )
    );

    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
    await expect(
      page.getByRole('button', { name: 'yleiset.liitaHakukohde' })
    ).toBeEnabled();
  });

  test('Hakukohteen liittääjäorganisaatiot osio should be visible', async ({
    page,
  }) => {
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
    await expect(
      page.getByText('hakulomake.hakukohteenliittajaorganisaatiot')
    ).toBeVisible();
  });
});
