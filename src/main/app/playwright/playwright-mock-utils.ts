import path from 'path';

import type { Page, Route } from '@playwright/test';

const MOCKS_PATH = path.resolve(__dirname, './apiMocks');

export const mocksFromFile = async (
  ctx: { route: Page['route'] },
  fileName: string
) => {
  const mocks: Array<{
    url: string;
    method: string;
    response: { status: number; body: any };
  }> = (
    await import(path.resolve(MOCKS_PATH, fileName), { with: { type: 'json' } })
  ).default;

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

const FIXTURES_PATH = path.resolve(__dirname, 'fixtures');

export const fixtureFromFile = (fileName: string) => (route: Route) =>
  route.fulfill({ path: path.resolve(FIXTURES_PATH, fileName) });

export const fixtureJSON = (data: Serializable) => (route: Route) =>
  route.fulfill({ json: data });
