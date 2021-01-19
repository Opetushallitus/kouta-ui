import { merge } from 'lodash';
import { playMockFile } from 'kto-ui-common/cypress/mockUtils';

import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from './utils';

import organisaatio from './data/organisaatio';
import soraKuvaus from './data/soraKuvaus';

export const stubValintaperusteFormRoutes = ({ organisaatioOid }) => {
  playMockFile('valintaperuste.mock.json');
  stubCommonRoutes();

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    response: merge(organisaatio(), {
      oid: organisaatioOid,
    }),
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

  cy.route({
    method: 'GET',
    url: '**/valintaperuste/list**',
    response: [],
  });

  cy.route({
    method: 'GET',
    url: '**/sorakuvaus/list**',
    response: [...new Array(10)].map((v, i) =>
      merge(soraKuvaus(), {
        nimi: { fi: `Sora-kuvaus ${i}` },
        id: i.toString(),
        tila: 'julkaistu',
      })
    ),
  });

  cy.route({
    method: 'GET',
    url: '**/sorakuvaus/1',
    response: merge(soraKuvaus(), {
      nimi: { fi: `Sora-kuvaus 1` },
      id: 1,
      tila: 'julkaistu',
    }),
  });

  stubOppijanumerorekisteriHenkiloRoute();
};
