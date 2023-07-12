import { Page } from '@playwright/test';

import { fixtureJSON } from './playwright-mock-utils';

export const stubONRHenkiloRoute = async (
  page: Page,
  { henkilo = { etunimet: 'John', sukunimi: 'Doe' } } = {}
) => {
  await page.route(
    '/oppijanumerorekisteri-service/henkilo/',
    fixtureJSON(henkilo)
  );
};
