import { merge } from 'lodash';

import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from '#/cypress/utils';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import organisaatio from '#/cypress/data/organisaatio';

export const stubKoulutusFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae**`,
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
    {
      method: 'GET',
      url: `**/koulutus/list?organisaatioOid=${organisaatioOid}`,
    },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: `**/koulutus/*/toteutukset/list**` },
    { body: [] }
  );

  stubOppijanumerorekisteriHenkiloRoute();
};
