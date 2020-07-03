import { merge } from 'lodash';

import organisaatio from '#/cypress/data/organisaatio';
import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from '#/cypress/utils';

export const stubSoraKuvausFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    ],
  });

  cy.route({
    method: 'GET',
    url: '**/sora-kuvaus/list**',
    response: [],
  });

  stubOppijanumerorekisteriHenkiloRoute();
};
