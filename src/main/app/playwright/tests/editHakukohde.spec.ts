import { Page, expect, test } from '@playwright/test';
import { merge } from 'lodash';

import hakukohde from '#/playwright/fixtures/hakukohde';
import {
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  withinSection,
  getRadio,
  getLabel,
  confirmDelete,
  assertNoUnsavedChangesDialog,
  assertUnsavedChangesDialog,
  setFakeTime,
} from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import {
  prepareHakukohdeTest,
  valintaperusteId,
  toteutusOid,
} from '#/playwright/prepareHakukohdeTest';
import { selectedToimipisteNimi } from '#/playwright/stubHakukohdeRoutes';
import { stubKayttoOikeusOmatTiedot } from '#/playwright/stubKayttoOikeusOmatTiedot';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

// Klikataan radiota ja varmistetaan että valinta meni perille.
//
// Aiemmin tässä klikattiin pelkkää toimipisteen nimeä. JarjestyspaikkaRadioGroup
// renderöi <Spin /> niin kauan kuin vaihtoehdot latautuvat, joten nimi saattoi osua
// johonkin muuhun kuin radion labeliin - klikkaus meni tyhjään eikä arvo asettunut.
// Tallennus lähti silti, ja jarjestyspaikkaOid puuttui rungosta. Se oli noin 18 %:n
// flakejen syy; se EI ollut sovelluksen bugi eikä rekisteröinnin ajoitus, vaikka
// molempia epäiltiin. Instrumentointi tallennushetkellä näytti kentän olevan
// rekisterissä molemmissa rekistereissä ja arvon olevan null.
const fillJarjestyspaikkaSection = (page: Page) =>
  withinSection(page, 'jarjestyspaikka', async section => {
    const radio = getRadio(section, tarjoajat[0]);

    // Odotetaan että radio on olemassa: osio renderöi <Spin />:n niin kauan kuin
    // vaihtoehdot latautuvat, eikä klikkaus sitä ennen osu mihinkään.
    await expect(radio).toBeAttached();

    // Klikataan LABELIA, ja toistetaan kunnes valinta on perillä.
    //
    // Kolme väärää yritystä matkan varrella, jotka kannattaa tietää ettei niitä
    // yritetä uudelleen: pelkkä getByText(nimi) saattoi osua muuhunkin kuin
    // labeliin; radion check({ force: true }) ei laukaise Reactin onChangea, koska
    // input on tyylitelty piiloon; ja kertaklikkaus labeliin jäi yhä toisinaan
    // menemättä perille, koska osio renderöityy uudelleen vaihtoehtojen latauduttua
    // ja klikkaus voi osua vaihdon hetkeen.
    //
    // Toisto on tässä oikea ratkaisu eikä laastari: kyse on aidosti
    // uudelleenrenderöityvästä käyttöliittymästä, jossa yksittäinen klikkaus ei ole
    // luotettava primitiivi.
    await expect
      .poll(
        async () => {
          if (!(await radio.isChecked())) {
            await getLabel(section, selectedToimipisteNimi).click();
          }
          return radio.isChecked();
        },
        { timeout: 15000 }
      )
      .toBe(true);
  });

const organisaatioOid = '1.2.246.562.10.52251087186'; // Stadin ammatti- ja aikuisopisto
const hakuOid = '4.1.1.1.1.1';
const hakukohdeOid = '1.2.3.4.5.6';
const tarjoajat = [
  '1.2.246.562.10.45854578546', // Stadin ammatti- ja aikuisopisto, Myllypuron toimipaikka
];

const loadHakukohdePage = async (page: Page) => {
  await page.route(
    `**/hakukohde/${hakukohdeOid}`,
    fixtureJSON(
      merge(hakukohde(), {
        toteutusOid,
        hakuOid,
        organisaatioOid,
        oid: hakukohdeOid,
        valintaperusteId,
      })
    )
  );
  await page.goto(
    `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
  );
};

const stubOppilaitosRights = (page: Page, orgOid = organisaatioOid) =>
  stubKayttoOikeusOmatTiedot(page, [
    {
      organisaatioOid: orgOid,
      kayttooikeudet: [
        {
          palvelu: 'KOUTA',
          oikeus: 'HAKUKOHDE_UPDATE',
        },
      ],
    },
  ]);

const mutationTest = wrapMutationTest(ENTITY.HAKUKOHDE);

test.describe('Edit hakukohde', () => {
  test('should be able to edit hakukohde', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareHakukohdeTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
      });
      await loadHakukohdePage(page);
      await fillKieliversiotSection(page);
      await fillJarjestyspaikkaSection(page);
      await tallenna(page);
    }));

  // Kentän piilottaminen ja tallennus. Näissä rekisteristä poistuneiden joukko on
  // EI-tyhjä, toisin kuin lähes kaikissa muissa tallennustesteissä - eli juuri nämä
  // testit ajavat sen koodin, joka tyhjentää dataa backendistä. Mitattu: koko
  // seurannan rikkominen punasi ilman näitä vain yhden testin 128:sta.
  test('should clear the hakukohde hakuajat when the shared haku schedule is taken into use', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareHakukohdeTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
      });
      await loadHakukohdePage(page);
      await fillKieliversiotSection(page);
      await fillJarjestyspaikkaSection(page);

      // eriHakuaika pois -> koko hakuajat.hakuajat-FieldArray katoaa näytöltä.
      // Tämä on suunnitelman 2.3:n esimerkkitapaus: vanhempi ja lapset poistuvat
      // rekisteristä samalla kertaa, ja järjestys ratkaisee lähteekö backendiin
      // null vai lista nulleja.
      await withinSection(page, 'perustiedot', async section => {
        await section
          .getByText('hakukohdelomake.hakukohteellaEriHakuaika')
          .click();
      });

      await tallenna(page);
    }));

  test('should clear the per-liite toimitusaika when a shared one is taken into use', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareHakukohdeTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
      });
      await loadHakukohdePage(page);
      await fillKieliversiotSection(page);
      await fillJarjestyspaikkaSection(page);

      // Yhteinen toimitusaika käyttöön -> liitekohtaiset toimitusaika-kentät katoavat.
      // Tämä on ainoa paikka sovelluksessa, jossa käytetään monikkomuotoa <Fields>, ja
      // juuri se ohjaa lomakkeen mutkikkainta näytä/piilota-logiikkaa.
      await withinSection(page, 'liitteet', async section => {
        const liitekohtaisetToimitusajat = section
          .getByTestId('liitelista')
          .getByTestId('toimitusaika');

        await expect(liitekohtaisetToimitusajat).not.toHaveCount(0);

        await section
          .getByText('hakukohdelomake.kaytaLiitteilleYhteistaToimitusaikaa')
          .click();

        // NÄKYVYYS, ei vain runko. Tämä on ainoa selaintason väite joka riippuu
        // <Fields>-korvikkeen PROPSIMUODOSTA: yhteinenToimitusaika luetaan
        // props-oliosta polkurakenteen mukaan (LiitteetFields.tsx:241), ja se ohjaa
        // includeToimitusaika-lippua. Väärällä muodolla luku antaisi undefinedin,
        // liitekohtaiset kentät jäisivät näkyviin - ja mitattu tosiasia on, että
        // runkosnapshotit eivät huomaa sitä: litteäksi mutatoitu korvike läpäisi
        // kaikki 26 Hakukohde-testia ennen tätä väitettä.
        await expect(liitekohtaisetToimitusajat).toHaveCount(0);
      });

      await tallenna(page);
    }));

  // --- Siirron suojatestit -------------------------------------------------
  //
  // Kirjoitettu ja ajettu vanhalla polulla ensin. Hakukohteella oli jo vahva
  // rekisterikattavuus (yhteinen toimitusaika, hakuaikojen tyhjennys, keskimmäisen
  // rivin poisto), joten lisää tarvittiin kaksi tavanomaista.

  // Merkki kerrallaan, EI fillillä. Kohde on liitelistan sisällä oleva kenttä, eli
  // FieldArrayn lapsi: jokainen näppäinpainallus muuttaa taulukon arvoa ja renderöi
  // FieldArrayn.
  test('should not lose focus while typing in a liite address field', async ({
    page,
  }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
    });
    await loadHakukohdePage(page);

    await withinSection(page, 'liitteet', async section => {
      const nimi = section
        .getByTestId('liitelista')
        .getByTestId('nimi')
        .locator('input')
        .first();

      await nimi.fill('');
      await nimi.pressSequentially('Liitteen nimi', { delay: 20 });
      await expect(nimi).toHaveValue('Liitteen nimi');
    });
  });

  // Tyhjennetty kenttä päätyy runkoon tyhjänä. Täytetään ensin ja tyhjennetään vasta
  // sitten, jottei testi mittaa täyttämättä jättämistä.
  test('should send an emptied liite field as empty', async ({ page }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
    });
    await loadHakukohdePage(page);
    await fillKieliversiotSection(page);
    await fillJarjestyspaikkaSection(page);

    await withinSection(page, 'liitteet', async section => {
      const nimi = section
        .getByTestId('liitelista')
        .getByTestId('nimi')
        .locator('input')
        .first();

      // Fixturessa nimi on "Nimi", joten tyhjennys on aito muutos.
      await expect(nimi).toHaveValue('Nimi');
      await nimi.fill('');
    });

    const requestPromise = page.waitForRequest(
      req =>
        req.url().endsWith('/kouta-backend/hakukohde') &&
        ['POST', 'PUT'].includes(req.method())
    );
    await page.route('**/kouta-backend/hakukohde', route =>
      route.fulfill({ json: route.request().postDataJSON() })
    );

    await tallenna(page);

    const body = (await requestPromise).postDataJSON();

    // Tyhjennetty käännetty kenttä päätyy runkoon tyhjänä oliona: rungon rakentava
    // footer normalisoi kokonaan tyhjän käännetyn kentän (utils/index.ts:351).
    // Sisarkenttä koskematta, mikä varmistaa että tyhjennys osui juuri tähän.
    expect(body.liitteet[0].nimi).toEqual({});
    expect(body.liitteet[0].kuvaus).toEqual({ fi: '<p>Kuvaus</p>' });
  });

  // Reunatapaus B8: listan KESKIMMÄISEN rivin poisto. Poistuva rivi vie kenttänsä
  // rekisteristä ja jäljelle jäävät rivit indeksoidaan uudelleen, joten pelkkä
  // "rivi katosi" ei riitä - lähtevän listan pitää sisältää juuri rivit 1 ja 3.
  test('should keep the right rows when the middle hakuaika is removed', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareHakukohdeTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
      });
      await page.route(
        `**/hakukohde/${hakukohdeOid}`,
        fixtureJSON({
          ...merge(hakukohde(), {
            toteutusOid,
            hakuOid,
            organisaatioOid,
            oid: hakukohdeOid,
            valintaperusteId,
          }),
          hakuajat: [
            { alkaa: '2011-11-11T10:30', paattyy: '2011-11-12T11:45' },
            { alkaa: '2012-12-12T10:30', paattyy: '2012-12-13T11:45' },
            { alkaa: '2013-01-13T10:30', paattyy: '2013-01-14T11:45' },
          ],
        })
      );
      await page.goto(
        `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      );

      await fillKieliversiotSection(page);
      await fillJarjestyspaikkaSection(page);

      await withinSection(page, 'perustiedot', async section => {
        const poista = section.getByRole('button', { name: 'yleiset.poista' });
        await expect(poista).toHaveCount(3);
        await poista.nth(1).click();
        await expect(poista).toHaveCount(2);
      });

      await tallenna(page);
    }));

  test('should be able to delete hakukohde', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareHakukohdeTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
      });
      await loadHakukohdePage(page);
      await fillKieliversiotSection(page);
      await fillJarjestyspaikkaSection(page);
      await fillTilaSection(page, 'poistettu');
      await tallenna(page);
      await confirmDelete(page);
    }));

  test('should be able to delete luonnos-tilainen hakukohde with hakuaika ongoing', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareHakukohdeTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
      });
      await setFakeTime(page, new Date('2011-11-11T20:30:00'));
      await loadHakukohdePage(page);
      await fillKieliversiotSection(page);
      await fillJarjestyspaikkaSection(page);
      await fillTilaSection(page, 'poistettu');
      await tallenna(page);
      await confirmDelete(page);
    }));

  test("Shouldn't complain about unsaved changes for untouched form", async ({
    page,
  }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
    });
    await loadHakukohdePage(page);
    await assertNoUnsavedChangesDialog(page);
  });

  test('Should complain about unsaved changes after an edit', async ({
    page,
  }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
    });
    await loadHakukohdePage(page);

    // Kieliversioiden täyttäminen ei riitä: fixturessa on jo pelkkä fi, joten
    // valinta ei muuta mitään eikä lomake likaannu. Käytetään kytkintä.
    await withinSection(page, 'perustiedot', async section => {
      await section
        .getByText('hakukohdelomake.hakukohteellaEriHakuaika')
        .click();
    });

    await assertUnsavedChangesDialog(page);
  });

  test('Should redirect from url without organization', async ({ page }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
    });
    await page.goto(`/kouta/hakukohde/${hakukohdeOid}/muokkaus`);
    await expect(page).toHaveURL(
      new RegExp(
        `/kouta/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/hakukohde/${hakukohdeOid}/muokkaus$`
      )
    );
  });

  test('should be possible for Oph-virkailija to update hakukohde if hakukohteen muokkaamistakaraja has expired', async ({
    page,
  }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
      hakukohteenMuokkaaminenHasExpired: true,
    });
    await loadHakukohdePage(page);
    await expect(
      page.getByRole('button', { name: 'yleiset.tallenna' })
    ).toBeEnabled();
  });

  test('should not be possible for oppilaitos user to update hakukohde if hakukohteen muokkaamistakaraja has expired', async ({
    page,
  }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
      hakukohteenMuokkaaminenHasExpired: true,
    });
    await stubOppilaitosRights(page);
    await loadHakukohdePage(page);
    const tallennaBtn = page.getByRole('button', {
      name: 'yleiset.tallenna',
    });
    await expect(tallennaBtn).toBeDisabled();
    await expect(tallennaBtn).toHaveAttribute(
      'title',
      'hakukohdelomake.muokkaamisenTakarajaYlittynyt'
    );
  });

  test('should be possible for oppilaitos user to update hakukohde if hakukohteen muokkaamistakaraja has not expired', async ({
    page,
  }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
      hakukohteenMuokkaaminenHasExpired: false,
    });
    await stubOppilaitosRights(page);
    await loadHakukohdePage(page);
    const tallennaBtn = page.getByRole('button', {
      name: 'yleiset.tallenna',
    });
    await expect(tallennaBtn).toBeEnabled();
  });

  test("should not be possible for oppilaitos user to update another organizations's hakukohde", async ({
    page,
  }) => {
    await prepareHakukohdeTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
      hakukohteenMuokkaaminenHasExpired: false,
    });
    await stubOppilaitosRights(page, '1.2.246.562.10.52251087111');
    await loadHakukohdePage(page);
    const tallennaBtn = page.getByRole('button', {
      name: 'yleiset.tallenna',
    });
    await expect(tallennaBtn).toBeDisabled();
    await expect(tallennaBtn).toHaveAttribute(
      'title',
      'hakukohdelomake.eiMuokkausOikeutta'
    );
  });
});
