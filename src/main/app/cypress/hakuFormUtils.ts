import createKoodisto from '#/cypress/data/koodisto';

import organisaatio from '#/cypress/data/organisaatio';
import createKoodi from '#/cypress/data/koodi';

import {
  stubKoodistoRoute,
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubKoodiRoute,
  stubCommonRoutes,
} from './utils';

export const stubHakuFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    response: organisaatio({
      oid: organisaatioOid,
    }),
  });

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      organisaatio({
        oid: organisaatioOid,
      }),
    ],
  });

  stubKoodistoRoute({ koodisto: 'haunkohdejoukontarkenne' });
  stubKoodistoRoute({ koodisto: 'kausi' });
  stubKoodistoRoute({ koodisto: 'opetuspaikkakk' });
  stubKoodistoRoute({ koodisto: 'kausi' });
  stubKoodistoRoute({ koodisto: 'posti' });
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

  stubHakemuspalveluLomakkeetRoute();
  stubOppijanumerorekisteriHenkiloRoute();
};
