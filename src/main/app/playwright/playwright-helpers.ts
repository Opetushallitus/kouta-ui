import path from 'path';

import {
  BrowserContext,
  Locator,
  Page,
  TestInfo,
  expect,
} from '@playwright/test';
import { deburr, last, split, toLower } from 'lodash';

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

    // Tallennetaan snapshot tiedostoon ./snapshots/<testitiedosto>/<testin-nimi>.json
    testInfo.snapshotPath = (name: string) =>
      `${path.dirname(testInfo.file)}/snapshots/${
        split(testInfo.titlePath[0], '.')?.[0]
      }/${deburr(toLower(name))}`;

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
    await expect(reqData).toMatchSnapshot(`${testInfo.title}.json`);
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

export const typeToEditor = (loc: Locator, text: string) =>
  loc.locator('.Editor__').locator('[contenteditable="true"]').fill(text);

export const setFakeTime = async (page: Page, fakeDate: Date) => {
  const fakeDateValue = fakeDate.valueOf();
  await page.addInitScript(`{
      Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(${fakeDateValue});
          } else {
            super(...args);
          }
        }
      }
      Date.now = () => ${fakeDateValue};
    }`);
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

const selectLanguages = async (selector: Locator, selectedLanguages = []) => {
  const languages = ['en', 'fi', 'sv'];
  for (const lang of languages) {
    const langInput = selector.locator(`input[name="${lang}"]`);
    if (selectedLanguages.includes(lang)) {
      await langInput.setChecked(true, { force: true });
    } else {
      await langInput.setChecked(false, { force: true });
    }
  }
};

export const fillKieliversiotSection = (page: Page) =>
  withinSection(page, 'kieliversiot', async section => {
    await selectLanguages(section, ['fi']);
  });

const assertOnFrontPage = (page: Page) =>
  expect(page).toHaveURL(/\/kouta?\/\?.+$/);

export const assertNoUnsavedChangesDialog = async (page: Page) => {
  page.getByRole('link', { name: 'Home' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'ilmoitukset.tallentamattomiaMuutoksia.otsikko',
    })
  ).toBeHidden();
  await assertOnFrontPage(page);
};

export const confirmDelete = async (page: Page) => {
  await page
    .getByRole('button', { name: 'ilmoitukset.luonnoksenPoisto.jatka' })
    .click();
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

const isTutkintoonJohtava = (koulutustyyppi: string) =>
  ['amk', 'yo', 'amm', 'lk'].includes(koulutustyyppi);

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

export const assertBaseTilaNotCopied = async (
  page: Page,
  baseEntityName: string
) => {
  await withinSection(page, 'pohja', async section => {
    await getLabel(section, '.kopioiPohjaksi').click();
    const pohjaWrapper = getFieldWrapperByName(section, 'pohja.valinta');
    await fillAsyncSelect(pohjaWrapper, baseEntityName);
    await jatka(section);
  });
  await expect(getRadio(getSection(page, 'tila'), 'tallennettu')).toBeChecked();
};

// For debugging
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const outerHTML = (l: Locator) => l.evaluate(el => el.outerHTML);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const innerHTML = (l: Locator) => l.evaluate(el => el.innerHTML);
