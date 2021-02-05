import { merge } from 'lodash';
import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import valintaperusteMocks from '#/cypress/mocks/valintaperuste.mock.json';

import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from './utils';

import organisaatio from './data/organisaatio';
import soraKuvaus from './data/soraKuvaus';
import organisaatioHierarkia from './data/organisaatioHierarkia';

export const stubValintaperusteFormRoutes = ({ organisaatioOid }) => {
  playMocks(valintaperusteMocks);
  stubCommonRoutes();

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?oid=${organisaatioOid}**`,
    },
    { body: organisaatioHierarkia({ rootOid: organisaatioOid }) }
  );

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    },
    {
      body: merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    }
  );

  cy.intercept(
    {
      method: 'POST',
      url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    },
    {
      body: [
        merge(organisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );

  cy.intercept(
    { method: 'GET', url: '**/valintaperuste/list**' },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: '**/sorakuvaus/list**' },
    {
      body: [...new Array(10)].map((v, i) =>
        merge(soraKuvaus(), {
          nimi: { fi: `Sora-kuvaus ${i}` },
          id: i.toString(),
          tila: 'julkaistu',
        })
      ),
    }
  );

  cy.intercept(
    { method: 'GET', url: '**/sorakuvaus/1' },
    {
      body: merge(soraKuvaus(), {
        nimi: { fi: `Sora-kuvaus 1` },
        id: 1,
        tila: 'julkaistu',
      }),
    }
  );

  stubOppijanumerorekisteriHenkiloRoute();
};
