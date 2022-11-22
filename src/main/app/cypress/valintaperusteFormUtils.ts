import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import valintaperusteMocks from '#/cypress/mocks/valintaperuste.mock.json';

import organisaatio from './data/organisaatio';
import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from './utils';

export const stubValintaperusteFormRoutes = ({ organisaatioOid }) => {
  playMocks(valintaperusteMocks);
  stubCommonRoutes();

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
      url: '**/kouta-backend/organisaatio/organisaatiot',
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

  stubOppijanumerorekisteriHenkiloRoute();
};
