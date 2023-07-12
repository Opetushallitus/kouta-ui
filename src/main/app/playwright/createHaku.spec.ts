import { Locator, Page, test, expect } from '@playwright/test';

import { Alkamiskausityyppi, ENTITY, HAKULOMAKETYYPPI } from '#/src/constants';

import { stubHakuRoutes } from './mocks/stubHakuRoutes';
import {
  fillAsyncSelect,
  fillDateTime,
  fillKieliversiotSection,
  fillOrgSection,
  fillTilaSection,
  getFieldWrapperByName,
  getRadio,
  getSection,
  getWrapperByLabel,
  tallenna,
  typeToEditor,
  withinSection,
  wrapMutationTest,
} from './playwright-helpers';

const fillNimiSection = withinSection('nimi', async section => {
  await section.getByLabel('yleiset.nimi').fill('haun nimi');
});

const fillKohdejoukkoSection = withinSection('kohdejoukko', async section => {
  const kohdejoukko = section.getByTestId('kohdejoukko');
  await kohdejoukko.getByText('Korkeakoulutus').click();
  await fillAsyncSelect(
    section.getByTestId('tarkenne'),
    'Ammatillinen opettajankoulutus'
  );
});

const fillHakutapaSection = withinSection('hakutapa', async section => {
  await section.getByText('Yhteishaku').click();
});

const fillAjankohtaFields = async (
  section: Locator,
  alkamiskausityyppi: Alkamiskausityyppi = Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI
) => {
  const ak = section.getByTestId('AloitusajankohtaFields');
  switch (alkamiskausityyppi) {
    case Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI:
      await ak.getByText('yleiset.alkamiskausiJaVuosi').click();
      await ak.getByText('Kevät').click();
      await fillAsyncSelect(ak, '2035');
      return;
    case Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA:
      await ak.getByText('yleiset.tarkkaAlkamisajankohta').click();
      await fillDateTime(ak.getByTestId('alkaa'), {
        date: '1.11.2030',
        time: '00:00',
      });
      await fillDateTime(ak.getByTestId('paattyy'), {
        date: '30.11.2030',
        time: '00:00',
      });
      return;
    case Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA:
      ak.getByText(
        'yleiset.aloitusHenkilokohtaisenSuunnitelmanMukaisesti'
      ).click();
      const lisatietoa = ak.getByLabel('yleiset.lisatietoa');
      await lisatietoa.type('Henkilökohtaisen suunnitelman lisätiedot');
  }
};

const fillAikatauluSection = (page: Page) =>
  withinSection('aikataulut', async section => {
    const hakuajat = section.getByTestId('hakuajat');
    await hakuajat.getByTestId('lisaaButton').click();
    await fillDateTime(hakuajat.getByTestId('alkaa'), {
      date: '02.04.2019',
      time: '10:45',
    });
    await fillDateTime(hakuajat.getByTestId('paattyy'), {
      date: '25.11.2019',
      time: '23:59',
    });
    const tulevat = section.getByTestId('tulevaisuudenaikataulu');
    await tulevat.getByTestId('lisaaButton').click();
    await fillDateTime(tulevat.getByTestId('alkaa'), {
      date: '11.10.2019',
      time: '09:05',
    });
    await fillDateTime(tulevat.getByTestId('paattyy'), {
      date: '25.12.2019',
      time: '20:30',
    });
    await section
      .getByText('hakulomake.haullaErillinenAloitusajankohta')
      .click();
    await fillAjankohtaFields(section);
    await fillDateTime(section.getByTestId('perumisenTakaraja'), {
      date: '24.12.2019',
      time: '21:20',
    });
    await fillDateTime(section.getByTestId('muokkauksenTakaraja'), {
      date: '11.12.2019',
      time: '19:15',
    });
    await fillDateTime(section.getByTestId('julkaisupaivamaara'), {
      date: '05.12.2019',
      time: '06:45',
    });
  })(page);

const mutationTest = wrapMutationTest(ENTITY.HAKU);

const fillHakulomakeSection = (
  page: Page,
  type: HAKULOMAKETYYPPI = HAKULOMAKETYYPPI.ATARU
) =>
  withinSection('hakulomake', async section => {
    if (type === HAKULOMAKETYYPPI.ATARU) {
      await section.getByText('hakulomakeValinnat.ataru').click();
      await fillAsyncSelect(
        getWrapperByLabel(section, /^yleiset\.valitseHakulomake/),
        'Lomake 1'
      );
    } else if (type === HAKULOMAKETYYPPI.MUU) {
      await section.getByText('hakulomakeValinnat.muu').click();
      await section.getByLabel('yleiset.linkki').fill('http://example.com');
    } else {
      await section.getByText('hakulomakeValinnat.eiSahkoistaHakua').click();
      await typeToEditor(
        getWrapperByLabel(section, 'yleiset.kuvaus'),
        'hakulomake kuvaus'
      );
    }
  })(page);

const fillYhteystiedotSection = (page: Page) =>
  withinSection('yhteyshenkilot', async section => {
    await section
      .getByRole('button', { name: 'yleiset.lisaaYhteyshenkilo' })
      .click();
    await section.getByRole('textbox', { name: 'yleiset.nimi' }).fill('nimi');
    await section
      .getByRole('textbox', { name: 'yleiset.titteli' })
      .fill('titteli');
    await section
      .getByRole('textbox', { name: 'yleiset.sahkoposti' })
      .fill('sähköposti');
    await section
      .getByRole('textbox', { name: 'yleiset.puhelinnumero' })
      .fill('puhelin');
    await section
      .getByRole('textbox', { name: 'yleiset.verkkosivu', exact: true })
      .fill('verkkosivu');
    await section
      .getByRole('textbox', { name: 'yleiset.verkkosivun-teksti', exact: true })
      .fill('verkkosivun teksti');
  })(page);

const organisaatioOid = '1.1.1.1.1.1';

test.describe('Create haku', () => {
  test.beforeEach(async ({ page }) => {
    await stubHakuRoutes(page, organisaatioOid);
    await page.goto(`/kouta/organisaatio/${organisaatioOid}/haku`);
  });

  test('Should be able to create haku with "ataru"-hakulomake', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillNimiSection(page);
      await fillKohdejoukkoSection(page);
      await fillHakutapaSection(page);
      await fillAikatauluSection(page);
      await fillHakulomakeSection(page, HAKULOMAKETYYPPI.ATARU);
      await fillYhteystiedotSection(page);
      await fillTilaSection(page);
      await tallenna(page);
    }));

  test('Should be able to create haku with "muu"-hakulomake', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillNimiSection(page);
      await fillKohdejoukkoSection(page);
      await fillHakutapaSection(page);
      await fillHakulomakeSection(page, HAKULOMAKETYYPPI.MUU);
      await tallenna(page);
    }));

  test('Should be able to create haku with "ei sähköistä"-hakulomake', ({
    page,
  }, testInfo) =>
    mutationTest({ page, testInfo }, async () => {
      await fillOrgSection(page, organisaatioOid);
      await fillKieliversiotSection(page);
      await fillNimiSection(page);
      await fillKohdejoukkoSection(page);
      await fillHakutapaSection(page);
      await fillHakulomakeSection(page, HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA);
      await tallenna(page);
    }));

  test('Using an existing object as baseline it should not copy publishing state', async ({
    page,
  }) => {
    await withinSection('pohja', async section => {
      await section.getByText('hakulomake.kopioiPohjaksi').click();
      const pohjaWrapper = getFieldWrapperByName(section, 'pohja.valinta');
      await fillAsyncSelect(pohjaWrapper, 'Korkeakoulujen yhteishaku');
    })(page, { jatka: true });
    const tilaSection = getSection(page, 'tila');
    await expect(getRadio(tilaSection, 'tallennettu')).toBeChecked();
  });
});
