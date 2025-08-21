import { Page, test, expect } from '@playwright/test';

import {
  fillAsyncSelect,
  fillKieliversiotSection,
  fillKoulutustyyppiSection,
  fillOrgSection,
  fillTilaSection,
  fillTreeSelect,
  tallenna,
  typeToEditor,
  wrapMutationTest,
  withinSection,
  getWrapperByLabel,
  getSelectByLabel,
  getSection,
  assertBaseTilaNotCopied,
} from '#/playwright/playwright-helpers';
import {
  fixtureFromFile,
  fixtureJSON,
} from '#/playwright/playwright-mock-utils';
import { stubKoulutusRoutes } from '#/playwright/stubKoulutusRoutes';
import { ENTITY } from '#/src/constants';

const mutationTest = wrapMutationTest(ENTITY.KOULUTUS);

const organisaatioOid = '1.1.1.1.1.1';

const fillLisatiedotSection = (page: Page) =>
  withinSection(page, 'lisatiedot', async section => {
    await fillAsyncSelect(
      section.getByTestId('osiotSelect'),
      'Opintojen rakenne'
    );

    await typeToEditor(
      section.getByTestId('osioKuvaus.koulutuksenlisatiedot_01#1'),
      'koulutuksenlisatiedot kuvaus'
    );
  });

const fillSoraKuvausSection = (page: Page) =>
  withinSection(page, 'soraKuvaus', async section => {
    await fillAsyncSelect(section, 'Sora-kuvaus 1');
  });

const fillJarjestajaSection = (page: Page) =>
  withinSection(page, 'tarjoajat', async section => {
    await fillTreeSelect(section.getByTestId('tarjoajatSelection'), [
      '1.2.1.1.1.1',
    ]);
  });

const fillNakyvyysSection = (page: Page) =>
  withinSection(page, 'julkinen', async section => {
    await section.getByText('yleiset.onJulkinen').click();
  });

test.describe('Create koulutus', () => {
  test.beforeEach(async ({ page }) => {
    await stubKoulutusRoutes(page, organisaatioOid);
    await page.goto(`/kouta/organisaatio/${organisaatioOid}/koulutus`);
    await page.route(
      '**/kouta-backend/luokittelutermi/search/luokittelutermi*',
      fixtureJSON([])
    );
    await page.route(
      '**/kouta-backend/luokittelutermi/search/testi?*',
      fixtureJSON(['testi', 'testitägi'])
    );
  });

  test('Should be able to create ammatillinen koulutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['amm']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          page.getByTestId('koulutusSelect'),
          'Kaivosalan perustutkinto'
        );
        await fillAsyncSelect(
          page.getByTestId('ePerusteSelect'),
          'Kaivosalan perustutkinto'
        );

        const input = section.getByLabel('koulutuslomake.luokittelutermit');
        await input.fill('luokittelutermi');
        const createButton = section.getByRole('button', {
          name: 'yleiset.lisaaUusi',
        });
        await createButton.click();
        await expect(input).toHaveCount(1);
        await input.fill('testi');
        const option = section.getByText('testitägi');
        await option.click();
        await expect(input).toHaveCount(1);
      });
      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillNakyvyysSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create ammatillinen osaamisala koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['ammatillinen', 'amm-osaamisala']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'osaamisala', async section => {
        await fillAsyncSelect(
          section.getByTestId('koulutusSelect'),
          'Kaivosalan perustutkinto'
        );
        await fillAsyncSelect(
          section.getByTestId('ePerusteSelect'),
          'Kaivosalan perustutkinto'
        );
        await fillAsyncSelect(
          section.getByTestId('osaamisalaSelect'),
          'Kaivostyön osaamisala'
        );

        await expect(
          section.getByRole('link', { name: '1800', exact: true })
        ).toHaveAttribute(
          'href',
          new RegExp('#/fi/esitys/7823345/reformi/sisalto/6858226$')
        );
      });
      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillNakyvyysSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create ammatillinen tutkinnon osa koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'ammatillinen',
        'amm-tutkinnon-osa',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'tutkinnonosat', async section => {
        await page.getByTestId('lisaaKoulutusButton').click();
        await fillAsyncSelect(
          section.getByTestId('koulutusSelect'),
          'Kaivosalan perustutkinto'
        );
        await fillAsyncSelect(
          section.getByTestId('ePerusteSelect'),
          'Kaivosalan perustutkinto'
        );
        await fillAsyncSelect(
          section.getByTestId('tutkinnonOsatSelect'),
          'Louhintaporaus'
        );
        await expect(
          section.getByRole('link', { name: '106436', exact: true })
        ).toHaveAttribute(
          'href',
          new RegExp('#/fi/esitys/7823345/reformi/tutkinnonosat/7843530$')
        );
      });
      await withinSection(page, 'nimi', async section => {
        await expect(
          section.getByLabel('koulutuslomake.lisaaKoulutuksenNimi')
        ).toHaveValue('Louhintaporaus');
      });
      await withinSection(page, 'tutkinnonosat', async section => {
        await fillAsyncSelect(
          section.getByTestId('tutkinnonOsatSelect'),
          'Kaivosmittaus'
        );
        await expect(
          section.getByRole('link', { name: '106436', exact: true })
        ).toHaveAttribute(
          'href',
          new RegExp('#/fi/esitys/7823345/reformi/tutkinnonosat/7843530$')
        );
      });
      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillNakyvyysSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create AMK-koulutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['korkeakoulutus', 'amk']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getSelectByLabel(section, 'yleiset.valitseKoulutukset'),
          'Fysioterapeutti (AMK)'
        );

        await page.getByTestId('laajuusnumero').fill('300');

        await fillAsyncSelect(
          getSelectByLabel(section, 'koulutuslomake.valitseTutkintonimike'),
          'Fysioterapeutti (AMK)'
        );

        await fillAsyncSelect(
          getSelectByLabel(section, 'koulutuslomake.valitseKoulutusalat'),
          'Terveys'
        );

        await section
          .getByLabel('koulutuslomake.muokkaaKoulutuksenNimea')
          .fill('Tiedot nimi');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
      });

      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create korkeakoulutus opintojakso koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'korkeakoulutus',
        'kk-opintojakso',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await section.getByText('toteutuslomake.yksiArvo').click();
        await section.getByTestId('laajuusMin').locator('input').fill('30');
        await expect(
          section.getByTestId('fixedLaajuusyksikko').locator('input')
        ).toHaveValue('opintopistettä');
        await section
          .getByLabel('koulutuslomake.koulutuksenNimi')
          .fill('Opintojakso nimi');
        await section.getByLabel('yleiset.tunniste').fill('ABC-123');
        await fillAsyncSelect(
          getWrapperByLabel(section, 'yleiset.opinnonTyyppi'),
          'Aineopinnot'
        );
        await section.getByText('yleiset.isAvoinKorkeakoulutus').click();
      });
      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
      });
      await fillLisatiedotSection(page);
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create korkeakoulutus opintokokonaisuus koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'korkeakoulutus',
        'kk-opintokokonaisuus',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await section.getByText('toteutuslomake.vaihteluvali').click();
        await section.getByTestId('laajuusMin').locator('input').fill('5');
        await section.getByTestId('laajuusMax').locator('input').fill('10');
        await expect(
          section.getByTestId('fixedLaajuusyksikko').locator('input')
        ).toHaveValue('opintopistettä');
        await section
          .getByLabel('koulutuslomake.koulutuksenNimi')
          .fill('Opintokokonaisuus nimi');
        await section.getByLabel('yleiset.tunniste').fill('ABC-123');
        await fillAsyncSelect(
          getWrapperByLabel(section, 'yleiset.opinnonTyyppi'),
          'Muut opinnot'
        );
      });
      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
      });
      await fillLisatiedotSection(page);
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create Ammatillinen opettaja- erityisopettaja ja opokoulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'korkeakoulutus',
        'amm-ope-erityisope-ja-opo',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getWrapperByLabel(section, 'yleiset.valitseKoulutus'),
          'Ammatillinen opettajankoulutus'
        );

        const laajuus = section.getByLabel(
          'koulutuslomake.valitseOpintojenLaajuus'
        );
        await expect(laajuus).toBeDisabled();
        await expect(laajuus).toHaveValue('60 opintopistettä');

        const tutkintonimike = section.getByLabel(
          'koulutuslomake.valitseTutkintonimike'
        );
        await expect(tutkintonimike).toBeDisabled();
        await expect(tutkintonimike).toHaveValue(
          'koulutuslomake.eiTutkintonimiketta'
        );
        await expect(
          getSelectByLabel(section, 'koulutuslomake.valitseKoulutusalat')
        ).toHaveText('kansallinenkoulutusluokitus2016koulutusalataso1_01');
        await expect(
          section.getByLabel('koulutuslomake.muokkaaKoulutuksenNimea')
        ).toHaveValue('Ammatillinen opettajankoulutus');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
      });

      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create lukiokoulutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['lk']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getSelectByLabel(section, 'yleiset.valitseKoulutus'),
          'Ylioppilastutkinto'
        );
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
      });

      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create TUVA-koulutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['tuva']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await section.getByTestId('laajuusnumero').fill('38');
        await expect(
          section.getByLabel('koulutuslomake.koulutuksenNimi')
        ).toHaveValue('koulutustyypit.tuva');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
        await section
          .getByLabel('koulutuslomake.linkkiEPerusteisiin')
          .fill('http://linkki.fi');
      });
      await fillJarjestajaSection(page);
      await fillTilaSection(page);

      await expect(getSection(page, 'soraKuvaus')).toBeHidden();
      await expect(getSection(page, 'lisatiedot')).toBeHidden();

      await tallenna(page);
    }));

  test('should be able to create "Vapaa Sivistystyö - Opistovuosi"-koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'vapaa-sivistystyo',
        'vapaa-sivistystyo-opistovuosi',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await section.getByTestId('laajuusnumero').fill('53');
        await section
          .getByLabel('koulutuslomake.koulutuksenNimi')
          .fill('vapaa sivistystyö nimi');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
        await section
          .getByLabel('koulutuslomake.linkkiEPerusteisiin')
          .fill('http://linkki.fi');
      });
      await fillJarjestajaSection(page);
      await fillTilaSection(page);

      await expect(getSection(page, 'soraKuvaus')).toBeHidden();
      await expect(getSection(page, 'lisatiedot')).toBeHidden();

      await tallenna(page);
    }));

  test('should be able to create "Vapaa Sivistystyö - Muu"-koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'vapaa-sivistystyo',
        'vapaa-sivistystyo-muu',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await section.getByTestId('laajuusnumero').fill('53');
        await fillAsyncSelect(
          getSelectByLabel(section, 'yleiset.laajuusyksikko'),
          'opintopistettä'
        );
        await section
          .getByLabel('koulutuslomake.koulutuksenNimi')
          .fill('vapaa sivistystyö nimi');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
        await section
          .getByLabel('koulutuslomake.linkkiEPerusteisiin')
          .fill('http://linkki.fi');
      });
      await fillJarjestajaSection(page);
      await fillTilaSection(page);

      await expect(getSection(page, 'soraKuvaus')).toBeHidden();
      await expect(getSection(page, 'lisatiedot')).toBeHidden();

      await tallenna(page);
    }));

  test('should be able to create "Vapaa Sivistystyö - Osaamismerkki"-koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'vapaa-sivistystyo',
        'vapaa-sivistystyo-osaamismerkki',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getSelectByLabel(section, 'koulutuslomake.valitseKoulutusalat'),
          'Yleissivistävä koulutus'
        );
        await fillAsyncSelect(
          getSelectByLabel(section, 'koulutuslomake.valitseOsaamismerkki'),
          'Lukeminen'
        );
        await page.route(
          '**/eperusteet-service/api/external/osaamismerkki/koodi/osaamismerkit_1007',
          fixtureFromFile('osaamismerkit_1007.json')
        );
        await expect(
          section.getByRole('link', { name: '9202686', exact: true })
        ).toHaveAttribute(
          'href',
          new RegExp('#/fi/osaamismerkit/osaamismerkki/9202686$')
        );
      });
      await withinSection(page, 'description', async section => {
        await expect(section).toContainText('Lukeminen (9202686)');
        await expect(section).toContainText(
          'osaa hyödyntää lukemista eri tarkoituksiin'
        );
        await expect(section).toContainText(
          'kertoo, kuinka voi kehittää itseään lukemalla erilaisia tekstejä'
        );
      });
      await fillJarjestajaSection(page);
      await fillTilaSection(page);

      await expect(getSection(page, 'soraKuvaus')).toBeHidden();
      await expect(getSection(page, 'lisatiedot')).toBeHidden();

      await tallenna(page);
    }));

  test('should be able to create TELMA-koulutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['ammatillinen', 'telma']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await section.getByTestId('laajuusnumero').fill('60');
        await expect(
          section.getByLabel('koulutuslomake.koulutuksenNimi')
        ).toHaveValue('koulutustyypit.telma');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
        await section
          .getByLabel('koulutuslomake.linkkiEPerusteisiin')
          .fill('http://linkki.fi');
      });

      await fillJarjestajaSection(page);
      await fillNakyvyysSection(page);
      await fillTilaSection(page);

      await expect(getSection(page, 'soraKuvaus')).toBeHidden();
      await expect(getSection(page, 'lisatiedot')).toBeHidden();

      await tallenna(page);
    }));

  test('should be able to create muu ammatillinen koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['ammatillinen', 'amm-muu']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getSelectByLabel(section, 'yleiset.laajuusyksikko'),
          'osaamispistettä'
        );
        await section.getByTestId('laajuusnumero').fill('12');
        await section
          .getByLabel('koulutuslomake.koulutuksenNimi')
          .fill('muu ammatillinen nimi');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
        await expect(
          section.getByLabel('koulutuslomake.linkkiEPerusteisiin')
        ).toBeHidden();
      });

      await fillJarjestajaSection(page);
      await fillNakyvyysSection(page);
      await fillTilaSection(page);

      await expect(getSection(page, 'soraKuvaus')).toBeHidden();
      await expect(getSection(page, 'lisatiedot')).toBeHidden();

      await tallenna(page);
    }));

  test('should be able to create erikoislääkäri-koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'korkeakoulutus',
        'erikoislaakari',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getWrapperByLabel(section, 'yleiset.valitseKoulutus'),
          'Erikoislääkäri'
        );
        await section
          .getByLabel('koulutuslomake.koulutuksenNimi')
          .fill('erikoislääkäri-koulutus nimi');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
        await expect(
          section.getByLabel('koulutuslomake.linkkiEPerusteisiin')
        ).toBeHidden();
      });
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await expect(getSection(page, 'soraKuvaus')).toBeHidden();

      await tallenna(page);
    }));

  test('should be able to create "Aikuisten perusopetus" -koulutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['aikuisten-perusopetus']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getSelectByLabel(section, 'yleiset.laajuusyksikko'),
          'opintopistettä'
        );
        await section.getByTestId('laajuusnumero').fill('13');
        await expect(
          section.getByLabel('koulutuslomake.koulutuksenNimi')
        ).toHaveValue('koulutustyypit.aikuistenPerusopetus');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
        await section
          .getByLabel('koulutuslomake.linkkiEPerusteisiin')
          .fill('http://linkki.fi');
      });
      await fillJarjestajaSection(page);
      await fillNakyvyysSection(page);
      await fillTilaSection(page);
      await expect(getSection(page, 'soraKuvaus')).toBeHidden();
      await expect(getSection(page, 'lisatiedot')).toBeHidden();

      await tallenna(page);
    }));

  test('should be able to create DIA-koulutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['lk']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getSelectByLabel(section, 'yleiset.valitseKoulutus'),
          'Deutsche Internationale Abitur; Reifeprüfung'
        );
        await expect(
          getSelectByLabel(section, 'koulutuslomake.valitseKoulutusalat')
        ).toHaveText('kansallinenkoulutusluokitus2016koulutusalataso1_00');

        await expect(
          section.getByLabel('koulutuslomake.muokkaaKoulutuksenNimea')
        ).toHaveValue('Deutsche Internationale Abitur; Reifeprüfung');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
      });
      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create EB-koulutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, ['lk']);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getSelectByLabel(section, 'yleiset.valitseKoulutus'),
          'EB-tutkinto (European Baccalaureate)'
        );
        await expect(
          getSelectByLabel(section, 'koulutuslomake.valitseKoulutusalat')
        ).toHaveText('kansallinenkoulutusluokitus2016koulutusalataso1_00');

        await expect(
          section.getByLabel('koulutuslomake.muokkaaKoulutuksenNimea')
        ).toHaveValue('EB-tutkinto (European Baccalaureate)');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
      });
      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create Erikoistumiskoulutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillKoulutustyyppiSection(page, [
        'korkeakoulutus',
        'erikoistumiskoulutus',
      ]);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await withinSection(page, 'information', async section => {
        await fillAsyncSelect(
          getSelectByLabel(
            section,
            'koulutuslomake.valitseErikoistumiskoulutus'
          ),
          'Big Data Analytics'
        );
        await section.getByText('toteutuslomake.vaihteluvali').click();
        await section.getByTestId('laajuusMin').locator('input').fill('5');
        await section.getByTestId('laajuusMax').locator('input').fill('10');
        await expect(
          section.getByTestId('fixedLaajuusyksikko').locator('input')
        ).toHaveValue('opintopistettä');
        await fillAsyncSelect(
          getSelectByLabel(section, 'koulutuslomake.valitseKoulutusalat'),
          'Tietojenkäsittely ja tietoliikenne (ICT)'
        );

        await expect(
          section.getByLabel('koulutuslomake.muokkaaKoulutuksenNimea')
        ).toHaveValue('Big Data Analytics');
      });

      await withinSection(page, 'description', async section => {
        await section.getByRole('textbox').nth(0).fill('Kuvaus');
        await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
      });
      await fillLisatiedotSection(page);
      await fillSoraKuvausSection(page);
      await fillJarjestajaSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('Should not copy publishing state when using existing koulutus as base', async ({
    page,
  }) => {
    await assertBaseTilaNotCopied(page, 'Koulutuksen nimi');
  });
});
