import { merge } from 'lodash';

import organisaatio from './data/organisaatio';
import { stubOppijanumerorekisteriHenkiloRoute } from './utils';

export const stubSoraKuvausFormRoutes = ({ cy, organisaatioOid }) => {
  cy.server();

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

  stubOppijanumerorekisteriHenkiloRoute({ cy });
};
