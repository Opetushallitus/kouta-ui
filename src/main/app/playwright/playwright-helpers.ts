import path from 'path';

import {
  BrowserContext,
  Locator,
  Page,
  TestInfo,
  expect,
} from '@playwright/test';
import { split, toLower } from 'lodash';

import { ENTITY } from '#/src/constants';

export const getCookie = async (context: BrowserContext, name: string) => {
  const cookies = await context.cookies();
  return cookies.find(c => c.name === name)?.value;
};

export const expectURLEndsWith = (page: Page, urlEnd: string) =>
  expect(page).toHaveURL(new RegExp(urlEnd + '$'));

export const OPH_TEST_ORGANISAATIO_OID = '1.2.246.562.10.48587687889';

export const wrapMutationTest =
  (entity: ENTITY) =>
  async (args: { page: Page; testInfo: TestInfo }, run: () => Promise<any>) => {
    const { page, testInfo } = args;

    testInfo.snapshotPath = (name: string) =>
      `${path.dirname(testInfo.file)}/snapshots/${
        split(testInfo.titlePath[0], '.')?.[0]
      }/${name}`;

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

// For debugging
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const outerHTML = (l: Locator) => l.evaluate(el => el.outerHTML);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const innerHTML = (l: Locator) => l.evaluate(el => el.innerHTML);
