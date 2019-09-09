import merge from 'lodash/merge';

import {
  stubKoodistoRoute,
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubKoodiRoute,
} from './utils';

import organisaatio from './data/organisaatio';
import haku from './data/haku';
import createKoodi from './data/koodi';

export const stubHakukohdeFormRoutes = ({ cy, organisaatioOid, hakuOid }) => {
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

  stubKoodistoRoute({ koodisto: 'pohjakoulutusvaatimustoinenaste', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodistoRoute({ koodisto: 'valintakokeentyyppi', cy });
  stubKoodistoRoute({ koodisto: 'liitetyypitamm', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  cy.route({
    method: 'GET',
    url: `**/haku/${hakuOid}`,
    response: merge(haku(), {
      oid: hakuOid,
      organisaatioOid: organisaatioOid,
    }),
  });

  cy.route({
    method: 'GET',
    url: `**/hakukohde/list**`,
    response: [],
  });

  stubHakemuspalveluLomakkeetRoute({ cy });
  stubOppijanumerorekisteriHenkiloRoute({ cy });
};
