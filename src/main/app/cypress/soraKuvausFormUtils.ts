import { merge } from 'lodash/fp';

import organisaatio from '#/cypress/data/organisaatio';
import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from '#/cypress/utils';

export const stubSoraKuvausFormRoutes = ({ organisaatioOid }) => {
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

  cy.intercept({ method: 'GET', url: '**/sorakuvaus/list**' }, { body: [] });

  stubOppijanumerorekisteriHenkiloRoute();
};
