import { merge } from 'lodash';

import {
  stubKoodistoRoute,
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubKoodiRoute,
  stubCommonRoutes,
  jatka,
} from '#/cypress/utils';

import haku from '#/cypress/data/haku';
import hakukohde from '#/cypress/data/hakukohde';
import createKoodi from '#/cypress/data/koodi';
import koulutus from '#/cypress/data/koulutus';
import toteutus from '#/cypress/data/toteutus';
import valintaperuste from '#/cypress/data/valintaperuste';
import { addMockFileRoutes } from './mockUtils';

const toimipisteTarjoajat = [
  '1.2.246.562.10.16538823663',
  '1.2.246.562.10.2013081415065445951365',
  '1.2.246.562.10.20485193278',
  '1.2.246.562.10.20866993056',
  '1.2.246.562.10.23017513880',
  '1.2.246.562.10.45854578546',
  '1.2.246.562.10.55355715099',
  '1.2.246.562.10.55711304158',
  '1.2.246.562.10.56139411567',
  '1.2.246.562.10.60465978314',
  '1.2.246.562.10.656909794910',
  '1.2.246.562.10.78321186062',
  '1.2.246.562.10.879177258610',
  '1.2.246.562.10.93115250668',
];

const selectedToimipisteNimi = /stadin ammatti- ja aikuisopisto, myllypuron toimipaikka/i;

const selectedToimipiste = '1.2.246.562.10.45854578546';

export const fillJarjestyspaikkaSection = ({ jatka: jatkaProp = true }) => {
  cy.findByTestId('jarjestyspaikkaOidSection').within(() => {
    toimipisteTarjoajat.forEach(oid => {
      cy.get(`[value="${oid}"]`).should('exist');
      if (oid === selectedToimipiste) {
        cy.get(`[value="${oid}"]`).should('not.be.disabled');
      } else {
        cy.get(`[value="${oid}"]`).should('be.disabled');
      }
    });

    cy.findByText(selectedToimipisteNimi).click();
    if (jatkaProp) {
      jatka();
    }
  });
};

export const prepareTest = ({
  tyyppi,
  hakuOid,
  hakukohdeOid,
  organisaatioOid,
  edit = false,
  tarjoajat,
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

  cy.server();

  addMockFileRoutes('hakukohde.mock.json');
  stubHakukohdeFormRoutes({ organisaatioOid, hakuOid });

  cy.route({
    method: 'GET',
    url: `**/toteutus/${toteutusOid}`,
    response: merge(toteutus({ tyyppi }), {
      oid: toteutusOid,
      organisaatioOid,
      koulutusOid: koulutusOid,
      tila: 'julkaistu',
      tarjoajat,
    }),
  });

  cy.route({
    method: 'GET',
    url: `**/koulutus/${koulutusOid}`,
    response: merge(koulutus({ tyyppi }), {
      oid: koulutusOid,
      tarjoajat,
      organisaatioOid: organisaatioOid,
      tila: 'julkaistu',
    }),
  });

  cy.route({
    method: 'GET',
    url: '**/valintaperuste/list**',
    response: [
      merge(valintaperuste(), {
        id: valintaperusteId,
        nimi: { fi: 'Valintaperusteen nimi' },
        tila: 'julkaistu',
      }),
    ],
  });

  cy.route({
    method: 'GET',
    url: `**/valintaperuste/${valintaperusteId}`,
    response: merge(valintaperuste(), {
      id: valintaperusteId,
      nimi: { fi: 'Valintaperusteen nimi' },
      tila: 'julkaistu',
    }),
  });

  cy.route({
    method: 'GET',
    url: `**/hakukohde/${hakukohdeOid}`,
    response: merge(hakukohde(), testHakukohdeFields),
  });

  edit
    ? cy
        .route({
          method: 'POST',
          url: '**/hakukohde',
          response: {
            muokattu: false,
          },
        })
        .as('updateHakukohdeRequest')
    : cy
        .route({
          method: 'PUT',
          url: '**/hakukohde',
          response: {
            oid: hakukohdeOid,
          },
        })
        .as('createHakukohdeRequest');

  cy.visit(
    edit
      ? `/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      : `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${hakuOid}/hakukohde`
  );
};

export const stubHakukohdeFormRoutes = ({ organisaatioOid, hakuOid }) => {
  stubCommonRoutes();

  stubKoodistoRoute({ koodisto: 'pohjakoulutusvaatimustoinenaste' });
  stubKoodistoRoute({ koodisto: 'kausi' });
  stubKoodistoRoute({ koodisto: 'valintakokeentyyppi' });
  stubKoodistoRoute({ koodisto: 'liitetyypitamm' });
  stubKoodistoRoute({ koodisto: 'kausi' });
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));
  stubKoodiRoute(
    createKoodi({ koodisto: 'posti', koodiArvo: '00350', versio: 1 })
  );

  cy.route({
    method: 'GET',
    url: `**/haku/${hakuOid}`,
    response: merge(haku(), {
      oid: hakuOid,
      organisaatioOid: organisaatioOid,
      hakulomaketyyppi: 'muu',
      tila: 'julkaistu',
    }),
  });

  cy.route({
    method: 'GET',
    url: `**/hakukohde/list**`,
    response: [],
  });

  stubHakemuspalveluLomakkeetRoute();
  stubOppijanumerorekisteriHenkiloRoute();
};
