import { type Page } from '@playwright/test';

import { fixtureJSON } from '#/playwright/playwright-mock-utils';

export const stubKayttoOikeusOmatTiedot = async (
  page: Page,
  organisaatiot?: Array<{
    organisaatioOid: string;
    kayttooikeudet: Array<{ palvelu: 'KOUTA'; oikeus: string }>;
  }>
) => {
  await page.route(
    '**/kayttooikeus-service/henkilo/current/omattiedot',
    fixtureJSON({
      oidHenkilo: '1.2.246.562.24.62301161440',
      username: 'johndoe',
      kayttajaTyyppi: 'VIRKAILIJA',
      organisaatiot: organisaatiot ?? [
        {
          organisaatioOid: '1.2.246.562.10.00000000001',
          kayttooikeudet: [
            {
              palvelu: 'KOUTA',
              oikeus: 'OPHPAAKAYTTAJA',
            },
          ],
        },
      ],
      isAdmin: true,
      isMiniAdmin: true,
      anomusilmoitus: [],
      mfaProvider: null,
    })
  );
};
