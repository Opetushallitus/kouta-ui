import { merge } from 'lodash';

import createKoodi from '#/cypress/data/koodi';
import createOrganisaatio from '#/cypress/data/organisaatio';
import { stubKoodiRoute, stubCommonRoutes } from '#/cypress/utils';

export const stubOppilaitosFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  cy.intercept(
    {
      method: 'POST',
      url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    },
    {
      body: [
        merge(createOrganisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );
};
