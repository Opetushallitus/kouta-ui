import _ from 'lodash';

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
        _.merge(createOrganisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );
};
