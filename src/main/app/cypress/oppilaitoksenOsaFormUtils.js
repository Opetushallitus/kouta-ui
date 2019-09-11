import merge from 'lodash/merge';

import createKoodi from './data/koodi';
import createOrganisaatio from './data/organisaatio';
import { stubKoodiRoute } from './utils';

export const stubOppilaitosFormRoutes = ({ organisaatioOid }) => {
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      merge(createOrganisaatio(), {
        oid: organisaatioOid,
      }),
    ],
  });
};
