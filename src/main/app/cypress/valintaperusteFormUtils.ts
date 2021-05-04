import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import _ from 'lodash';

import valintaperusteMocks from '#/cypress/mocks/valintaperuste.mock.json';

import organisaatio from './data/organisaatio';
import organisaatioHierarkia from './data/organisaatioHierarkia';
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
      body: _.merge(organisaatio(), {
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
        _.merge(organisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );

  stubOppijanumerorekisteriHenkiloRoute();
};
