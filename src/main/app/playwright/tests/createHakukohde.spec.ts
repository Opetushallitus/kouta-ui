import { Locator, Page, test, expect } from '@playwright/test';
import { merge } from 'lodash';

import koulutus from '#/playwright/fixtures/koulutus';
import toteutus from '#/playwright/fixtures/toteutus';
import valintaperuste from '#/playwright/fixtures/valintaperuste';
import {
  fillAsyncSelect,
  fillDateTime,
  fillKieliversiotSection,
  fillOrgSection,
  fillTilaSection,
  tallenna,
  typeToEditor,
  wrapMutationTest,
  withinSection,
  fillAjankohtaFields,
  getSelectByLabel,
  fillRadioValue,
  getLabel,
  assertBaseTilaNotCopied,
  fillValintakokeetSection,
} from '#/playwright/playwright-helpers';
import { fixtureJSON, mocksFromFile } from '#/playwright/playwright-mock-utils';
import {
  selectedToimipisteNimi,
  stubHakukohdeRoutes,
} from '#/playwright/stubHakukohdeRoutes';
import { stubKayttoOikeusOmatTiedot } from '#/playwright/stubKayttoOikeusOmatTiedot';
import { stubOrganisaatioRoutes } from '#/playwright/stubOrganisaatioRoutes';
import {
  Alkamiskausityyppi,
  ENTITY,
  HAKUTAPA_YHTEISHAKU_KOODI_URI,
} from '#/src/constants';

const prepareTest = async (
  page,
  {
    tyyppi,
    hakuOid,
    organisaatioOid,
    tarjoajat,
    hakutapaKoodiUri = HAKUTAPA_YHTEISHAKU_KOODI_URI,
    hakukohteenLiittaminenHasExpired = false,
    hakukohteenMuokkaaminenHasExpired = false,
    hakuWithoutTakarajat = false,
    hakuWithoutMuokkaamisenTakaraja = false,
  }
) => {
  const valintaperusteId = '649adb37-cd4d-4846-91a9-84b58b90f928';

  await mocksFromFile(page, 'hakukohde.mocks.json');

  if (tyyppi === 'lk') {
    await mocksFromFile(page, 'lukio.mocks.json');
  }

  await stubHakukohdeRoutes(page, {
    organisaatioOid,
    hakuOid,
    hakutapaKoodiUri,
    hakukohteenLiittaminenHasExpired,
    hakukohteenMuokkaaminenHasExpired,
    hakuWithoutTakarajat,
    hakuWithoutMuokkaamisenTakaraja,
    tarjoajat,
  });

  await stubOrganisaatioRoutes(page, organisaatioOid);

  await page.route(
    `**/toteutus/${toteutusOid}`,
    fixtureJSON(
      merge(toteutus({ tyyppi }), {
        oid: toteutusOid,
        organisaatioOid,
        koulutusOid: koulutusOid,
        tila: 'julkaistu',
        tarjoajat,
      })
    )
  );

  await page.route(
    `**/koulutus/${koulutusOid}`,
    fixtureJSON(
      merge(koulutus(tyyppi), {
        oid: koulutusOid,
        tarjoajat,
        organisaatioOid: organisaatioOid,
        tila: 'julkaistu',
      })
    )
  );

  await page.route(
    '**/valintaperuste/list*',
    fixtureJSON([
      merge(valintaperuste(), {
        id: valintaperusteId,
        nimi: { fi: 'Valintaperusteen nimi' },
        tila: 'julkaistu',
      }),
    ])
  );

  await page.route(
    `**/valintaperuste/${valintaperusteId}`,
    fixtureJSON(
      merge(valintaperuste(), {
        id: valintaperusteId,
        nimi: { fi: 'Valintaperusteen nimi' },
        tila: 'julkaistu',
      })
    )
  );
};

const fillLomakeFields = async (section: Locator, type: string) => {
  const lomakeFields = section.getByTestId('lomakeSection');
  await getLabel(lomakeFields, 'hakukohdelomake.eriHakulomake').click();
  if (type === 'ataru') {
    await fillRadioValue(lomakeFields, type);
    await fillAsyncSelect(lomakeFields, 'Lomake 1');
  } else if (type === 'muu') {
    await fillRadioValue(lomakeFields, type);
    await lomakeFields.getByRole('textbox').fill('http://example.com');
  } else if (type === 'ei sähköistä') {
    await fillRadioValue(lomakeFields, type);
    await typeToEditor(lomakeFields, 'hakulomake kuvaus');
  }
};

const fillHakuajatFields = async (section: Locator) => {
  const hakuajat = section.getByTestId('hakuajatSection');
  await getLabel(hakuajat, 'hakukohdelomake.hakukohteellaEriHAkuaika').click();
  await pressLisaa(hakuajat);

  await fillDateTime(hakuajat.getByTestId('alkaa'), {
    date: '02.04.2019',
    time: '10:45',
  });

  await fillDateTime(hakuajat.getByTestId('paattyy'), {
    date: '25.11.2019',
    time: '23:59',
  });
};

const fillPohjakoulutusvaatimusSection = (page: Page) =>
  withinSection(page, 'pohjakoulutus', async section => {
    await fillAsyncSelect(
      section.getByTestId('pohjakoulutusvaatimusSelect'),
      'Peruskoulu'
    );

    await typeToEditor(section, 'Tarkenne');
  });

const fillPerustiedotSection = (
  page: Page,
  {
    isLukio,
    isYhteishaku,
    fillKaksoistutkinto,
    hakukohdeKoodiNimi,
  }: {
    isLukio?: boolean;
    isYhteishaku?: boolean;
    fillKaksoistutkinto?: boolean;
    hakukohdeKoodiNimi?: string;
  } = {}
) =>
  withinSection(page, 'perustiedot', async section => {
    if (!isLukio) {
      if (hakukohdeKoodiNimi) {
        await fillAsyncSelect(
          getSelectByLabel(section, 'yleiset.nimi'),
          hakukohdeKoodiNimi
        );
      } else {
        await section.getByLabel('yleiset.nimi').fill('Hakukohteen nimi');
      }
    }

    if (fillKaksoistutkinto) {
      await getLabel(
        section,
        'hakukohdelomake.voiSuorittaaKaksoistutkinnon'
      ).click();
    }

    await fillHakuajatFields(section);
    if (isYhteishaku) {
      await expect(
        section.getByLabel('hakukohdelomake.hakukohteellaEriAlkamiskausi')
      ).toBeDisabled();
    } else {
      await getLabel(
        section,
        'hakukohdelomake.hakukohteellaEriAlkamiskausi'
      ).click();
      await fillAjankohtaFields(
        section,
        Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA
      );
    }
    await fillLomakeFields(section, 'ataru');
  });

const fillAloituspaikatSection = (page: Page, { isKorkeakoulu = false }) =>
  withinSection(page, 'aloituspaikat', async section => {
    await section.getByTestId('aloituspaikkamaara').fill('10');
    if (isKorkeakoulu) {
      await section.getByTestId('ensikertalaismaara').fill('5');
    }
  });

const fillValintaperusteenKuvausSection = (page: Page) =>
  withinSection(page, 'valintaperusteenKuvaus', async section => {
    await fillAsyncSelect(
      getSelectByLabel(section, 'hakukohdelomake.valitseVAlintaperustekuvaus'),
      'Valintaperusteen nimi'
    );
    await typeToEditor(section, 'Kynnysehto');
  });

const pressLisaa = (section: Locator) =>
  section.getByTestId('lisaaButton').click();

const fillLiitteetSection = (page: Page) =>
  withinSection(page, 'liitteet', async section => {
    await pressLisaa(section);
    const liiteLista = section.getByTestId('liitelista');

    await fillAsyncSelect(liiteLista.getByTestId('tyyppi'), 'Lausunnot');
    await section.getByTestId('nimi').locator('input').fill('Nimi');
    await typeToEditor(section.getByTestId('kuvaus'), 'Kuvaus');
    await fillDateTime(liiteLista, {
      date: '25.11.2019',
      time: '23:59',
    });
    await getLabel(
      liiteLista,
      'liitteenToimitustapaValinnat.muuOsoite'
    ).click();
    await liiteLista
      .getByLabel('yleiset.osoite')
      .locator('input')
      .first() // Osoiteella inputit "rivi1" ja "rivi2". Valitaan ensimmäinen.
      .fill('Osoite');
    await fillAsyncSelect(
      getSelectByLabel(liiteLista, 'yleiset.postinumero'),
      '00350'
    );
    await liiteLista
      .getByLabel('yleiset.sahkoposti')
      .fill('sahkoposti@email.com');
    await liiteLista
      .getByLabel('hakukohdelomake.liitteenToimitusosoiteVerkkosivu')
      .fill('example.com');
  });

const fillJarjestyspaikkaSection = (page: Page) =>
  withinSection(page, 'jarjestyspaikkaOid', async section => {
    await section.getByText(selectedToimipisteNimi).click();
  });

const fillLukiolinjatSection = (page: Page) =>
  withinSection(page, 'hakukohteenLinja', async section => {
    await section.getByText('Yleislinja').click();

    await section
      .getByLabel('hakukohdelomake.alinHyvaksyttyKeskiarvo')
      .fill('3,5');

    await typeToEditor(section, 'Lisätietoa');

    const arvosanat = section.getByLabel('hakukohdelomake.painotetutArvosanat');

    const lisaaOppiaine = arvosanat.getByRole('button', {
      name: 'hakukohdelomake.lisaaPainotettavaOppiaine',
    });

    await lisaaOppiaine.click();

    const oppiaine0 = arvosanat.getByTestId('painotettuOppiaine-0');

    await fillAsyncSelect(oppiaine0, 'A1 englanti');
    await oppiaine0.getByLabel('hakukohdelomake.painokerroin').fill('1,5');
    await lisaaOppiaine.click();

    const oppiaine1 = arvosanat.getByTestId('painotettuOppiaine-1');
    await fillAsyncSelect(oppiaine1, 'Musiikki');
    await oppiaine1.getByLabel('hakukohdelomake.painokerroin').fill('2');

    await oppiaine0.getByRole('button', { name: 'yleiset.poistaRivi' }).click();

    await expect(arvosanat.getByTestId(/^painotettuOppiaine-\d?$/)).toHaveCount(
      1
    );
  });

const organisaatioOid = '1.2.246.562.10.52251087186'; // Stadin ammatti- ja aikuisopisto
const toteutusOid = '2.1.1.1.1.1';
const koulutusOid = '3.1.1.1.1';
const hakuOid = '4.1.1.1.1.1';
const hakukohdeOid = '1.2.3.4.5.6';
const tarjoajat = [
  '1.2.246.562.10.45854578546', // Stadin ammatti- ja aikuisopisto, Myllypuron toimipaikka
];

const loadHakukohdePage = (page: Page) =>
  page.goto(
    `/kouta/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${hakuOid}/hakukohde`
  );

const mutationTest = wrapMutationTest(ENTITY.HAKUKOHDE, { oid: hakukohdeOid });

test.describe('Create hakukohde', () => {
  test('Should be able to create ammatillinen hakukohde', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, {
        tyyppi: 'amm',
        hakuOid,
        organisaatioOid,
        tarjoajat,
      });
      await loadHakukohdePage(page);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillPohjakoulutusvaatimusSection(page);
      await fillPerustiedotSection(page, {
        fillKaksoistutkinto: true,
        hakukohdeKoodiNimi: 'Kaivosalan perustutkinto',
        isYhteishaku: true,
      });
      await fillAloituspaikatSection(page, { isKorkeakoulu: false });
      await fillValintaperusteenKuvausSection(page);
      await fillValintakokeetSection(page, {
        withValintaperusteenKokeet: true,
      });
      await fillLiitteetSection(page);
      await fillJarjestyspaikkaSection(page);
      await fillTilaSection(page);
      await tallenna(page);

      await expect(page).toHaveURL(
        new RegExp(
          `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus$`
        )
      );
    }));

  test('should be able to create korkeakoulu hakukohde', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
        hakutapaKoodiUri: 'hakutapa_02',
      });
      await loadHakukohdePage(page);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillPohjakoulutusvaatimusSection(page);
      await fillPerustiedotSection(page, { isYhteishaku: false });
      await fillAloituspaikatSection(page, { isKorkeakoulu: true });
      await fillValintaperusteenKuvausSection(page);
      await fillValintakokeetSection(page, {
        withValintaperusteenKokeet: true,
      });
      await fillLiitteetSection(page);
      await fillJarjestyspaikkaSection(page);
      await fillTilaSection(page);
      await tallenna(page);

      await expect(page).toHaveURL(
        new RegExp(
          `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus$`
        )
      );
    }));

  test('should be able to create hakukohde with muu hakulomake', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
        hakutapaKoodiUri: 'hakutapa_02',
      });
      await loadHakukohdePage(page);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillPohjakoulutusvaatimusSection(page);
      await withinSection(page, 'perustiedot', async section => {
        await fillLomakeFields(section, 'muu');
      });
      await fillAloituspaikatSection(page, { isKorkeakoulu: true });
      await fillJarjestyspaikkaSection(page);
      await fillTilaSection(page);
      await tallenna(page);

      await expect(page).toHaveURL(
        new RegExp(
          `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus$`
        )
      );
    }));

  test('should be able to create hakukohde with "ei sähköistä" hakulomake', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, {
        tyyppi: 'yo',
        hakuOid,
        organisaatioOid,
        tarjoajat,
        hakutapaKoodiUri: 'hakutapa_02',
      });
      await loadHakukohdePage(page);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillPohjakoulutusvaatimusSection(page);
      await withinSection(page, 'perustiedot', async section => {
        await fillLomakeFields(section, 'ei sähköistä');
      });
      await fillAloituspaikatSection(page, { isKorkeakoulu: true });
      await fillJarjestyspaikkaSection(page);
      await fillTilaSection(page);
      await tallenna(page);

      await expect(page).toHaveURL(
        new RegExp(
          `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus$`
        )
      );
    }));

  test('should be able to create hakukohde with lukiolinjat', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await prepareTest(page, {
        tyyppi: 'lk',
        hakuOid,
        organisaatioOid,
        tarjoajat,
        hakutapaKoodiUri: 'hakutapa_01',
      });
      await loadHakukohdePage(page);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillPohjakoulutusvaatimusSection(page);
      await fillPerustiedotSection(page, { isLukio: true, isYhteishaku: true });
      await fillLukiolinjatSection(page);
      await fillAloituspaikatSection(page, { isKorkeakoulu: false });
      await fillJarjestyspaikkaSection(page);
      await fillTilaSection(page);
      await tallenna(page);

      await expect(page).toHaveURL(
        new RegExp(
          `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus$`
        )
      );
    }));

  test('Should not copy publishing state when using existing entity as base', async ({
    page,
  }) => {
    await prepareTest(page, {
      tyyppi: 'yo',
      hakuOid,
      organisaatioOid,
      tarjoajat,
      hakutapaKoodiUri: 'hakutapa_02',
    });
    await loadHakukohdePage(page);
    await assertBaseTilaNotCopied(page, 'Hakukohteen nimi');
  });
});

const stubOppilaitosRights = (page: Page) =>
  stubKayttoOikeusOmatTiedot(page, [
    {
      organisaatioOid,
      kayttooikeudet: [
        {
          palvelu: 'KOUTA',
          oikeus: 'HAKUKOHDE_UPDATE',
        },
      ],
    },
  ]);

test.describe('Create hakukohde as oppilaitos user', () => {
  test('should not be possible to save hakukohde if haun liittämistakaraja has expired', async ({
    page,
  }) => {
    await prepareTest(page, {
      tyyppi: 'lk',
      hakuOid,
      organisaatioOid,
      tarjoajat,
      hakukohteenLiittaminenHasExpired: true,
    });
    await stubOppilaitosRights(page);
    await loadHakukohdePage(page);
    await fillKieliversiotSection(page);
    const tallennaBtn = page.getByRole('button', {
      name: 'yleiset.tallenna',
    });
    await expect(tallennaBtn).toBeDisabled();
    await expect(tallennaBtn).toHaveAttribute(
      'title',
      'hakukohdelomake.muokkaamisenTakarajaYlittynyt'
    );
  });
  test("should be possible to save hakukohde if haun lisäämis- ja muokkaamistakarajat haven't been set", async ({
    page,
  }) => {
    await prepareTest(page, {
      tyyppi: 'lk',
      hakuOid,
      organisaatioOid,
      tarjoajat,
      hakuWithoutTakarajat: true,
    });
    await stubOppilaitosRights(page);
    await loadHakukohdePage(page);
    await fillKieliversiotSection(page);
    const tallennaBtn = page.getByRole('button', {
      name: 'yleiset.tallenna',
    });
    await expect(tallennaBtn).toBeEnabled();
  });

  test('should be possible to save hakukohde if haun lisäämistakaraja has expired but muokkaamistakaraja has not been set', async ({
    page,
  }) => {
    await prepareTest(page, {
      tyyppi: 'lk',
      hakuOid,
      organisaatioOid,
      tarjoajat,
      hakukohteenLiittaminenHasExpired: true,
      hakuWithoutMuokkaamisenTakaraja: true,
    });
    await stubOppilaitosRights(page);
    await loadHakukohdePage(page);
    await fillKieliversiotSection(page);
    const tallennaBtn = page.getByRole('button', {
      name: 'yleiset.tallenna',
    });
    await expect(tallennaBtn).toBeEnabled();
  });
});
