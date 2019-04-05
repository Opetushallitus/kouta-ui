import merge from 'lodash/merge';

import { stubKoodistoRoute } from './utils';
import organisaatio from './data/organisaatio';
import haku from './data/haku';

export const stubHakukohdeFormRoutes = ({ cy, organisaatioOid, hakuOid }) => {
  cy.server();

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    response: merge(organisaatio(), {
      oid: organisaatioOid,
    }),
  });

  stubKoodistoRoute({ koodisto: 'pohjakoulutusvaatimustoinenaste', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodistoRoute({ koodisto: 'valintakokeentyyppi', cy });
  stubKoodistoRoute({ koodisto: 'liitetyypitamm', cy });

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
};
