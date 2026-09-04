import { Page, test, expect } from '@playwright/test';
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
