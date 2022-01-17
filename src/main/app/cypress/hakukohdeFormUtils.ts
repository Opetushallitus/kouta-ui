import { sub } from 'date-fns';
import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import haku from '#/cypress/data/haku';
import hakukohde from '#/cypress/data/hakukohde';
import koulutus from '#/cypress/data/koulutus';
import toteutus from '#/cypress/data/toteutus';
import valintaperuste from '#/cypress/data/valintaperuste';
import hakukohdeMocks from '#/cypress/mocks/hakukohde.mock.json';
import lukioMocks from '#/cypress/mocks/lukio.mocks.json';
import {
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
  withinSection,
} from '#/cypress/utils';
import { HAKUTAPA_YHTEISHAKU_KOODI_URI } from '#/src/constants';

const selectedToimipisteNimi =
  /stadin ammatti- ja aikuisopisto, myllypuron toimipaikka/i;

export const fillJarjestyspaikkaSection = () => {
  withinSection('jarjestyspaikkaOid', () => {
    cy.findByText(selectedToimipisteNimi).click();
  });
};

export const prepareTest = ({
  tyyppi,
  hakuOid,
  hakukohdeOid,
  organisaatioOid,
  edit = false,
  tarjoajat,
  hakutapaKoodiUri = HAKUTAPA_YHTEISHAKU_KOODI_URI,
  hakukohteenLiittaminenHasExpired = false,
  hakukohteenMuokkaaminenHasExpired = false,
  hakuWithoutTakarajat = false,
  hakuWithoutMuokkaamisenTakaraja = false,
}) => {
  const toteutusOid = '2.1.1.1.1.1';
  const koulutusOid = '3.1.1.1.1';
  const valintaperusteId = '649adb37-cd4d-4846-91a9-84b58b90f928';

  const testHakukohdeFields = {
    toteutusOid,
    hakuOid,
    organisaatioOid,
    oid: hakukohdeOid,
    valintaperusteId,
  };

  playMocks(hakukohdeMocks);
  if (tyyppi === 'lk') {
    playMocks(lukioMocks);
  }
  stubHakukohdeFormRoutes({
    organisaatioOid,
    hakuOid,
    hakutapaKoodiUri,
    hakukohteenLiittaminenHasExpired,
    hakukohteenMuokkaaminenHasExpired,
    hakuWithoutTakarajat,
    hakuWithoutMuokkaamisenTakaraja,
  });

  cy.intercept(
    { method: 'GET', url: `**/toteutus/${toteutusOid}` },
    {
      body: merge(toteutus({ tyyppi }), {
        oid: toteutusOid,
        organisaatioOid,
        koulutusOid: koulutusOid,
        tila: 'julkaistu',
        tarjoajat,
      }),
    }
  );

  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}` },
    {
      body: merge(koulutus({ tyyppi }), {
        oid: koulutusOid,
        tarjoajat,
        organisaatioOid: organisaatioOid,
        tila: 'julkaistu',
      }),
    }
  );

  cy.intercept(
    { method: 'GET', url: '**/valintaperuste/list**' },
    {
      body: [
        merge(valintaperuste(), {
          id: valintaperusteId,
          nimi: { fi: 'Valintaperusteen nimi' },
          tila: 'julkaistu',
        }),
      ],
    }
  );

  cy.intercept(
    { method: 'GET', url: `**/valintaperuste/${valintaperusteId}` },
    {
      body: merge(valintaperuste(), {
        id: valintaperusteId,
        nimi: { fi: 'Valintaperusteen nimi' },
        tila: 'julkaistu',
      }),
    }
  );

  if (edit) {
    cy.intercept(
      { method: 'GET', url: `**/hakukohde/${hakukohdeOid}` },
      { body: merge(hakukohde(), testHakukohdeFields) }
    );
  }

  cy.visit(
    edit
      ? `/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      : `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${hakuOid}/hakukohde`
  );
};

export const stubHakukohdeFormRoutes = ({
  organisaatioOid,
  hakuOid,
  hakutapaKoodiUri,
  hakukohteenLiittaminenHasExpired,
  hakukohteenMuokkaaminenHasExpired,
  hakuWithoutTakarajat,
  hakuWithoutMuokkaamisenTakaraja,
}) => {
  stubCommonRoutes();

  let hakuMockData = haku({ hakutapaKoodiUri });
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

    const now = sub(new Date(takaraja), { days: 1 });
    cy.clock(now, ['Date']);
  }

  cy.intercept(
    { method: 'GET', url: `**/haku/${hakuOid}` },
    {
      body: merge(hakuMockData, {
        oid: hakuOid,
        organisaatioOid: organisaatioOid,
        hakulomaketyyppi: 'muu',
        tila: 'julkaistu',
      }),
    }
  );

  cy.intercept({ method: 'GET', url: `**/hakukohde/list**` }, { body: [] });

  stubHakemuspalveluLomakkeetRoute();
  stubOppijanumerorekisteriHenkiloRoute();
};
