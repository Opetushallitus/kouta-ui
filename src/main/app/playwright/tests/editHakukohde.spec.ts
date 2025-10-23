import { Page, test, expect } from '@playwright/test';
import { merge } from 'lodash';

import hakukohde from '#/playwright/fixtures/hakukohde';
import {
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  withinSection,
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

const fillJarjestyspaikkaSection = (page: Page) =>
  withinSection(page, 'jarjestyspaikka', async section => {
    await section.getByText(selectedToimipisteNimi).click();
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
