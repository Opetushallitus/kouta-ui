import _ from 'lodash';

import organisaatio from '#/cypress/data/organisaatio';
import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from '#/cypress/utils';

import organisaatioHierarkia from './data/organisaatioHierarkia';

export const stubSoraKuvausFormRoutes = ({ organisaatioOid }) => {
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

  cy.intercept({ method: 'GET', url: '**/sorakuvaus/list**' }, { body: [] });

  stubOppijanumerorekisteriHenkiloRoute();
};
