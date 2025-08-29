import { Page, test, expect, Locator } from '@playwright/test';
import { merge } from 'lodash';

import koulutus from '#/playwright/fixtures/koulutus';
import {
  fillAsyncSelect,
  fillKieliversiotSection,
  fillOrgSection,
  fillTilaSection,
  fillTreeSelect,
  tallenna,
  typeToEditor,
  wrapMutationTest,
  withinSection,
  fillAjankohtaFields,
  getSection,
  getFieldWrapperByName,
  fillDateTime,
  fillYhteystiedotSection,
  fillRadioValue,
  getLabel,
  getSelectByLabel,
  assertBaseTilaNotCopied,
  fillYhteystiedotWithoutVerkkosivuTekstiSection,
  fillYhteystiedotWithoutVerkkosivuSection,
} from '#/playwright/playwright-helpers';
import { fixtureJSON, mocksFromFile } from '#/playwright/playwright-mock-utils';
import { stubToteutusRoutes } from '#/playwright/stubToteutusRoutes';
import { TestiKoulutustyyppi } from '#/playwright/test-types';
import { ENTITY, KOULUTUSTYYPPI, Koulutustyyppi } from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

const mutationTest = wrapMutationTest(ENTITY.TOTEUTUS, { oid: '1.2.3.4.5.6' });

const fillJarjestajaSection = (page: Page) =>
  withinSection(page, 'tarjoajat', async section => {
    await fillTreeSelect(section.getByTestId('jarjestamispaikatSelection'), [
      '1.2.2.1.1.1',
    ]);
  });

const fillJarjestamistiedotSection = (
  page: Page,
  values?: {
    opetuskieli?: string;
    maksullisuusTyyppi?: MaksullisuusTyyppi;
    apuraha?: {
      maara: string;
      kuvaus: string;
    };
    lukiotiedot?: boolean;
  }
) =>
  withinSection(page, 'jarjestamistiedot', async section => {
    const opetuskieliLoc = section.getByRole('region', {
      name: 'yleiset.opetuskieli',
    });
    await opetuskieliLoc
      .getByText(values?.opetuskieli ?? 'suomi', { exact: true })
      .click();
    await typeToEditor(opetuskieliLoc, 'opetuskieli kuvaus');

    const suunniteltuKesto = section.getByRole('region', {
      name: 'toteutuslomake.suunniteltuKesto',
    });
    await suunniteltuKesto.getByLabel('toteutuslomake.vuotta').fill('2');
    await suunniteltuKesto.getByLabel('toteutuslomake.kuukautta').fill('6');
    await typeToEditor(suunniteltuKesto, 'suuniteltu kesto kuvaus');

    const opetusaika = section.getByRole('region', {
      name: 'toteutuslomake.opetusaika',
    });
    await opetusaika.getByText('Päiväopetus', { exact: true }).click();
    await typeToEditor(opetusaika, 'opetustapa kuvaus');

    const opetustapa = section.getByRole('region', {
      name: 'toteutuslomake.paaasiallinenOpetustapa',
    });
    await opetustapa.getByText('Lähiopetus').click();

    if (
      values?.maksullisuusTyyppi &&
      values?.maksullisuusTyyppi !== MaksullisuusTyyppi.MAKSUTON
    ) {
      const maksullisuus = section.getByRole('region', {
        name: 'toteutuslomake.opetuksenMaksullisuus',
      });
      await fillRadioValue(maksullisuus, values?.maksullisuusTyyppi);
      await maksullisuus.getByPlaceholder('yleiset.maara').fill('10');
      await typeToEditor(maksullisuus, 'maksullisuus kuvaus');
    }

    if (values?.apuraha) {
      await expect(
        values.opetuskieli,
        'Opetuskielen täytyy olla englanti, jotta apurahan voi asettaa!'
      ).toBe('englanti');
      await expect(
        values.maksullisuusTyyppi,
        'Maksullisuustyypin täytyy olla lukuvuosimaksu, jotta apurahan voi asettaa!'
      ).toBe(MaksullisuusTyyppi.LUKUVUOSIMAKSU);

      const apurahaRegion = section.getByRole('region', {
        name: 'toteutuslomake.apuraha',
      });
      await getLabel(apurahaRegion, 'toteutuslomake.apurahaKaytossa').click();
      await apurahaRegion
        .getByPlaceholder('toteutuslomake.maara')
        .fill(values?.apuraha?.maara);
      await typeToEditor(apurahaRegion, 'apuraha kuvaus');
    }

    await section
      .getByText('toteutuslomake.toteutuksellaErillinenAloitusajankohta', {
        exact: true,
      })
      .click();

    await fillAjankohtaFields(section);

    await fillAsyncSelect(
      section.getByRole('region', {
        name: 'yleiset.valitseLisattavaOsio',
      }),
      'Opintojen rakenne'
    );
    if (values?.lukiotiedot) {
      await fillKielivalikoima(section);
      await fillLukioDiplomi(section);
    }
  });

const fillTiedotSection = (page: Page, tyyppi: TestiKoulutustyyppi) =>
  withinSection(page, 'tiedot', async section => {
    const nimi = section.getByLabel('toteutuslomake.toteutuksenNimi');
    const laajuus = section.getByLabel('toteutuslomake.laajuus');
    if (
      ['yo', 'amk', 'amm-ope-erityisope-ja-opo', 'kk-opintojakso'].includes(
        tyyppi
      )
    ) {
      await nimi.fill('toteutuksen nimi');
    } else if (tyyppi === 'lk') {
      await getLabel(section, 'toteutusLomake.jotpaRahoitus').click();
    } else if (tyyppi === 'tuva') {
      const nimi = section.getByLabel(/toteutuksenNimi/);
      await expect(nimi).toBeDisabled();
      await expect(nimi).toHaveValue(
        'Tutkintokoulutukseen valmentava koulutus (TUVA)'
      );
      await expect(laajuus).toBeDisabled();
      await expect(laajuus).toHaveValue('38 viikkoa');
    } else if (tyyppi === 'kk-opintokokonaisuus') {
      await nimi.fill('toteutuksen nimi');

      await section.getByLabel('.valitseOpintojenLaajuus').fill('10');

      const isPieniOsaamiskokonaisuus = getLabel(
        section,
        'toteutuslomake.isPieniOsaamiskokonaisuus'
      );

      // Opintojen laajuus is 10 so isPieniOsaamiskokonaisuus defaults to true
      await expect(isPieniOsaamiskokonaisuus).toBeChecked();
      const laajuusyksikko = section.getByLabel('Laajuusyksikko');
      await expect(laajuusyksikko).toBeDisabled();
      await expect(laajuusyksikko).toHaveValue('opintopistettä');

      // isPieniOsaamiskokonaisuus is clicked to make it false
      await isPieniOsaamiskokonaisuus.click();

      await section.getByLabel('yleiset.tunniste').fill('ABC-123');

      await fillAsyncSelect(
        getSelectByLabel(section, 'yleiset.opinnonTyyppi'),
        'Aineopinnot'
      );
      await getLabel(section, 'avoinKorkeakoulutus').click();
    } else if (tyyppi === 'vapaa-sivistystyo-opistovuosi') {
      await expect(nimi).toBeDisabled();
      await expect(laajuus).toBeDisabled();
      await expect(laajuus).toHaveValue('53 opintopistettä');
    } else if (tyyppi === 'vapaa-sivistystyo-muu') {
      await expect(nimi).toBeEnabled();
      await expect(laajuus).toBeDisabled();
      await expect(laajuus).toHaveValue('53 opintopistettä');
      await getLabel(section, 'toteutuslomake.suoritetaanNayttona').click();
    } else if (tyyppi === 'vapaa-sivistystyo-osaamismerkki') {
      await expect(nimi).toBeEnabled();
      await expect(laajuus).not.toBeVisible();
      await getLabel(section, 'toteutuslomake.suoritetaanNayttona').click();
    } else if (tyyppi === 'telma') {
      await expect(nimi).toBeDisabled();
      await expect(nimi).toHaveValue(
        'Työhön ja itsenäiseen elämään valmentava koulutus (TELMA)'
      );
      await expect(laajuus).toBeDisabled();
      await expect(laajuus).toHaveValue('60 osaamispistettä');
    } else if (tyyppi === 'amm-muu') {
      await expect(nimi).toBeEnabled();
      await expect(nimi).toHaveValue('Muut ammatilliset koulutukset');
      await expect(laajuus).toBeDisabled();
      await expect(laajuus).toHaveValue('12 osaamispistettä');
    } else if (tyyppi === 'aikuisten-perusopetus') {
      await expect(nimi).toBeEnabled();
      await expect(nimi).toHaveValue('Aikuisten perusopetus');
      await expect(laajuus).toBeDisabled();
      await expect(laajuus).toHaveValue('13 opintopistettä');
    } else if (tyyppi === 'dia') {
      await expect(nimi).toBeEnabled();
      await expect(nimi).toHaveValue(
        'Deutsche Internationale Abitur; Reifeprüfung'
      );
    } else if (tyyppi === 'eb') {
      await expect(nimi).toBeEnabled();
      await expect(nimi).toHaveValue('EB-tutkinto (European Baccalaureate)');
    } else if (tyyppi === 'taiteen-perusopetus') {
      await nimi.fill('toteutuksen nimi');
      const laajuusRegion = getFieldWrapperByName(
        section,
        'tiedot.opintojenLaajuusGroup'
      );
      await getLabel(laajuusRegion, 'toteutuslomake.vaihteluvali').click();
      await laajuusRegion.getByTestId('laajuusMin').locator('input').fill('10');
      await laajuusRegion.getByTestId('laajuusMax').locator('input').fill('20');
      await fillAsyncSelect(
        section.getByTestId('laajuusyksikko'),
        'opintopistettä'
      );
      const taiteenalat = getSelectByLabel(
        section,
        'toteutuslomake.valitseTaiteenalat'
      );
      await fillAsyncSelect(taiteenalat, 'Sirkustaide');
      await fillAsyncSelect(taiteenalat, 'Sanataide');
    }
  });

const fillKuvausSection = (
  page: Page,
  withOsaamistavoitteet: boolean = false
) =>
  withinSection(page, 'description', async section => {
    await section.getByRole('textbox').nth(0).fill('Toteutuksen kuvaus');
    if (withOsaamistavoitteet) {
      await section.getByRole('textbox').nth(1).fill('Osaamistavoitteet');
    }
  });

const fillNayttamistiedotSection = (
  page: Page,
  { ammattinimikkeet }: { ammattinimikkeet: boolean }
) =>
  withinSection(page, 'nayttamistiedot', async section => {
    if (ammattinimikkeet) {
      const input = section.getByLabel('toteutuslomake.ammattinimikkeet');
      await input.fill('ammattinimike');
      const createButton = section.getByRole('button', {
        name: 'yleiset.lisaaUusi',
      });
      await createButton.click();
      await expect(input).toHaveCount(1);
    }

    const input = section.getByLabel('toteutuslomake.avainsanat');
    await input.fill('avainsana');
    const createButton = section.getByRole('button', {
      name: 'yleiset.lisaaUusi',
    });
    await createButton.click();
    await expect(input).toHaveCount(1);
  });

const fillHakeutumisTaiIlmoittautumisTapaSection = (
  page: Page,
  koulutustyyppi?: Koulutustyyppi,
  fillEndDate: boolean = true
) =>
  withinSection(page, 'hakeutumisTaiIlmoittautumistapa', async section => {
    if (
      koulutustyyppi &&
      koulutustyyppi === KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OSAAMISMERKKI
    ) {
      await expect(section.getByLabel('yleiset.ei')).toBeDisabled();
      await expect(section.getByLabel('yleiset.kylla')).toBeDisabled();
    } else {
      await section.getByText('yleiset.ei').click();
    }

    await section
      .getByRole('button', {
        name: 'toteutuslomake.hakuTapa.hakeutuminen',
      })
      .click();

    await section.getByText('toteutuslomake.muuHakulomake').click();

    await section
      .getByRole('textbox', {
        name: /^toteutuslomake.hakeutuminen.linkki/,
      })
      .fill('http://example.com');

    await typeToEditor(
      getFieldWrapperByName(
        section,
        'hakeutumisTaiIlmoittautumistapa.lisatiedot'
      ),
      'lisätiedot'
    );

    await typeToEditor(
      getFieldWrapperByName(
        section,
        'hakeutumisTaiIlmoittautumistapa.lisatiedotValintaperusteista'
      ),
      'lisätiedot valintaperusteista'
    );

    await fillDateTime(section.getByTestId('alkaa'), {
      date: '01.04.2050',
      time: '00:00',
    });

    if (fillEndDate) {
      await fillDateTime(section.getByTestId('paattyy'), {
        date: '01.09.2050',
        time: '00:00',
      });
    }

    await section
      .getByRole('textbox', {
        name: 'toteutuslomake.aloituspaikat',
      })
      .fill('25');

    await typeToEditor(
      getFieldWrapperByName(
        section,
        'hakeutumisTaiIlmoittautumistapa.aloituspaikkakuvaus'
      ),
      'lisätietoja aloituspaikoista'
    );
  });

const fillKielivalikoima = async (section: Locator) => {
  await fillAsyncSelect(
    getSelectByLabel(section, 'toteutuslomake.A1Kielet'),
    'englanti'
  );
  await fillAsyncSelect(
    getSelectByLabel(section, 'toteutuslomake.A2Kielet'),
    'espanja'
  );

  await fillAsyncSelect(
    getSelectByLabel(section, 'toteutuslomake.B1Kielet'),
    'ruotsi'
  );
  await fillAsyncSelect(
    getSelectByLabel(section, 'toteutuslomake.B2Kielet'),
    'saksa'
  );
  await fillAsyncSelect(
    getSelectByLabel(section, 'toteutuslomake.B3Kielet'),
    'kiina'
  );
  await fillAsyncSelect(
    getSelectByLabel(section, 'toteutuslomake.valinnainenAidinkielenOpetus'),
    'suomi'
  );
  await fillAsyncSelect(
    getSelectByLabel(section, 'toteutuslomake.muutKielet'),
    'unkari'
  );
};

const fillLukioDiplomi = async (section: Locator) => {
  const oppiaineetSelect = getSelectByLabel(
    section,
    'toteutuslomake.valitseDiplomiOppiaineet'
  );
  await fillAsyncSelect(oppiaineetSelect, 'Käsityön lukiodiplomi');
  await fillAsyncSelect(oppiaineetSelect, 'Tanssin lukiodiplomi');
  await section
    .getByRole('button', {
      name: /^Käsityön lukiodiplomi/,
    })
    .click();
  const kasityo = section.getByLabel(/^Käsityön lukiodiplomi/);
  await kasityo
    .getByLabel('toteutuslomake.linkkiLisatietoihin')
    .fill('http://example.com');
  await kasityo
    .getByLabel('toteutuslomake.linkinAltTeksti')
    .fill('Käsityön diplomin lisätietoja');
};

const fillLiitetytOpintojaksotSection = (page: Page) =>
  withinSection(page, 'opintojaksojenLiittaminen', async section => {
    const lisaaButton = section.getByRole('button', {
      name: 'toteutuslomake.lisaaOpintojakso',
    });

    await lisaaButton.click();

    await fillAsyncSelect(
      section.getByTestId('opintojakso-0'),
      'Testitoteutus 1'
    );

    await lisaaButton.click();

    await fillAsyncSelect(
      section.getByTestId('opintojakso-1'),
      'Testitoteutus 2'
    );

    await section
      .getByTestId('opintojakso-0')
      .getByRole('button', { name: 'yleiset.poistaRivi' })
      .click();

    await expect(section.getByTestId(/^opintojakso-\d?$/)).toHaveCount(1);
  });

const organisaatioOid = '1.1.1.1.1.1';
const koulutusOid = '1.2.1.1.1.1';

const testKoulutusFields = {
  oid: koulutusOid,
  organisaatioOid: organisaatioOid,
  koulutusKoodiUri: 'koulutus_0#1',
  tarjoajat: ['1.2.2.1.1.1'],
  tila: 'julkaistu',
};

const prepareTest = async (page: Page, tyyppi: TestiKoulutustyyppi) => {
  await page.route(
    `**/koulutus/${koulutusOid}`,
    fixtureJSON(merge(koulutus(tyyppi), testKoulutusFields))
  );
  if (['lk', 'dia', 'eb'].includes(tyyppi)) {
    await mocksFromFile(page, 'lukio.mocks.json');
  }
  await page.goto(
    `/kouta/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`
  );
};

test.describe('Create toteutus', () => {
  test.beforeEach(async ({ page }) => {
    await stubToteutusRoutes(page, organisaatioOid);
  });

  test('should be able to create ammatillinen tutkinnon osa toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'amm-tutkinnon-osa';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await expect(getSection(page, 'soraKuvaus')).toBeHidden();
      await fillHakeutumisTaiIlmoittautumisTapaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create ammatillinen toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'amm';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await withinSection(page, 'osaamisalat', async section => {
        await section
          .locator('label')
          .filter({ hasText: 'Kaivostyön osaamisala' })
          .click();
        await section.getByTestId('osaamisalaToggle.osaamisala_1800').click();
        await section
          .locator('label')
          .filter({ hasText: 'yleiset.linkki' })
          .fill('http://linkki.com');
        await section
          .locator('label')
          .filter({ hasText: 'yleiset.linkinOtsikko' })
          .fill('osaamisala_0 otsikko');
      });
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: true });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create korkeakoulu toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'yo';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, true);
      await fillJarjestamistiedotSection(page, {
        opetuskieli: 'englanti',
        maksullisuusTyyppi: MaksullisuusTyyppi.LUKUVUOSIMAKSU,
        apuraha: {
          maara: '10',
          kuvaus: ' Apuraha kuvaus',
        },
      });
      await fillNayttamistiedotSection(page, { ammattinimikkeet: true });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create amm. ope-, erityisope- ja opokoulutuksen toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'amm-ope-erityisope-ja-opo';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, true);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: true });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create korkeakoulutus opintojakso toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'kk-opintojakso';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, true);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillHakeutumisTaiIlmoittautumisTapaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create korkeakoulutus opintokokonaisuus toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'kk-opintokokonaisuus';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, true);
      await fillLiitetytOpintojaksotSection(page);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillHakeutumisTaiIlmoittautumisTapaSection(page, tyyppi, false);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create lukio toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'lk';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page);
      await fillJarjestamistiedotSection(page, { lukiotiedot: true });
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create TUVA toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'tuva';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create "Vapaa Sivistystyö  - Opistovuosi" toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'vapaa-sivistystyo-opistovuosi';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create "Vapaa Sivistystyö - Muu" toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'vapaa-sivistystyo-muu';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillHakeutumisTaiIlmoittautumisTapaSection(page, tyyppi, false);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create "Vapaa Sivistystyö - Osaamismerkki" toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'vapaa-sivistystyo-osaamismerkki';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillHakeutumisTaiIlmoittautumisTapaSection(page, tyyppi);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create TELMA toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'telma';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create muu ammatillinen toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'amm-muu';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, true);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillHakeutumisTaiIlmoittautumisTapaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create "Aikuisten perusopetus" -toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'aikuisten-perusopetus';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillHakeutumisTaiIlmoittautumisTapaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create "DIA"-toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'dia';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page, { lukiotiedot: true });
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create "EB"-toteutus', ({ page }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'eb';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page, { lukiotiedot: true });
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should be able to create "Taiteen perusopetus" -toteutus', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      const tyyppi = 'taiteen-perusopetus';
      await prepareTest(page, tyyppi);
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillTiedotSection(page, tyyppi);
      await fillKuvausSection(page, false);
      await fillJarjestamistiedotSection(page);
      await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
      await fillJarjestajaSection(page);
      await fillHakeutumisTaiIlmoittautumisTapaSection(page);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('should show validation error for verkkosivun teksti', async ({
    page,
  }) => {
    const tyyppi = 'taiteen-perusopetus';
    await prepareTest(page, tyyppi);
    await fillOrgSection(page, organisaatioOid);
    await fillKieliversiotSection(page);
    await fillTiedotSection(page, tyyppi);
    await fillKuvausSection(page, false);
    await fillJarjestamistiedotSection(page);
    await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
    await fillJarjestajaSection(page);
    await fillHakeutumisTaiIlmoittautumisTapaSection(page);
    await fillYhteystiedotWithoutVerkkosivuTekstiSection(page);
    await fillTilaSection(page);
    await tallenna(page);
    await expect(
      page
        .getByTestId('form-control_yhteyshenkilot[0].verkkosivuTeksti')
        .getByText('validointivirheet.pakollinen')
    ).toBeVisible();
  });

  test('should show validation error for verkkosivu', async ({ page }) => {
    const tyyppi = 'taiteen-perusopetus';
    await prepareTest(page, tyyppi);
    await fillOrgSection(page, organisaatioOid);
    await fillKieliversiotSection(page);
    await fillTiedotSection(page, tyyppi);
    await fillKuvausSection(page, false);
    await fillJarjestamistiedotSection(page);
    await fillNayttamistiedotSection(page, { ammattinimikkeet: false });
    await fillJarjestajaSection(page);
    await fillHakeutumisTaiIlmoittautumisTapaSection(page);
    await fillYhteystiedotWithoutVerkkosivuSection(page);
    await fillTilaSection(page);
    await tallenna(page);
    await expect(
      page
        .getByTestId('form-control_yhteyshenkilot[0].verkkosivu')
        .getByText('validointivirheet.pakollinen')
    ).toBeVisible();
  });

  test('Should not copy publishing state when using existing entity as base', async ({
    page,
  }) => {
    await prepareTest(page, 'yo');
    await assertBaseTilaNotCopied(page, 'Testitoteutus 1');
  });
});
