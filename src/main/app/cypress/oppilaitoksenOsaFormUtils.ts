import { merge } from 'lodash/fp';

import createOrganisaatio from '#/cypress/data/organisaatio';
import { stubCommonRoutes } from '#/cypress/utils';

export const stubOppilaitosFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

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
