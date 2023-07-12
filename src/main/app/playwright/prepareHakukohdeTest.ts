import { merge } from 'lodash';

import koulutus from '#/playwright/fixtures/koulutus';
import toteutus from '#/playwright/fixtures/toteutus';
import valintaperuste from '#/playwright/fixtures/valintaperuste';
import { fixtureJSON, mocksFromFile } from '#/playwright/playwright-mock-utils';
import { stubHakukohdeRoutes } from '#/playwright/stubHakukohdeRoutes';
import { stubOrganisaatioRoutes } from '#/playwright/stubOrganisaatioRoutes';
import { HAKUTAPA_YHTEISHAKU_KOODI_URI } from '#/src/constants';

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
