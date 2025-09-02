import {
  type BrowserContext,
  type Locator,
  type Page,
  type TestInfo,
  expect,
} from '@playwright/test';
import { includes, last, toLower } from 'lodash';

import { Alkamiskausityyppi, ENTITY } from '#/src/constants';

export const getCookie = async (context: BrowserContext, name: string) => {
  const cookies = await context.cookies();
  return cookies.find(c => c.name === name)?.value;
};

export const assertURLEndsWith = (page: Page, urlEnd: string) =>
  expect(page).toHaveURL(new RegExp(urlEnd + '$'));

export const OPH_TEST_ORGANISAATIO_OID = '1.2.246.562.10.48587687889';

export const wrapMutationTest =
  (entityName: ENTITY, params?: { oid?: string; id?: string }) =>
  async (args: { page: Page; testInfo: TestInfo }, run: () => Promise<any>) => {
    const { page, testInfo } = args;
    const entityLower = toLower(entityName);

    const requestPromise = page.waitForRequest(req => {
      const method = req.method();
      const url = req.url();
      return (
        url.endsWith(`/kouta-backend/${entityLower}`) &&
        ['POST', 'PUT'].includes(method)
      );
    });

    await page.route(`**/kouta-backend/${entityLower}`, async route => {
      const method = route.request().method();
      const data = route.request().postDataJSON();
      if (params?.oid) {
        data.oid = params.oid;
      } else if (params?.id) {
        data.id = params.id;
      }
      if (['POST', 'PUT'].includes(method)) {
        await route.fulfill({
          json: data,
        });
      }
    });
    await run();
    const request = await requestPromise;
    const reqData = JSON.stringify(request.postDataJSON(), null, 2);
    // eslint-disable-next-line playwright/no-standalone-expect
    expect(reqData).toMatchSnapshot(`${testInfo.title}.json`);
  };

export const getSelectOption = (page: Page) => (value: string) =>
  page.getByRole('option', { name: value });

export const getSection = (page: Page, name: string) =>
  page.getByTestId(`${name}Section`);

export const withinSection = async (
  page: Page,
  name: string,
  fn: (section: Locator) => Promise<any>
) => {
  const section = getSection(page, name);
  const sectionHeading = section.locator('> :first-child');

  const isSectionClosed = await sectionHeading.evaluate(
    el => el.getAttribute('open') === null
  );
  if (isSectionClosed) {
    await sectionHeading.click();
  }
  await fn(section);
};

export const jatka = async (locator: Locator) => {
  await locator.getByRole('button', { name: 'yleiset.jatka' }).click();
};

export const getFieldWrapperByName = (loc: Locator, name: string) =>
  loc.getByTestId(`form-control_${name}`);

export const parent = (loc: Locator) => loc.locator('xpath=..');

// Lexical editor requires explicit focus before filling to ensure
// the editor state is properly initialized and onChange events fire correctly
export const typeToEditor = async (loc: Locator, text: string) => {
  const editor = loc.locator('.Editor__').locator('[contenteditable="true"]');
  await editor.focus();
  await editor.fill(text);
};

export const setFakeTime = async (page: Page, fakeDate: Date) => {
  await page.clock.setFixedTime(fakeDate);
};

export const tallenna = async (page: Page) => {
  await page.getByRole('button', { name: 'yleiset.tallenna' }).click();
};

export const getRadio = (loc: Locator, value: string) =>
  loc.locator(`input[type="radio"][value="${value}"]`);

export const fillRadioValue = async (loc: Locator, value: string) => {
  const radio = getRadio(loc, value);
  const isChecked = await radio.isChecked();
  if (!isChecked) {
    await parent(radio).click();
  }
};

export const getLabel = (loc: Locator, match: string | RegExp) =>
  loc.locator('label', { hasText: match });

export const fillTilaSection = (page: Page, tila: string = 'julkaistu') =>
  withinSection(page, 'tila', async section => {
    await fillRadioValue(section, tila);
  });

const selectLanguages = async (
  selector: Locator,
  selectedLanguages: Array<string> = []
) => {
  const languages = ['suomi', 'ruotsi', 'englanti'];
  await Promise.all(
    languages.map(async lang => {
      const langInput = selector.getByText(`yleiset.${lang}`);
      const isChecked = await langInput.isChecked();
      if (
        (selectedLanguages.includes(lang) && !isChecked) ||
        (!selectedLanguages.includes(lang) && isChecked)
      ) {
        await langInput.click();
      }
    })
  );
};

export const fillKieliversiotSection = async (page: Page) => {
  await withinSection(page, 'kieliversiot', async section => {
    await selectLanguages(section, ['suomi']);
  });
};

const assertOnFrontPage = (page: Page) =>
  expect(page).toHaveURL(/\/kouta?\/\?.+$/);

export const assertNoUnsavedChangesDialog = async (page: Page) => {
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'ilmoitukset.tallentamattomiaMuutoksia.otsikko',
    })
  ).toBeHidden();
  await assertOnFrontPage(page);
};

export const confirmDelete = async (page: Page) => {
  await page.getByRole('button', { name: 'ilmoitukset.jatka' }).click();
  await assertOnFrontPage(page);
};

export const fillAsyncSelect = async (
  loc: Locator,
  input: string,
  optionMatch: string = input
) => {
  const isLocSelect = await loc.evaluate(el =>
    el.classList.contains('Select__')
  );
  let selectLoc = loc;
  if (!isLocSelect) {
    selectLoc = loc.locator('.Select__');
  }
  const textbox = selectLoc.getByRole('textbox');
  await textbox.scrollIntoViewIfNeeded();
  await selectLoc.getByRole('textbox').fill(input);
  const options = selectLoc.getByRole('option', { name: optionMatch });
  await expect(options).not.toHaveCount(0);
  await options.first().click();
};

export const fillOrgSection = (page: Page, orgOid: string) =>
  withinSection(page, 'organisaatio', async section => {
    await fillAsyncSelect(section.getByTestId('organisaatioSelect'), orgOid);
  });

export const getWrapperByLabel = (
  l: Locator,
  nameMatch: string | RegExp,
  opts?: { exact?: boolean }
) => {
  return parent(l.getByText(nameMatch, opts));
};

export const fillDateTime = async (
  locator: Locator,
  { date, time }: { date: string; time: string }
) => {
  await locator.getByTestId('DateTimeInput__Date').locator('input').fill(date);
  await locator.getByTestId('DateTimeInput__Time').locator('input').fill(time);
};

export const fillTreeSelect = async (loc: Locator, value: Array<string>) => {
  for (const val of value) {
    await parent(loc.locator(`input[type="checkbox"][name="${val}"]`)).click();
  }
};

const isTutkintoonJohtava = (koulutustyyppi?: string) =>
  includes(['amk', 'yo', 'amm', 'lk'], koulutustyyppi);

export const fillKoulutustyyppiSelect = async (
  loc: Locator,
  koulutustyyppiPath: Array<string>
) => {
  const johtaaTutkintoon = isTutkintoonJohtava(last(koulutustyyppiPath));

  if (johtaaTutkintoon) {
    await loc
      .getByRole('button', {
        name: 'koulutustyyppivalikko.tutkintoonJohtavatKoulutustyypit',
      })
      .click();
  } else {
    await loc
      .getByRole('button', {
        name: 'koulutustyyppivalikko.muutKoulutustyypit',
      })
      .click();
  }

  for (const option of koulutustyyppiPath) {
    await fillRadioValue(loc, option);
  }
};

export const fillKoulutustyyppiSection = async (
  page: Page,
  koulutustyyppiPath: Array<string>
) =>
  withinSection(page, 'koulutustyyppi', async section => {
    await fillKoulutustyyppiSelect(section, koulutustyyppiPath);
  });

export const getSelectByLabel = (loc: Locator, label: string | RegExp) =>
  loc.locator(`label:text("${label}") + .Select__`);

export const fillAjankohtaFields = async (
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
      await ak
        .getByText('yleiset.aloitusHenkilokohtaisenSuunnitelmanMukaisesti')
        .click();
      await typeToEditor(ak, 'Henkilökohtaisen suunnitelman lisätiedot');
  }
};

export const fillYhteystiedotSection = (page: Page) =>
  withinSection(page, 'yhteyshenkilot', async section => {
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
  });

export const fillYhteystiedotWithoutVerkkosivuSection = (page: Page) =>
  withinSection(page, 'yhteyshenkilot', async section => {
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
      .getByRole('textbox', { name: 'yleiset.verkkosivun-teksti', exact: true })
      .fill('verkkosivun teksti');
  });

export const fillYhteystiedotWithoutVerkkosivuTekstiSection = (page: Page) =>
  withinSection(page, 'yhteyshenkilot', async section => {
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
  });

export const copyPohja = (page: Page, baseEntityName: string) =>
  withinSection(page, 'pohja', async section => {
    await getLabel(section, '.kopioiPohjaksi').click();
    const pohjaWrapper = getFieldWrapperByName(section, 'pohja.valinta');
    await fillAsyncSelect(pohjaWrapper, baseEntityName);
    await jatka(section);
  });

export const assertTilaIs = async (
  page: Page,
  value: string = 'tallennettu'
) => {
  await expect(getRadio(getSection(page, 'tila'), value)).toBeChecked();
};

export const assertBaseTilaNotCopied = async (
  page: Page,
  baseEntityName: string
) => {
  await copyPohja(page, baseEntityName);
  await assertTilaIs(page, 'tallennettu');
};

export const getTableInput = (loc: Locator) => loc.locator('.TableInput__');

export const fillTilaisuus = async (section: Locator) => {
  await section.getByTestId('lisaaTilaisuusButton').click();
  await section.getByTestId('osoite').locator('input').fill('osoite');
  await fillAsyncSelect(section.getByTestId('postinumero'), '00350');
  await fillDateTime(section.getByTestId('alkaa'), {
    date: '02.04.2019',
    time: '10:45',
  });

  await fillDateTime(section.getByTestId('paattyy'), {
    date: '02.04.2019',
    time: '19:00',
  });

  await section
    .getByTestId('jarjestamispaikka')
    .locator('input')
    .fill('paikka');
  await typeToEditor(section.getByTestId('lisatietoja'), 'lisatietoja');
};

export const fillValintakokeetSection = (
  page: Page,
  { withValintaperusteenKokeet }
) =>
  withinSection(page, 'valintakokeet', async section => {
    await typeToEditor(
      section.getByTestId('yleisKuvaus'),
      'Valintakokeiden kuvaus'
    );
    if (withValintaperusteenKokeet) {
      await fillTilaisuus(section.getByTestId('valintaperusteenValintakokeet'));
    }

    const kokeetTaiLisanaytot = section.getByTestId('kokeetTaiLisanaytot');
    await kokeetTaiLisanaytot
      .getByTestId('lisaaKoeTaiLisanayttoButton')
      .click();
    await fillAsyncSelect(
      kokeetTaiLisanaytot.getByTestId('kokeenTaiLisanaytonTyyppi'),
      'Kielikoe'
    );
    await kokeetTaiLisanaytot
      .getByTestId('hakijalleNakyvaNimi')
      .locator('input')
      .fill('nimi');

    await typeToEditor(
      kokeetTaiLisanaytot.getByTestId('tietoaHakijalle'),
      'Tietoa hakijalle'
    );

    await kokeetTaiLisanaytot
      .getByTestId('vahimmaispistemaara')
      .locator('input')
      .fill('10,03');

    await getLabel(
      kokeetTaiLisanaytot,
      'koeTaiLisanaytto.liittyyEnnakkovalmistautumista'
    ).click();

    await typeToEditor(
      kokeetTaiLisanaytot.getByTestId('ohjeetEnnakkovalmistautumiseen'),
      'ohjeet ennakkovalmistautumiseen'
    );

    await getLabel(
      kokeetTaiLisanaytot,
      'koeTaiLisanaytto.erityisjarjestelytMahdollisia'
    ).click();

    await typeToEditor(
      kokeetTaiLisanaytot.getByTestId('ohjeetErityisjarjestelyihin'),
      'ohjeet erityisjärjestelyihin'
    );
    await fillTilaisuus(kokeetTaiLisanaytot);
  });

// For debugging
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const outerHTML = (l: Locator) => l.evaluate(el => el.outerHTML);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const innerHTML = (l: Locator) => l.evaluate(el => el.innerHTML);
