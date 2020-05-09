import { merge } from 'lodash';
import createKoodisto from './data/koodisto';

import organisaatio from './data/organisaatio';
import createKoodi from './data/koodi';

import {
  stubKoodistoRoute,
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubKoodiRoute,
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

  stubKoodistoRoute({ koodisto: 'haunkohdejoukontarkenne', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodistoRoute({ koodisto: 'opetuspaikkakk', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodistoRoute({ koodisto: 'posti', cy });
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  cy.route({
    method: 'GET',
    url: `**/koodisto-service/rest/json/haunkohdejoukko/koodi**`,
    response: createKoodisto({ koodisto: 'haunkohdejoukko' }).map((v, index) =>
      index === 0
        ? {
            ...v,
            koodiUri: 'haunkohdejoukko_12',
          }
        : v
    ),
  });

  cy.route({
    method: 'GET',
    url: `**/koodisto-service/rest/json/hakutapa/koodi**`,
    response: createKoodisto({ koodisto: 'hakutapa' }).map((v, index) =>
      index === 0
        ? {
            ...v,
            koodiUri: 'hakutapa_01',
          }
        : v
    ),
  });

  cy.route({
    method: 'GET',
    url: '**/haku/list**',
    response: [],
  });

  cy.route({
    method: 'GET',
    url: `**/toteutus/list**`,
    response: [],
  });

  stubHakemuspalveluLomakkeetRoute({ cy });
  stubOppijanumerorekisteriHenkiloRoute({ cy });
};
