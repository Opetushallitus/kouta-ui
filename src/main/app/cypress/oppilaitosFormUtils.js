import merge from 'lodash/merge';

import createKoodi from './data/koodi';
import createOrganisaatio from './data/organisaatio';
import createOrganisaatioHierarkia from './data/organisaatioHierarkia';
import { stubKoodiRoute, stubKoodistoRoute } from './utils';

export const stubOppilaitosFormRoutes = ({ organisaatioOid }) => {
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  stubKoodistoRoute({ koodisto: 'koulutuksenlisatiedot', cy });

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
