import path from 'path';

import { BrowserContext, Page, Route, expect } from '@playwright/test';
import { toLower } from 'lodash';

const MOCKS_PATH = path.resolve(__dirname, '../cypress/mocks');

export const mocksFromFile = async (
  ctx: { route: Page['route'] },
  fileName: string
) => {
  const mocks: Array<{
    url: string;
    method: string;
    response: { status: number; body: any };
  }> = (await import(path.resolve(MOCKS_PATH, fileName))).default;

  await Promise.all(
    mocks.map(async mock => {
      const { url, response } = mock;
      await ctx.route(
        url,
        async route =>
          await route.fulfill({
            status: response.status,
            json: response.body,
          })
      );
    })
  );
};

export const getCookie = async (context: BrowserContext, name: string) => {
  const cookies = await context.cookies();
  return cookies.find(c => c.name === name)?.value;
};

export const expectURLEndsWith = (page: Page, urlEnd: string) =>
  expect(page).toHaveURL(new RegExp(urlEnd + '$'));

const FIXTURES_PATH = path.resolve(__dirname, '../cypress/fixtures');

export const fixtureFromFile = (fileName: string) => (route: Route) =>
  route.fulfill({ path: path.resolve(FIXTURES_PATH, fileName) });

export const fixtureJSON = (data: Serializable) => (route: Route) =>
  route.fulfill({ json: data });

export const OPH_TEST_ORGANISAATIO_OID = '1.2.246.562.10.48587687889';

export const wrapMutationTest =
  (page: Page, options: any) => async (run: () => void) => {
    const { entity, oid, id } = options;

    const entityLower = toLower(entity);

    const responsePromise = page.waitForResponse(res => {
      const jsonData = res.request().postDataJSON();
      return res.url().endsWith(`/kouta-backend/${entityLower}`) &&
        ['POST', 'PUT'].includes(res.request().method()) &&
        oid
        ? jsonData.oid === oid
        : jsonData.id === id;
    });

    await run();

    const response = await responsePromise;
    await expect(response.body()).toMatchSnapshot();
  };

export const getSelectOption = (page: Page) => (value: string) =>
  page.getByRole('option', { name: value });
