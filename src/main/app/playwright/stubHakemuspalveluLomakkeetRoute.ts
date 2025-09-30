import { type Page } from '@playwright/test';

import { fixtureJSON } from '#/playwright/playwright-mock-utils';

export const stubHakemuspalveluLomakkeetRoute = async (
  page: Page,
  { lomakkeet = [{ name: { fi: 'Lomake 1' }, key: 'lomake_1' }] } = {}
) => {
  await page.route(
    '**/lomake-editori/api/forms',
    fixtureJSON({ forms: lomakkeet })
  );
};
