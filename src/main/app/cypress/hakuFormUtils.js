import merge from 'lodash/merge';

import organisaatio from './data/organisaatio';
import {
  stubKoodistoRoute,
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
} from './utils';

export const stubHakuFormRoutes = ({ cy, organisaatioOid }) => {
  cy.server();

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    response: merge(organisaatio(), {
      oid: organisaatioOid,
    }),
  });

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    ],
  });

  stubKoodistoRoute({ koodisto: 'haunkohdejoukko', cy });
  stubKoodistoRoute({ koodisto: 'hakutapa', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodistoRoute({ koodisto: 'opetuspaikkakk', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });

  cy.route({
    method: 'GET',
    url: '**/haku/list**',
    response: [],
  });

  stubHakemuspalveluLomakkeetRoute({ cy });
  stubOppijanumerorekisteriHenkiloRoute({ cy });
};
