import { Page, expect } from '@playwright/test';
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
import { test } from '#/playwright/test-fixtures';
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

  // B3 ja B4: kielivälilehdet. Kielipäätteinen kenttä poistuu rekisteristä aina kun
  // välilehteä vaihdetaan tai kieliversio otetaan pois, mutta kumpikaan EI tarkoita
  // että teksti halutaan poistaa. Mittasimme, että tämä on täysin kattamatta: kun
  // unregistered-silmukalta poistaa kielipäätteen typistyksen, kaikki 132 testiä
  // menevät yhä läpi.
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

      // Vaihto ruotsiin purkaa nimi.fi:n ja mounttaa nimi.sv:n. Muokataan vielä
      // ruotsinkielistä nimeä, jotta tallennus on aito muokkaus.
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

      // Ruotsinkieliselle välilehdelle ENSIN, jotta nimi.sv on oikeasti mountattuna
      // ja rekisterissä. Ilman tätä koko testi ei koskettaisi sitä polkua jota se
      // väittää suojaavansa: oletusvälilehti on suomi, eikä poistuvaa kenttää ole.
      await withinSection(page, 'nimi', async section => {
        await section.getByText('yleiset.ruotsiksi').click();
        await expect(section.locator('input').first()).toHaveValue('Sökning');
      });

      // Ruotsi pois kieliversioista. FormCollapse huomaa, ettei nykyinen kieli ole
      // enää listalla, ja putoaa takaisin suomeen - jolloin nimi.sv purkautuu ja
      // päätyy poistuneiden joukkoon.
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

  // B1 Haku-footerille. Kolmella muulla rungon rakentavalla footerilla on jo testi,
  // jossa piilotettu kenttä tyhjennetään; Haulta se puuttui kokonaan.
  //
  // Erillinen aloitusajankohta pois -> koko koulutuksenAlkamiskausi-alipuu katoaa
  // näytöltä. Juuri tällainen kokonaisen alipuun katoaminen on ainoa tilanne, jossa
  // rekisteristä poistuminen näkyy rungossa: yksittäisen kielikentän kohdalla
  // rekisteröityjen silmukka kirjoittaa arvon takaisin.
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

  // Tallentamattomien muutosten hylkääminen ja paluu. HUOM: tämä ei ole suunnitelman
  // B6 vaikka siitä lähti liikkeelle. B6 vaatii vuodon havaitsemista lomakkeiden
  // VÄLILLÄ, ja samalle lomakkeelle palattaessa kentät mounttaavat uudelleen ja
  // poistuvat listalta molemmissa rekistereissä - vuoto paikkaa itsensä. Mitattu:
  // tämä testi ei punaa millään kolmesta rekisteririkosta. Oikea B6 vaatii siirtymän
  // toisen entiteetin lomakkeelle. Nimetty sen mukaan mitä testi todella tekee.
  //
  // Testaa VASTAKKAISTA virhesuuntaa kuin
  // yllä oleva B1: ei sitä jääkö tyhjentäminen tekemättä, vaan sitä tyhjennetäänkö
  // jotain mitä ei pitäisi. Se on vaarallisempi suunta - siinä katoaa julkaistua
  // dataa - ja sitä mittaa tällä hetkellä vain yksi testi koko suitessa.
  //
  // Navigointi tehdään sovelluksen sisällä (linkki + selaimen historia), ei
  // page.goto:lla. Sivulataus nollaisi kaiken JS-tilan, jolloin testi ei koskisi
  // rekisterien siivoukseen lainkaan.
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

      // Odotetaan etusivulle asti ENNEN paluuta. Ilman tätä goBack ehtii ajaa
      // ennen kuin siirtymä etusivulle on tapahtunut, jolloin palataan väärään
      // paikkaan eikä lomake renderöidy lainkaan.
      await expect(page).toHaveURL(/\/kouta\/\?/);

      // Takaisin lomakkeelle. Aloitusajankohta on jälleen näytöllä eikä sitä ole
      // tallennettu pois, joten sen pitää säilyä rungossa.
      await page.goBack();
      await expect(getSection(page, 'kieliversiot')).toBeVisible();

      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  // B7: taustahaku tallennuksen jälkeen ei saa muuttaa sitä, mitä seuraava
  // tallennus lähettää.
  //
  // Onnistunut tallennus kutsuu afterUpdatea, joka invalidoi kyselyn
  // (utils/afterUpdate.ts:15). QueryResultWrapper menee silloin isFetching-tilaan
  // ja purkaa KOKO lomakkeen, jolloin destroyOnUnmount tyhjentää rekisterin ja
  // kentät rekisteröityvät uudelleen. Se on yksi kolmesta kohdasta, joissa uuden
  // rekisterin piti toistaa redux-formin käyttäytyminen, eikä sille ollut suoraa
  // testia.
  //
  // Väite on suora: kahden peräkkäisen tallennuksen runkojen pitää olla samat.
  // Jos rekisteri jäisi taustahaun jäljiltä väärään tilaan - vanhoja poistuneita
  // jäljellä tai kentät rekisteröimättä - toinen runko eroaisi ensimmäisestä.
  // Tämä on vahvempi väite kuin snapshot: se vertaa ajon sisällä eikä tallennettuun
  // tiedostoon.
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

    // Uudelleenhaut LASKETAAN, eikä vain odoteta yhtä. waitForResponse ei riitä:
    // sivun ensimmäinen haku on yhä kesken kun testirunko alkaa, joten odotus
    // täyttyisi siitä eikä tallennuksen laukaisemasta hausta. Mitattu - sillä
    // toteutuksella testi meni läpi myös silloin, kun afterUpdaten invalidointi
    // poistettiin kokonaan.
    //
    // Lasketaan pyyntöjä eikä katsota DOMin välitilaa: mockit vastaavat
    // välittömästi, joten purkautumisen ja uudelleenrakentumisen välinen hetki voi
    // olla liian lyhyt havaittavaksi.
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

    // Sama muokkaus uudelleen. Mock palauttaa taustahaussa alkuperäisen fixturen,
    // jossa on ruotsi mukana, ja sen yhteyshenkilöt ovat vain suomeksi - ilman tätä
    // toinen tallennus kaatuisi validointiin eikä lähtisi lainkaan. Muokkaus on
    // identtinen ensimmäisen kanssa, joten runkojen pitää yhä vastata toisiaan.
    await fillKieliversiotSection(page);

    await tallenna(page);
    await expect.poll(() => bodies.length).toBe(2);

    expect(bodies[1]).toEqual(bodies[0]);
  });

  // Tyhjennetty kenttä, alkuarvollinen haara. Fixturessa titteli on "titteli", joten
  // tyhjennys on aito muutos eikä täyttämättä jättämistä.
  //
  // Titteli kelpaa kolmesta syystä: tavallinen tekstikenttä, käännetty ja menee
  // runkoon läpi pickTranslationsilla (joka säilyttää tyhjän merkkijonon), eikä sitä
  // validoida lainkaan - toisin kuin nimeä tai verkkosivua, joilla on ristiintarkistus.
  //
  // Haku on ensimmäinen siirrettävä lomake jonka footer RAKENTAA rungon rekisterin
  // avulla, joten tämä testi vartioi juuri sitä polkua.
  test('Should send an emptied translated field as an empty string', async ({
    page,
  }) => {
    // Kuten muutkin tallentavat testit tässä tiedostossa: normalisoidaan
    // kieliversiot, jottei validointi kaadu fixturen kieliversioihin.
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

    // TYHJÄ OLIO, EI { fi: '' }. getValuesForSaving normalisoi kokonaan tyhjän
    // käännetyn kentän muotoon {} (utils/index.ts:351, isEmptyTranslatedField), eli
    // rungon rakentava footer HÄVITTÄÄ tyhjän merkkijonon ja puuttuvan arvon eron
    // tarkoituksella. Siksi tämä testi vartioi sitä, että tyhjennys YLIPÄÄTÄÄN
    // päätyy runkoon - ei sitä miten tyhjä esitetaan.
    //
    // Merkkijonon ja puuttuvan eroa vartioi editValintaperuste.spec.ts, jonka footer
    // ei rakenna runkoa rekisterin avulla eikä siten normalisoi.
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
