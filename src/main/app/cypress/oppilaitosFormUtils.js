import { merge } from 'lodash';

import createKoodi from '#/cypress/data/koodi';
import createOrganisaatio from '#/cypress/data/organisaatio';
import createOrganisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import { stubKoodiRoute, stubKoodistoRoute } from '#/cypress/utils';

export const stubOppilaitosFormRoutes = ({ organisaatioOid }) => {
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  stubKoodistoRoute({ koodisto: 'organisaationkuvaustiedot', cy });

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      merge(createOrganisaatio(), {
        oid: organisaatioOid,
      }),
    ],
  });

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?oid=${organisaatioOid}**`,
    response: createOrganisaatioHierarkia({ rootOid: organisaatioOid }),
  });
};
