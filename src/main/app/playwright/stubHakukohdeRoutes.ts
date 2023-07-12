import { Page } from '@playwright/test';
import { sub } from 'date-fns';
import { merge } from 'lodash';

import haku from '#/playwright/fixtures/haku';
import organisaatioHierarkia from '#/playwright/fixtures/organisaatioHierarkia';
import { setFakeTime } from '#/playwright/playwright-helpers';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubCommonRoutes } from '#/playwright/stubCommonRoutes';
import { stubHakemuspalveluLomakkeetRoute } from '#/playwright/stubHakemuspalveluLomakkeetRoute';
import { stubONRHenkiloRoute } from '#/playwright/stubONRHenkiloRoute';

export const selectedToimipisteNimi =
  'Stadin ammatti- ja aikuisopisto, Myllypuron toimipaikka';

export const stubHakukohdeRoutes = async (
  page: Page,
  {
    organisaatioOid,
    hakuOid,
    hakutapaKoodiUri,
    hakukohteenLiittaminenHasExpired,
    hakukohteenMuokkaaminenHasExpired,
    hakuWithoutTakarajat,
    hakuWithoutMuokkaamisenTakaraja,
    tarjoajat,
  }: {
    organisaatioOid: string;
    hakuOid: string;
    hakutapaKoodiUri: string;
    hakukohteenLiittaminenHasExpired: boolean;
    hakukohteenMuokkaaminenHasExpired: boolean;
    hakuWithoutTakarajat: boolean;
    hakuWithoutMuokkaamisenTakaraja: boolean;
    tarjoajat: Array<string>;
  }
) => {
  const hakuMockData = haku({ hakutapaKoodiUri });
  if (hakuWithoutTakarajat) {
    hakuMockData.hakukohteenLiittamisenTakaraja = null;
    hakuMockData.hakukohteenMuokkaamisenTakaraja = null;
  }

  if (hakuWithoutMuokkaamisenTakaraja) {
    hakuMockData.hakukohteenMuokkaamisenTakaraja = null;
  }

  if (
    (!hakukohteenLiittaminenHasExpired && !hakukohteenMuokkaaminenHasExpired) ||
    hakuWithoutMuokkaamisenTakaraja
  ) {
    let liittamisenTakaraja = hakuMockData.hakukohteenLiittamisenTakaraja;
    let muokkaamisenTakaraja = hakuMockData.hakukohteenMuokkaamisenTakaraja;
    let takaraja = liittamisenTakaraja;

    if (muokkaamisenTakaraja && muokkaamisenTakaraja < liittamisenTakaraja) {
      takaraja = muokkaamisenTakaraja;
    }

    const fakeNow = sub(new Date(takaraja), { days: 1 });
    await setFakeTime(page, fakeNow);
  }

  await page.route(
    `**/haku/${hakuOid}`,
    fixtureJSON(
      merge(hakuMockData, {
        oid: hakuOid,
        organisaatioOid: organisaatioOid,
        hakulomaketyyppi: 'muu',
        tila: 'julkaistu',
      })
    )
  );

  await stubHakemuspalveluLomakkeetRoute(page);
  await stubONRHenkiloRoute(page);

  await page.route(
    '**/kouta-backend/oppilaitos/oppilaitokset',
    fixtureJSON({
      organisaatioHierarkia: organisaatioHierarkia({
        rootOid: organisaatioOid,
        toimipistenimi: selectedToimipisteNimi,
        jarjestyspaikkaOid: tarjoajat[0],
      }),
    })
  );
  await stubCommonRoutes(page);
};
