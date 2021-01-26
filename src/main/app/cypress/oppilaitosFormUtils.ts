import { merge } from 'lodash';

import createKoodi from '#/cypress/data/koodi';
import createOrganisaatio from '#/cypress/data/organisaatio';
import createOrganisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import {
  stubKoodiRoute,
  stubKoodistoRoute,
  stubCommonRoutes,
} from '#/cypress/utils';

export const stubOppilaitosFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  stubKoodistoRoute({ koodisto: 'organisaationkuvaustiedot' });

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

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?oid=${organisaatioOid}**`,
    },
    { body: createOrganisaatioHierarkia({ rootOid: organisaatioOid }) }
  );
};
