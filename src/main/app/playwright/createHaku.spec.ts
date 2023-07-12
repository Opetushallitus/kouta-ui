import { Page, test } from '@playwright/test';

import { ENTITY, HAKULOMAKETYYPPI } from '#/src/constants';

import { stubHakuRoutes } from './mocks/stubHakuRoutes';
import {
  fillAsyncSelect,
  fillDateTime,
  fillKieliversiotSection,
  fillOrgSection,
  fillTilaSection,
  getWrapperByLabel,
  tallenna,
  typeToEditor,
  wrapMutationTest,
  withinSection,
  fillAjankohtaFields,
  fillYhteystiedotSection,
  assertBaseTilaNotCopied,
} from './playwright-helpers';

const fillNimiSection = (page: Page) =>
  withinSection(page, 'nimi', async section => {
    await section.getByLabel('yleiset.nimi').fill('haun nimi');
  });

const fillKohdejoukkoSection = (page: Page) =>
  withinSection(page, 'kohdejoukko', async section => {
    const kohdejoukko = section.getByTestId('kohdejoukko');
    await kohdejoukko.getByText('Korkeakoulutus').click();
    await fillAsyncSelect(
      section.getByTestId('tarkenne'),
      'Ammatillinen opettajankoulutus'
    );
  });

const fillHakutapaSection = (page: Page) =>
  withinSection(page, 'hakutapa', async section => {
    await section.getByText('Yhteishaku').click();
  });

const fillAikatauluSection = (page: Page) =>
  withinSection(page, 'aikataulut', async section => {
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
  });

const mutationTest = wrapMutationTest(ENTITY.HAKU);

const fillHakulomakeSection = (
  page: Page,
  type: HAKULOMAKETYYPPI = HAKULOMAKETYYPPI.ATARU
) =>
  withinSection(page, 'hakulomake', async section => {
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
  });

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

  test('Should not copy publishing state when using existing entity as base', async ({
    page,
  }) => {
    await assertBaseTilaNotCopied(page, 'Korkeakoulujen yhteishaku');
  });
});
