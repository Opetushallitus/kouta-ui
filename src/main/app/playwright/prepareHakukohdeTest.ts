import { merge } from 'lodash';

import koulutus from '#/playwright/mocks/koulutus';
import {
  fixtureJSON,
  mocksFromFile,
} from '#/playwright/mocks/playwright-mock-utils';
import { stubOrganisaatioRoutes } from '#/playwright/mocks/stubOrganisaatioRoutes';
import toteutus from '#/playwright/mocks/toteutus';
import valintaperuste from '#/playwright/mocks/valintaperuste';
import { HAKUTAPA_YHTEISHAKU_KOODI_URI } from '#/src/constants';

import { stubHakukohdeRoutes } from './mocks/stubHakukohdeRoutes';

export const toteutusOid = '2.1.1.1.1.1';
export const koulutusOid = '3.1.1.1.1';
export const valintaperusteId = '649adb37-cd4d-4846-91a9-84b58b90f928';

export const prepareHakukohdeTest = async (
  page,
  {
    tyyppi,
    hakuOid,
    organisaatioOid,
    tarjoajat,
    hakutapaKoodiUri = HAKUTAPA_YHTEISHAKU_KOODI_URI,
    hakukohteenLiittaminenHasExpired = false,
    hakukohteenMuokkaaminenHasExpired = false,
    hakuWithoutTakarajat = false,
    hakuWithoutMuokkaamisenTakaraja = false,
  }
) => {
  await mocksFromFile(page, 'hakukohde.mocks.json');

  if (tyyppi === 'lk') {
    await mocksFromFile(page, 'lukio.mocks.json');
  }

  await stubHakukohdeRoutes(page, {
    organisaatioOid,
    hakuOid,
    hakutapaKoodiUri,
    hakukohteenLiittaminenHasExpired,
    hakukohteenMuokkaaminenHasExpired,
    hakuWithoutTakarajat,
    hakuWithoutMuokkaamisenTakaraja,
    tarjoajat,
  });

  await stubOrganisaatioRoutes(page, organisaatioOid);

  await page.route(
    `**/toteutus/${toteutusOid}`,
    fixtureJSON(
      merge(toteutus({ tyyppi }), {
        oid: toteutusOid,
        organisaatioOid,
        koulutusOid: koulutusOid,
        tila: 'julkaistu',
        tarjoajat,
      })
    )
  );

  await page.route(
    `**/koulutus/${koulutusOid}`,
    fixtureJSON(
      merge(koulutus(tyyppi), {
        oid: koulutusOid,
        tarjoajat,
        organisaatioOid: organisaatioOid,
        tila: 'julkaistu',
      })
    )
  );

  await page.route(
    '**/valintaperuste/list*',
    fixtureJSON([
      merge(valintaperuste(), {
        id: valintaperusteId,
        nimi: { fi: 'Valintaperusteen nimi' },
        tila: 'julkaistu',
      }),
    ])
  );

  await page.route(
    `**/valintaperuste/${valintaperusteId}`,
    fixtureJSON(
      merge(valintaperuste(), {
        id: valintaperusteId,
        nimi: { fi: 'Valintaperusteen nimi' },
        tila: 'julkaistu',
      })
    )
  );
};
