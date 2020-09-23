import { merge } from 'lodash';

import {
  stubKoodistoRoute,
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubKoodiRoute,
  stubCommonRoutes,
} from '#/cypress/utils';

import organisaatio from '#/cypress/data/organisaatio';
import haku from '#/cypress/data/haku';
import hakukohde from '#/cypress/data/hakukohde';
import createKoodi from '#/cypress/data/koodi';
import koulutus from '#/cypress/data/koulutus';
import toteutus from '#/cypress/data/toteutus';
import valintaperuste from '#/cypress/data/valintaperuste';

export const prepareTest = ({
  tyyppi,
  hakuOid,
  hakukohdeOid,
  organisaatioOid,
  edit,
}) => {
  const toteutusOid = '2.1.1.1.1.1';
  const koulutusOid = '3.1.1.1.1';
  const valintaperusteId = '649adb37-cd4d-4846-91a9-84b58b90f928';
  const tarjoajat = ['1.2.3.4.5.6.7', '7.7.7.7.7'];

  const testHakukohdeFields = {
    toteutusOid,
    hakuOid,
    organisaatioOid,
    oid: hakukohdeOid,
    valintaperusteId,
  };

  cy.server();

  stubHakukohdeFormRoutes({ organisaatioOid, hakuOid, tarjoajat });

  cy.route({
    method: 'GET',
    url: `**/toteutus/${toteutusOid}`,
    response: merge(toteutus({ tyyppi }), {
      oid: toteutusOid,
      organisaatioOid: organisaatioOid,
      koulutusOid: koulutusOid,
      tila: 'julkaistu',
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

export const stubHakukohdeFormRoutes = ({
  organisaatioOid,
  hakuOid,
  tarjoajat = [],
}) => {
  stubCommonRoutes();

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    response: merge(organisaatio(), {
      oid: organisaatioOid,
    }),
  });

  tarjoajat.forEach(tarjoajaOid => {
    cy.route({
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?oid=${tarjoajaOid}**`,
      response: merge(organisaatio(), {
        oid: tarjoajaOid,
      }),
    });
  });

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    ],
  });

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
