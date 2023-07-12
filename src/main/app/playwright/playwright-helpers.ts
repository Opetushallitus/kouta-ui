import path from 'path';

import {
  BrowserContext,
  Locator,
  Page,
  TestInfo,
  expect,
} from '@playwright/test';
import { deburr, split, toLower } from 'lodash';

import { ENTITY } from '#/src/constants';

export const getCookie = async (context: BrowserContext, name: string) => {
  const cookies = await context.cookies();
  return cookies.find(c => c.name === name)?.value;
};

export const assertURLEndsWith = (page: Page, urlEnd: string) =>
  expect(page).toHaveURL(new RegExp(urlEnd + '$'));

export const OPH_TEST_ORGANISAATIO_OID = '1.2.246.562.10.48587687889';

export const wrapMutationTest =
  (entity: ENTITY) =>
  async (args: { page: Page; testInfo: TestInfo }, run: () => Promise<any>) => {
    const { page, testInfo } = args;

    testInfo.snapshotPath = (name: string) =>
      `${path.dirname(testInfo.file)}/snapshots/${
        split(testInfo.titlePath[0], '.')?.[0]
      }/${deburr(toLower(name))}`;

    const entityLower = toLower(entity);
    const requestPromise = page.waitForRequest(req => {
      const method = req.method();
      const url = req.url();
      return (
        url.endsWith(`/kouta-backend/${entityLower}`) &&
        ['POST', 'PUT'].includes(method)
      );
    });
    await run();
    const request = await requestPromise;

    const reqData = JSON.stringify(JSON.parse(request.postData()), null, 2);
    await expect(reqData).toMatchSnapshot(`${testInfo.title}.json`);
  };

export const getSelectOption = (page: Page) => (value: string) =>
  page.getByRole('option', { name: value });

export const getSection = (page: Page, name: string) =>
  page.getByTestId(`${name}Section`);

export const withinSection =
  (name: string, fn?: (section: Locator) => Promise<any>) =>
  async (
    page: Page,
    { jatka: shouldContinue }: { jatka: boolean } = { jatka: false }
  ) => {
    const section = getSection(page, name);
    const sectionHeading = section.locator('> :first-child');

    const isSectionClosed = await sectionHeading.evaluate(
      el => el.getAttribute('open') === null
    );
    if (isSectionClosed) {
      await sectionHeading.click();
    }
    await fn?.(section);
    if (shouldContinue) {
      await jatka(section);
    }
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

export const getRadio = (loc: Locator, value) =>
  loc.locator(`input[type="radio"][value="${value}"]`);

export const fillTilaSection = (page: Page, tila: string = 'julkaistu') =>
  withinSection('tila', async section => {
    const tilaRadio = getRadio(section, tila);
    const isChecked = await tilaRadio.isChecked();
    if (!isChecked) {
      await parent(tilaRadio).click();
    }
  })(page);

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

export const fillKieliversiotSection = withinSection(
  'kieliversiot',
  async section => {
    await selectLanguages(section, ['fi']);
  }
);

export const assertNoUnsavedChangesDialog = async (page: Page) => {
  page.getByRole('link', { name: 'Home' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'ilmoitukset.tallentamattomiaMuutoksia.otsikko',
    })
  ).toBeHidden();
  await expect(page).toHaveURL(/\/kouta?\/\?.+$/);
};

export const confirmDelete = async (page: Page) => {
  await page
    .getByRole('button', { name: 'ilmoitukset.luonnoksenPoisto.jatka' })
    .click();
};

export const fillAsyncSelect = async (loc: Locator, input: string) => {
  await loc.getByRole('textbox').fill(input);
  const options = loc.getByRole('option', { name: input });
  await options.first().click();
};

export const fillOrgSection = (page: Page, orgOid: string) =>
  withinSection('organisaatio', async section => {
    const orgSelect = section.getByTestId('organisaatioSelect');
    await fillAsyncSelect(orgSelect, orgOid);
  })(page);

export const getWrapperByLabel = (l: Locator, nameMatch: string | RegExp) => {
  return parent(l.getByText(nameMatch));
};

export const fillDateTime = async (
  locator: Locator,
  { date, time }: { date: string; time: string }
) => {
  await locator.getByTestId('DateTimeInput__Date').locator('input').fill(date);
  await locator.getByTestId('DateTimeInput__Time').locator('input').fill(time);
};

// For debugging
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const outerHTML = (l: Locator) => l.evaluate(el => el.outerHTML);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const innerHTML = (l: Locator) => l.evaluate(el => el.innerHTML);
