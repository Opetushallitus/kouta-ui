import merge from 'lodash/merge';

import { stubKoodistoRoute } from './utils';
import organisaatio from './data/organisaatio';

export const stubValintaperusteFormRoutes = ({ cy, organisaatioOid }) => {
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

  stubKoodistoRoute({ koodisto: 'hakutapa', cy });
  stubKoodistoRoute({ koodisto: 'haunkohdejoukko', cy });
  stubKoodistoRoute({ koodisto: 'valintatapajono', cy });
  stubKoodistoRoute({ koodisto: 'kielitaidonosoittaminen', cy });
  stubKoodistoRoute({ koodisto: 'kielitaitovaatimustyypit', cy });
  stubKoodistoRoute({ koodisto: 'kielitaitovaatimustyypitkuvaus', cy });
  stubKoodistoRoute({ koodisto: 'kieli', cy });
  stubKoodistoRoute({ koodisto: 'osaamistausta', cy });
};
